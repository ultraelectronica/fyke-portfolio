import { SpeakerLoudIcon, SpeakerOffIcon } from '@radix-ui/react-icons'
import { soundtrack, type AudioStatus } from '../hooks/useAudioVisualizer'

export default function SoundControl({ status, onToggle }: { status: AudioStatus; onToggle: () => void }) {
  const playing = status === 'on' || status === 'loading'
  return (
    <div className="sound-control">
      <button type="button" className="sound-control__toggle" aria-label={playing ? 'Turn sound off' : 'Turn sound on'} aria-pressed={playing} onClick={onToggle}>
        {playing ? <SpeakerLoudIcon aria-hidden="true" /> : <SpeakerOffIcon aria-hidden="true" />}
        <span>Sound {status === 'loading' ? 'loading' : playing ? 'on' : 'off'}</span>
        <span className={`sound-bars${status === 'on' ? ' sound-bars--playing' : ''}`} aria-hidden="true"><i /><i /><i /><i /></span>
      </button>
      <p className="sound-control__track mono" role="status">
        {status === 'error' ? 'Audio unavailable. Tap sound to retry.' : `${soundtrack.artist} / ${soundtrack.title}`}
      </p>
    </div>
  )
}
