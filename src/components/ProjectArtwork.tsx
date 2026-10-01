import { useState } from 'react'
import type { Project } from '../data/projects'

export default function ProjectArtwork({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false)
  return project.image && !failed ? (
    <img
      className={`project-artwork project-artwork--${project.imageShape ?? 'mark'}`}
      src={project.image}
      alt={`${project.name} project artwork`}
      width="800"
      height="800"
      draggable="false"
      fetchPriority={project.id === 'flick' ? 'high' : 'auto'}
      onError={() => setFailed(true)}
    />
  ) : (
    <div className="artwork-fallback">
      <span className="artwork-fallback__name">{project.name}</span>
      <span className="artwork-fallback__note mono">{failed ? 'Artwork unavailable' : 'Artwork coming soon'}</span>
    </div>
  )
}
