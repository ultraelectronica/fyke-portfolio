import { type PanInfo, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { Fragment, type ReactNode, useState } from 'react'
import { byId, cards, type CardData } from '../cards'

const SPREAD = { x: 16, y: 12, rot: 2.4, scale: 0.035 }

export default function CardStack() {
  const [order, setOrder] = useState(() => cards.map((c) => c.id))
  const reduce = useReducedMotion()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [9, -9]), { stiffness: 140, damping: 16 })
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [-9, 9]), { stiffness: 140, damping: 16 })

  const promote = (id: string) => setOrder((prev) => [id, ...prev.filter((x) => x !== id)])
  const cycleBack = () => setOrder((prev) => [...prev.slice(1), prev[0]])

  const handleTilt = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const resetTilt = () => {
    mx.set(0)
    my.set(0)
  }

  const fling = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 480) cycleBack()
  }

  return (
    <div className="scene">
      {order.map((id, p) => {
        const card = byId[id]
        const front = p === 0
        const interactive = front && !reduce
        const pos = {
          x: card.dx + p * SPREAD.x,
          y: card.dy + p * SPREAD.y,
          rotate: card.rot + p * SPREAD.rot,
          scale: 1 - p * SPREAD.scale,
          zIndex: 100 - p,
        }

        return (
          <motion.div
            key={id}
            className="card-layer"
            style={{ zIndex: pos.zIndex }}
            initial={false}
            animate={{ x: pos.x, y: pos.y, rotate: pos.rotate, scale: pos.scale }}
            transition={{ type: 'spring', stiffness: 250, damping: 26 }}
          >
            <motion.div
              className={`card${front ? ' card--front' : ''}`}
              style={interactive ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
              drag={interactive ? 'x' : false}
              dragSnapToOrigin
              dragElastic={0.6}
              onPointerMove={interactive ? handleTilt : undefined}
              onPointerLeave={interactive ? resetTilt : undefined}
              onDragEnd={interactive ? fling : undefined}
              onClick={() => !front && promote(id)}
              role={!front ? 'button' : undefined}
              tabIndex={!front ? 0 : undefined}
              onKeyDown={(e) => {
                if (!front && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  promote(id)
                }
              }}
              aria-label={card.heading ?? card.name ?? card.id}
            >
              <CardBody card={card} />
            </motion.div>
          </motion.div>
        )
      })}

      <div className="tabs" aria-hidden={order.length <= 1}>
        {order.map((id, p) => {
          if (p === 0) return null
          const card = byId[id]
          return (
            <button
              key={id}
              type="button"
              className="tab"
              style={{ transform: `rotate(${1.5 + p}deg) translateY(${p * 2}px)` }}
              onClick={() => promote(id)}
            >
              {card.tab}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function CardBody({ card }: { card: CardData }) {
  if (card.kind === 'intro') {
    return (
      <div className="card__body">
        <span className="kicker">{card.tagline}</span>
        <h1 className="title">{card.name}</h1>
        <span className="rule" />
        <p className="pitch">{card.pitch}</p>
        <span className="spacer" />
        <div className="links">
          {card.links?.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    )
  }

  const segs: ReactNode[] = []
  if (card.metric) segs.push(card.metric)
  card.links?.forEach((l) =>
    segs.push(
      <a
        key={l.href}
        className="metric__link"
        href={l.href}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {l.label}
      </a>,
    ),
  )

  return (
    <div className="card__body">
      {card.period && <span className="kicker">{card.period}</span>}
      <h2 className="title">{card.heading}</h2>
      {card.subtitle && <span className="subtitle">{card.subtitle}</span>}
      <span className="rule" />
      <span className="stack">{card.stack}</span>
      <ul className="bullets">
        {card.bullets?.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      {segs.length > 0 && (
        <p className="metric">
          {segs.map((s, i) => (
            <Fragment key={i}>
              {i > 0 ? <span className="metric__sep"> · </span> : null}
              {s}
            </Fragment>
          ))}
        </p>
      )}
    </div>
  )
}
