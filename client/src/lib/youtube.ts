const videoIdPattern = /^[A-Za-z0-9_-]{11}$/
const supportedHosts = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtu.be',
  'www.youtu.be',
])

export const parseYouTubeUrl = (input: string): string | null => {
  let url: URL

  try {
    url = new URL(input.trim())
  } catch {
    return null
  }

  const hostname = url.hostname.toLocaleLowerCase()
  if (!supportedHosts.has(hostname)) return null

  const segments = url.pathname.split('/').filter(Boolean)
  let candidate: string | null = null

  if (hostname.endsWith('youtu.be')) {
    candidate = segments[0] ?? null
  } else if (url.pathname === '/watch') {
    candidate = url.searchParams.get('v')
  } else if (['embed', 'shorts'].includes(segments[0] ?? '')) {
    candidate = segments[1] ?? null
  }

  return candidate && videoIdPattern.test(candidate) ? candidate : null
}

export const toYouTubeUrl = (videoId: string) =>
  `https://www.youtube.com/watch?v=${videoId}`
