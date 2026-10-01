import { ArrowLeftIcon, ArrowRightIcon, ArrowTopRightIcon, ListBulletIcon } from '@radix-ui/react-icons'
import { motion, type MotionValue, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { formatIndex, type Project, projects } from '../data/projects'
import ProjectArtwork from './ProjectArtwork'
import ProjectDetails, { type TileOrigin } from './ProjectDetails'

const wrapIndex = (value: number) => ((value % projects.length) + projects.length) % projects.length
const relativePosition = (value: number) => wrapIndex(value + projects.length / 2) - projects.length / 2

function ProjectTile({ project, index, selected, opened, position, spacing, onSelect, onOpen }: {
  project: Project
  index: number
  selected: boolean
  opened: boolean
  position: MotionValue<number>
  spacing: number
  onSelect: () => void
  onOpen: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const reduce = useReducedMotion()
  const offset = useTransform(position, value => relativePosition(index - value))
  const x = useTransform(offset, value => value * spacing)
  const y = useTransform(offset, value => -value * spacing * 0.53)
  const opacity = useTransform(offset, value => Math.min(1, (projects.length / 2 - Math.abs(value)) * 5))
  const pointerEvents = useTransform(opacity, value => value < 0.01 ? 'none' : 'auto')
  const zIndex = useTransform(offset, value => 20 - Math.round(value))

  return (
    <motion.div
      className={`gallery-tile-position${hovered ? ' gallery-tile-position--hovered' : ''}`}
      style={{ x, y, opacity: opened ? 0 : opacity, pointerEvents, zIndex: hovered ? 40 : zIndex }}
      onPointerEnter={event => { if (event.pointerType === 'mouse' && event.buttons === 0) setHovered(true) }}
      onPointerLeave={() => setHovered(false)}
      onPointerDown={() => setHovered(false)}
    >
      <motion.div className="gallery-tile-reveal" animate={{ x: hovered ? spacing * 0.48 : 0, y: hovered ? spacing * 0.12 : 0 }} transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}>
        <button
          type="button"
          className={`gallery-tile gallery-tile--${project.id}${selected ? ' gallery-tile--selected' : ''}`}
          aria-label={`View ${project.name} project details${project.status ? `, ${project.status.toLowerCase()}` : ''}`}
          aria-current={selected ? 'true' : undefined}
          onFocus={event => { if (event.currentTarget.matches(':focus-visible')) { onSelect(); setHovered(true) } }}
          onBlur={() => setHovered(false)}
          onClick={onOpen}
        >
          <span className="gallery-tile__number mono">{formatIndex(index)}</span>
          {project.status && <span className="gallery-tile__status mono">{project.status}</span>}
          <div className="gallery-tile__art"><ProjectArtwork project={project} /></div>
          <span className="gallery-tile__footer"><span>{project.name}</span><ArrowTopRightIcon aria-hidden="true" /></span>
        </button>
      </motion.div>
    </motion.div>
  )
}

export default function ProjectShowcase({ active }: { active: boolean }) {
  const [index, setIndex] = useState(0)
  const [detailIndex, setDetailIndex] = useState<number | null>(null)
  const [detailOrigin, setDetailOrigin] = useState<TileOrigin | undefined>()
  const [picker, setPicker] = useState(false)
  const [spacing, setSpacing] = useState(180)
  const stageRef = useRef<HTMLDivElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)
  const pickerButtonRef = useRef<HTMLButtonElement>(null)
  const pointerRef = useRef<{ id: number; x: number; y: number; start: number; moved: boolean } | null>(null)
  const suppressClickRef = useRef(false)
  const target = useMotionValue(0)
  const spring = useSpring(target, { stiffness: 130, damping: 28, mass: 0.65 })
  const reduce = useReducedMotion()
  const position = reduce ? target : spring
  const project = projects[index]

  useMotionValueEvent(position, 'change', value => setIndex(wrapIndex(Math.round(value))))

  const select = useCallback((next: number) => {
    const current = target.get()
    target.set(current + relativePosition(next - current))
    setPicker(false)
  }, [target])

  const openDetails = (next: number) => {
    const tile = stageRef.current?.querySelector(`.gallery-tile--${projects[next].id}`)
    const rect = tile?.getBoundingClientRect()
    setDetailOrigin(rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : undefined)
    const current = position.get()
    target.set(current)
    spring.jump(current)
    setPicker(false)
    setDetailIndex(next)
  }

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const update = () => {
      const divisor = window.matchMedia('(pointer: coarse)').matches ? 6.5 : 8
      setSpacing(Math.max(window.innerWidth, window.innerHeight) / divisor)
    }
    const observer = new ResizeObserver(update)
    observer.observe(stage)
    update()
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !active || detailIndex !== null) return
    let timeout = 0
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return
      event.preventDefault()
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      const units = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientHeight : 1
      target.set(target.get() + Math.max(-1, Math.min(1, delta * units / 380)))
      window.clearTimeout(timeout)
      timeout = window.setTimeout(() => target.set(Math.round(target.get())), 160)
    }
    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => { stage.removeEventListener('wheel', onWheel); window.clearTimeout(timeout) }
  }, [active, detailIndex, target])

  useEffect(() => {
    if (!active || detailIndex !== null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if ((event.target as HTMLElement).matches('input, textarea, select, [contenteditable="true"]')) return
      if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault()
        target.set(Math.round(target.get()) + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1))
      }
      if (event.key === 'Escape' && picker) { setPicker(false); pickerButtonRef.current?.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, detailIndex, picker, target])

  useEffect(() => {
    if (!picker) return
    const closeOutside = (event: PointerEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) setPicker(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [picker])

  return (
    <section className="showcase" aria-label="Selected projects">
      <div
        ref={stageRef}
        className="gallery-stage"
        aria-label="Scroll or drag to browse project tiles"
        onPointerDown={(event) => {
          if (event.button !== 0 || !event.isPrimary) return
          suppressClickRef.current = false
          pointerRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, start: target.get(), moved: false }
        }}
        onPointerMove={(event) => {
          const pointer = pointerRef.current
          if (!pointer || pointer.id !== event.pointerId) return
          const dx = event.clientX - pointer.x
          const dy = event.clientY - pointer.y
          if (!pointer.moved && Math.hypot(dx, dy) < 8) return
          pointer.moved = true
          suppressClickRef.current = true
          event.currentTarget.setPointerCapture(event.pointerId)
          target.set(pointer.start + (dy - dx) / (spacing * 1.5))
        }}
        onPointerUp={() => {
          if (pointerRef.current?.moved) target.set(Math.round(target.get()))
          pointerRef.current = null
        }}
        onPointerCancel={() => { pointerRef.current = null; target.set(Math.round(target.get())) }}
        onClickCapture={(event) => {
          if (suppressClickRef.current) { event.preventDefault(); event.stopPropagation(); suppressClickRef.current = false }
        }}
      >
        <div className="gallery-stage__origin">
          {projects.map((item, itemIndex) => (
            <ProjectTile
              key={item.id}
              project={item}
              index={itemIndex}
              selected={itemIndex === index}
              opened={detailIndex === itemIndex}
              position={position}
              spacing={spacing}
              onSelect={() => { if (!pointerRef.current) select(itemIndex) }}
              onOpen={() => openDetails(itemIndex)}
            />
          ))}
        </div>
        <span className="gallery-scroll-hint mono">Scroll to explore <span aria-hidden="true">↗</span></span>
      </div>
      <div className="gallery-bar">
        <div className="showcase__caption">
          <span className="mono muted">Selected work / {formatIndex(index)}</span>
          <h2>{project.name}</h2>
          <p>{project.subtitle}</p>
          {project.status && <span className="showcase__status mono">{project.status}</span>}
          <button type="button" className="text-button showcase__details" onClick={() => openDetails(index)}>Project details <ArrowTopRightIcon aria-hidden="true" /></button>
        </div>
        <div className="gallery-controls">
          <div className="gallery-steps">
            <button type="button" className="icon-button" aria-label="Previous project" onClick={() => target.set(Math.round(target.get()) - 1)}><ArrowLeftIcon aria-hidden="true" /></button>
            <button type="button" className="icon-button" aria-label="Next project" onClick={() => target.set(Math.round(target.get()) + 1)}><ArrowRightIcon aria-hidden="true" /></button>
          </div>
          <div className="project-navigation" ref={pickerRef}>
            <button ref={pickerButtonRef} className="project-picker-toggle mono" type="button" aria-expanded={picker} aria-controls="project-picker" onClick={() => setPicker(!picker)}>
              <span>{formatIndex(index)} <span className="muted">/ {String(projects.length).padStart(2, '0')}</span></span><ListBulletIcon aria-hidden="true" /><span className="sr-only">All projects</span>
            </button>
            {picker && (
              <div id="project-picker" className="project-picker" aria-label="All projects">
                {projects.map((item, itemIndex) => (
                  <button key={item.id} type="button" aria-current={itemIndex === index ? 'true' : undefined} onClick={() => { select(itemIndex); pickerButtonRef.current?.focus() }}>
                    <span className="mono">{formatIndex(itemIndex)}</span><span>{item.name}</span>
                    {itemIndex === index && <span className="project-picker__current" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{project.name}, project {index + 1} of {projects.length}</p>
      {detailIndex !== null && <ProjectDetails project={projects[detailIndex]} index={detailIndex} origin={detailOrigin} onClose={() => setDetailIndex(null)} />}
    </section>
  )
}
