import { ArrowRightIcon, SpeakerLoudIcon } from '@radix-ui/react-icons'
import { motion, useReducedMotion } from 'motion/react'
import { type CSSProperties, useEffect, useRef, useState } from 'react'

export default function IntroLoader({ image, projectCount, onEnter }: { image?: string; projectCount: number; onEnter: (sound: boolean) => void }) {
  const reduce = useReducedMotion()
  const [ready, setReady] = useState(false)
  const introRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [])

  useEffect(() => {
    let active = true
    const firstImage = image ? new Image() : null
    const artwork = firstImage ? new Promise<void>((resolve) => {
      firstImage.onload = () => resolve()
      firstImage.onerror = () => resolve()
      firstImage.src = image!
    }) : Promise.resolve()
    const minimum = new Promise((resolve) => window.setTimeout(resolve, reduce ? 0 : 1100))
    const deadline = new Promise((resolve) => window.setTimeout(resolve, 2800))
    void Promise.race([Promise.all([artwork, document.fonts.ready, minimum]), deadline]).then(() => {
      if (active) setReady(true)
    })
    return () => { active = false }
  }, [image, reduce])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEnter(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onEnter])

  return (
    <motion.div
      ref={introRef}
      className="intro"
      role="dialog"
      aria-modal="true"
      aria-label="Enter Fyke’s portfolio"
      initial={false}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: '-5%' }}
      transition={{ duration: reduce ? 0 : 0.65, ease: [0.76, 0, 0.24, 1] }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const buttons = introRef.current?.querySelectorAll<HTMLButtonElement>('button')
        if (!buttons?.length) return
        const first = buttons[0]
        const last = buttons[buttons.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }}
    >
      <div className="intro__top">
        <span>Fyke Simon V. Tonel</span>
        <span className="mono">Portfolio / V3</span>
      </div>
      <div className="intro__center">
        <div className={`dot-matrix${ready ? ' dot-matrix--ready' : ''}`} aria-hidden="true">
          {Array.from({ length: 49 }, (_, index) => (
            <span key={index} style={{ '--delay': `${(Math.floor(index / 7) + index % 7) * 65}ms` } as CSSProperties} />
          ))}
        </div>
        <p className="intro__status mono" role="status">{ready ? `Selected work / ${String(projectCount).padStart(2, '0')} projects` : 'Preparing selected work'}</p>
      </div>
      <div className="intro__bottom">
        <p>Systems. Software. Sound.</p>
        <div className="intro__actions">
          <button type="button" className="enter-button" autoFocus onClick={() => onEnter(true)}>
            <SpeakerLoudIcon aria-hidden="true" /> Enter with sound <ArrowRightIcon aria-hidden="true" />
          </button>
          <button type="button" className="text-button intro__silent" onClick={() => onEnter(false)}>Enter silently</button>
        </div>
        <span className="intro__track mono">Pendulum / The Tempest</span>
      </div>
    </motion.div>
  )
}
