import { type RefObject, useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

const LOW_FREQUENCY = 36
const HIGH_FREQUENCY = 14_000

function restingLevel(index: number, count: number) {
  const position = index / Math.max(1, count - 1)
  const body = 0.012 + 0.04 * Math.exp(-Math.pow((position - 0.5) / 0.24, 2))
  const detail = 0.016 * (0.5 + 0.5 * Math.sin(index * 0.39))
  return body + detail
}

export default function EcgVisualizer({ analyserRef, playing }: {
  analyserRef: RefObject<AnalyserNode | null>
  playing: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const levelsRef = useRef<Float32Array>(new Float32Array(0))
  const peaksRef = useRef<Float32Array>(new Float32Array(0))
  const wasPlayingRef = useRef(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    let width = 0
    let height = 0
    let frame = 0
    let lastFrame = 0
    let bandRanges: Array<[number, number]> = []
    let frequencyData = new Uint8Array(0)
    const analyser = analyserRef.current
    const sampleRate = analyser?.context.sampleRate ?? 48_000
    const binWidth = sampleRate / (analyser?.fftSize ?? 2048)
    const oldPlaying = wasPlayingRef.current
    const settleUntil = !playing && oldPlaying ? performance.now() + 650 : 0
    wasPlayingRef.current = playing

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      const count = Math.min(192, Math.max(72, Math.round(width / 6)))
      const levels = new Float32Array(count)
      const peaks = new Float32Array(count)
      const previousLevels = levelsRef.current
      const previousPeaks = peaksRef.current
      for (let i = 0; i < count; i++) {
        const oldIndex = count > 1 ? i / (count - 1) * Math.max(0, previousLevels.length - 1) : 0
        const before = Math.floor(oldIndex)
        const after = Math.min(previousLevels.length - 1, before + 1)
        const blend = oldIndex - before
        const resting = restingLevel(i, count)
        levels[i] = previousLevels.length
          ? previousLevels[before] * (1 - blend) + previousLevels[after] * blend
          : resting
        peaks[i] = previousPeaks.length
          ? previousPeaks[before] * (1 - blend) + previousPeaks[after] * blend
          : resting
      }
      levelsRef.current = levels
      peaksRef.current = peaks

      if (analyser) {
        frequencyData = new Uint8Array(analyser.frequencyBinCount)
        const nyquist = sampleRate / 2
        const highest = Math.min(HIGH_FREQUENCY, nyquist * 0.94)
        const binCount = analyser.frequencyBinCount
        bandRanges = Array.from({ length: count }, (_, i) => {
          const lower = LOW_FREQUENCY * Math.pow(highest / LOW_FREQUENCY, i / count)
          const upper = LOW_FREQUENCY * Math.pow(highest / LOW_FREQUENCY, (i + 1) / count)
          const start = Math.max(1, Math.floor(lower / (nyquist / binCount)))
          const end = Math.min(binCount, Math.max(start + 1, Math.ceil(upper / (nyquist / binCount))))
          return [start, end]
        })
      } else {
        frequencyData = new Uint8Array(0)
        bandRanges = []
      }

      cancelAnimationFrame(frame)
      draw(performance.now())
    }

    const draw = (now: number) => {
      const visible = !document.hidden
      const animate = visible && !reduce && (playing || now < settleUntil)
      if (animate && now - lastFrame < 1000 / 48) {
        frame = requestAnimationFrame(draw)
        return
      }

      const levels = levelsRef.current
      const peaks = peaksRef.current
      if (playing && analyser && frequencyData.length) {
        analyser.getByteFrequencyData(frequencyData)
      }

      let bass = 0
      if (playing && frequencyData.length) {
        const bassEnd = Math.min(frequencyData.length, Math.ceil(150 / binWidth))
        for (let i = 1; i < bassEnd; i++) bass += frequencyData[i] / 255
        bass /= Math.max(1, bassEnd - 1)
      }

      for (let i = 0; i < levels.length; i++) {
        const idle = restingLevel(i, levels.length)
        let target = idle
        if (playing && bandRanges[i] && frequencyData.length) {
          const [start, end] = bandRanges[i]
          let peak = 0
          let average = 0
          for (let bin = start; bin < end; bin++) {
            const value = frequencyData[bin] / 255
            peak = Math.max(peak, value)
            average += value
          }
          const magnitude = peak * 0.72 + average / Math.max(1, end - start) * 0.28
          const audible = Math.max(0, (magnitude - 0.035) / 0.82)
          const lowLift = i < levels.length * 0.2 ? bass * 0.12 : 0
          target = Math.min(0.96, Math.pow(audible, 0.8) * 0.9 + lowLift + 0.018)
        }

        const level = levels[i]
        const easing = target > level ? 0.52 : 0.105
        levels[i] += (target - level) * easing
        peaks[i] = Math.max(levels[i], peaks[i] * 0.965)
      }

      context.clearRect(0, 0, width, height)
      const middle = height / 2
      const reach = Math.min(height * 0.44, 152)
      const spacing = width / Math.max(1, levels.length - 1)
      const ink = context.createLinearGradient(0, 0, width, 0)
      ink.addColorStop(0, 'rgba(238,238,233,0)')
      ink.addColorStop(0.12, `rgba(238,238,233,${playing ? 0.38 : 0.18})`)
      ink.addColorStop(0.5, `rgba(238,238,233,${playing ? 0.76 : 0.36})`)
      ink.addColorStop(0.88, `rgba(238,238,233,${playing ? 0.44 : 0.2})`)
      ink.addColorStop(1, 'rgba(238,238,233,0)')

      context.beginPath()
      context.moveTo(0, middle)
      context.lineTo(width, middle)
      context.strokeStyle = `rgba(238,238,233,${playing ? 0.16 : 0.08})`
      context.lineWidth = 0.7
      context.stroke()

      context.beginPath()
      for (let i = 0; i < peaks.length; i++) {
        const x = i * spacing
        const y = middle - peaks[i] * reach
        if (i === 0) context.moveTo(x, y)
        else context.lineTo(x, y)
      }
      context.strokeStyle = ink
      context.lineWidth = 0.8
      context.stroke()

      context.beginPath()
      for (let i = 0; i < levels.length; i++) {
        const x = i * spacing
        const y = middle - levels[i] * reach
        if (i === 0) context.moveTo(x, y)
        else context.lineTo(x, y)
      }
      for (let i = levels.length - 1; i >= 0; i--) {
        context.lineTo(i * spacing, middle + levels[i] * reach)
      }
      context.closePath()
      context.fillStyle = `rgba(238,238,233,${playing ? 0.055 : 0.018})`
      context.fill()

      context.beginPath()
      for (let i = 0; i < levels.length; i++) {
        const x = i * spacing
        const y = middle - levels[i] * reach
        if (i === 0) context.moveTo(x, y)
        else context.lineTo(x, y)
      }
      context.strokeStyle = ink
      context.lineWidth = 1.25
      context.stroke()

      context.beginPath()
      for (let i = 0; i < levels.length; i++) {
        const x = i * spacing
        const amplitude = levels[i] * reach
        context.moveTo(x, middle - amplitude)
        context.lineTo(x, middle + amplitude)
      }
      context.strokeStyle = ink
      context.globalAlpha = playing ? 0.64 : 0.42
      context.lineWidth = Math.max(0.75, Math.min(1.35, spacing * 0.17))
      context.stroke()
      context.globalAlpha = 1

      lastFrame = now
      if (animate) frame = requestAnimationFrame(draw)
    }

    const visibility = () => {
      cancelAnimationFrame(frame)
      draw(performance.now())
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    document.addEventListener('visibilitychange', visibility)
    resize()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [analyserRef, playing, reduce])

  return <canvas ref={canvasRef} className="spectral-ribbon" aria-hidden="true" />
}
