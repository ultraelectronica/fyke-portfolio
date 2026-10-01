import { useEffect, useState } from 'react'

type GitHubRepository = { owner: string; name: string }
type DownloadState =
  | { status: 'idle' | 'loading' | 'error' }
  | { status: 'loaded'; count: number }

type Release = { assets: { download_count: number }[] }

async function getReleaseDownloads(repository: GitHubRepository, signal: AbortSignal) {
  let count = 0

  for (let page = 1; ; page += 1) {
    const url = `https://api.github.com/repos/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.name)}/releases?per_page=100&page=${page}`
    const response = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' },
      signal,
    })

    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`)

    const releases = await response.json() as Release[]
    if (!Array.isArray(releases)) throw new Error('Unexpected GitHub API response')

    for (const release of releases) {
      for (const asset of release.assets) count += asset.download_count
    }

    if (releases.length < 100) return count
  }
}

export default function useGitHubReleaseDownloads(repository?: GitHubRepository): DownloadState {
  const [result, setResult] = useState<DownloadState>({ status: 'idle' })

  useEffect(() => {
    if (!repository) {
      setResult({ status: 'idle' })
      return
    }

    const controller = new AbortController()
    setResult({ status: 'loading' })

    void getReleaseDownloads(repository, controller.signal).then(
      count => setResult({ status: 'loaded', count }),
      () => {
        if (!controller.signal.aborted) setResult({ status: 'error' })
      },
    )

    return () => controller.abort()
  }, [repository?.owner, repository?.name])

  return result
}
