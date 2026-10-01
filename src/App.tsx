import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { AnimatePresence } from 'motion/react'
import { useCallback, useRef, useState } from 'react'
import EcgVisualizer from './components/EcgVisualizer'
import IntroLoader from './components/IntroLoader'
import ProjectShowcase from './components/ProjectShowcase'
import SoundControl from './components/SoundControl'
import { projects } from './data/projects'
import { soundtrack, useAudioVisualizer } from './hooks/useAudioVisualizer'

export default function App() {
  const [entered, setEntered] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const { audioRef, analyserRef, status, play, toggle } = useAudioVisualizer()
  const enter = useCallback((sound: boolean) => {
    if (sound) void play()
    setEntered(true)
  }, [play])

  return (
    <>
      <audio ref={audioRef} src={soundtrack.src} preload="none" loop />
      <main ref={mainRef} className={`portfolio${entered ? ' portfolio--entered' : ''}`} inert={!entered} tabIndex={-1} aria-label="Fyke Simon V. Tonel’s portfolio">
        <header className="portfolio__header frame-enter">
          <h1 className="identity">Fyke Simon<br /><span>V. Tonel</span><span className="identity__dot" aria-hidden="true">·</span></h1>
          <nav className="contact-links" aria-label="Contact and socials">
            <a href="mailto:fyketonel22@protonmail.com">Email <ArrowTopRightIcon aria-hidden="true" /></a>
            <a href="https://github.com/ultraelectronica" target="_blank" rel="noreferrer">GitHub <ArrowTopRightIcon aria-hidden="true" /></a>
          </nav>
        </header>
        <div className="portfolio__center frame-enter">
          <EcgVisualizer analyserRef={analyserRef} playing={entered && status === 'on'} />
          <ProjectShowcase active={entered} />
        </div>
        <footer className="portfolio__footer frame-enter">
          <div className="portfolio__utilities">
            <SoundControl status={status} onToggle={toggle} />
            <nav className="document-links" aria-label="Documents">
              <a href="/CV_Fyke_Tonel.pdf" target="_blank" rel="noreferrer">CV <ArrowTopRightIcon aria-hidden="true" /></a>
              <a href="/Resume_Fyke_Tonel.pdf" target="_blank" rel="noreferrer">Resume <ArrowTopRightIcon aria-hidden="true" /></a>
            </nav>
          </div>
          <div className="about">
            <p>Solo developer <span className="muted">behind</span> Moss.</p>
            <p>Flick · Latch · Norn <span className="muted">(soon)</span>.</p>
            <p>Systems & mobile engineer.</p>
          </div>
        </footer>
      </main>
      <AnimatePresence onExitComplete={() => mainRef.current?.focus({ preventScroll: true })}>
        {!entered && <IntroLoader key="intro" image={projects[0].image} projectCount={projects.length} onEnter={enter} />}
      </AnimatePresence>
    </>
  )
}
