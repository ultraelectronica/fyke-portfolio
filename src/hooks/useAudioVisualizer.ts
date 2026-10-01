import { useCallback, useEffect, useRef, useState } from 'react'

export const soundtrack = {
  src: '/music/Pendulum - The Tempest (album version).mp3',
  artist: 'Pendulum',
  title: 'The Tempest',
}

type AudioGraph = {
  context: AudioContext
  source: MediaElementAudioSourceNode
  analyser: AnalyserNode
}

export type AudioStatus = 'off' | 'loading' | 'on' | 'error'

export function useAudioVisualizer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const graphRef = useRef<AudioGraph | null>(null)
  const attemptRef = useRef(0)
  const [status, setStatus] = useState<AudioStatus>('off')

  const pause = useCallback(() => {
    attemptRef.current += 1
    audioRef.current?.pause()
    void graphRef.current?.context.suspend().catch(() => {})
    setStatus('off')
  }, [])

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    const attempt = ++attemptRef.current
    setStatus('loading')
    audio.volume = 0.3

    try {
      if (audio.error) audio.load()
      if (!graphRef.current && typeof AudioContext !== 'undefined') {
        const context = new AudioContext()
        const source = context.createMediaElementSource(audio)
        const analyser = context.createAnalyser()
        analyser.fftSize = 2048
        analyser.smoothingTimeConstant = 0.68
        source.connect(analyser)
        analyser.connect(context.destination)
        graphRef.current = { context, source, analyser }
        analyserRef.current = analyser
      }

      const resume = graphRef.current?.context.resume()
      const playback = audio.play()
      await Promise.all([resume, playback])
      if (attempt === attemptRef.current) setStatus('on')
    } catch {
      if (attempt === attemptRef.current) {
        audio.pause()
        setStatus('error')
      }
    }
  }, [])

  const toggle = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) pause()
    else void play()
  }, [pause, play])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onPlaying = () => setStatus('on')
    const onWaiting = () => { if (!audio.paused) setStatus('loading') }
    const onPause = () => setStatus(current => current === 'error' ? 'error' : 'off')
    const onError = () => setStatus('error')
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('error', onError)

    return () => {
      attemptRef.current += 1
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('error', onError)
      audio.pause()
      graphRef.current?.source.disconnect()
      graphRef.current?.analyser.disconnect()
      void graphRef.current?.context.close().catch(() => {})
      graphRef.current = null
      analyserRef.current = null
    }
  }, [])

  return { audioRef, analyserRef, status, play, toggle }
}
