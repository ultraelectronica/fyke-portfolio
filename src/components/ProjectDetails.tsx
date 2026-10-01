import { ArrowTopRightIcon, Cross1Icon } from '@radix-ui/react-icons'
import { useReducedMotion } from 'motion/react'
import { useLayoutEffect, useRef } from 'react'
import { type Project, formatIndex } from '../data/projects'
import ProjectArtwork from './ProjectArtwork'

export type TileOrigin = { left: number; top: number; width: number; height: number }

export default function ProjectDetails({ project, index, origin, onClose }: { project: Project; index: number; origin?: TileOrigin; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const artRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const animationsRef = useRef<Animation[]>([])
  const closingRef = useRef(false)
  const mountedRef = useRef(false)
  const reduce = useReducedMotion()

  const sourceTransform = () => {
    const rect = artRef.current?.getBoundingClientRect()
    if (!origin || !rect) return 'translateY(24px) scale(0.94)'
    return `translate(${origin.left - rect.left}px, ${origin.top - rect.top}px) scale(${origin.width / rect.width}, ${origin.height / rect.height}) skewY(10deg)`
  }

  const close = async () => {
    const dialog = dialogRef.current
    const art = artRef.current
    if (!dialog || !art || closingRef.current) return
    closingRef.current = true
    if (!reduce) {
      const artTransform = getComputedStyle(art).transform
      const dialogOpacity = getComputedStyle(dialog).opacity
      const copyOpacity = copyRef.current ? getComputedStyle(copyRef.current).opacity : '1'
      animationsRef.current.forEach(animation => animation.cancel())
      dialog.classList.add('details--transitioning')
      const duration = 420
      const options = { duration, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' as const }
      const animations = [
        art.animate([{ transform: artTransform }, { transform: sourceTransform() }], options),
        dialog.animate([{ opacity: dialogOpacity }, { opacity: 0 }], { duration: 220, delay: 200, fill: 'both' }),
      ]
      if (copyRef.current) animations.push(copyRef.current.animate([{ opacity: copyOpacity }, { opacity: 0 }], { duration: 150, fill: 'forwards' }))
      animationsRef.current = animations
      await Promise.all(animations.map(animation => animation.finished.catch(() => {})))
    }
    if (mountedRef.current) onClose()
  }

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    mountedRef.current = true
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    if (!reduce && artRef.current && copyRef.current) {
      dialog.classList.add('details--transitioning')
      animationsRef.current = [
        dialog.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, fill: 'both' }),
        artRef.current.animate([{ transform: sourceTransform() }, { transform: 'none' }], { duration: 620, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' }),
        copyRef.current.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: 180, easing: 'ease-out', fill: 'both' }),
      ]
      void animationsRef.current[1].finished.then(() => dialog.classList.remove('details--transitioning'), () => {})
    }
    return () => {
      mountedRef.current = false
      animationsRef.current.forEach(animation => animation.cancel())
      dialog.close()
      document.body.style.overflow = previousOverflow
      previousFocus?.focus({ preventScroll: true })
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className="details"
      aria-labelledby="detail-title"
      onCancel={(event) => { event.preventDefault(); void close() }}
      onClick={(event) => { if (event.target === event.currentTarget) void close() }}
    >
      <div className="details__panel">
        <header className="details__header">
          <span className="mono">Selected work / {formatIndex(index)}</span>
          <button type="button" className="icon-button" aria-label="Close project details" onClick={() => void close()} autoFocus>
            <Cross1Icon aria-hidden="true" />
          </button>
        </header>
        <div className="details__layout">
          <div ref={artRef} className="details__art"><ProjectArtwork key={project.id} project={project} /></div>
          <div ref={copyRef} className="details__copy">
            <h2 id="detail-title">{project.name}</h2>
            <p className="details__subtitle">{project.subtitle}</p>
            {project.status && <p className="details__status mono">{project.status}</p>}
            <dl className="details__facts">
              {project.role && <div><dt>Role</dt><dd>{project.role}</dd></div>}
              {project.period && <div><dt>When</dt><dd>{project.period}</dd></div>}
              <div><dt>Built with</dt><dd>{project.stack}</dd></div>
            </dl>
            <div className="details__description">{project.bullets.map((bullet) => <p key={bullet}>{bullet}</p>)}</div>
            {project.metric && <p className="details__metric">{project.metric}</p>}
            {project.links && (
              <nav className="details__links" aria-label={`${project.name} links`}>
                {project.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                    {link.label}<ArrowTopRightIcon aria-hidden="true" />
                  </a>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </dialog>
  )
}
