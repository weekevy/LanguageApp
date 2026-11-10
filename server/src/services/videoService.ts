import type { VideoMetadata } from '@linguatube/shared'
import { youtubeVideoIdSchema } from '@linguatube/shared'
import { AppError } from '../lib/errors.js'
import { demoVideoMetadata, mockSuggestions } from '../providers/mockData.js'

const supportedYouTubeHosts = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'youtu.be',
  'www.youtu.be',
])

export const extractYouTubeVideoId = (input: string): string => {
  let url: URL

  try {
    url = new URL(input.trim())
  } catch {
    throw new AppError(
      400,
      'INVALID_YOUTUBE_URL',
      'Enter a complete YouTube URL, such as https://www.youtube.com/watch?v=...',
    )
  }

  if (!supportedYouTubeHosts.has(url.hostname.toLocaleLowerCase())) {
    throw new AppError(
      400,
      'UNSUPPORTED_VIDEO_HOST',
      'Only youtube.com and youtu.be URLs are supported.',
    )
  }

  const segments = url.pathname.split('/').filter(Boolean)
  let candidate: string | null = null

  if (url.hostname.toLocaleLowerCase().endsWith('youtu.be')) {
    candidate = segments[0] ?? null
  } else if (url.pathname === '/watch') {
    candidate = url.searchParams.get('v')
  } else if (['embed', 'shorts', 'live', 'v'].includes(segments[0] ?? '')) {
    candidate = segments[1] ?? null
  }

  const result = youtubeVideoIdSchema.safeParse(candidate)

  if (!result.success) {
    throw new AppError(
      400,
      'INVALID_YOUTUBE_URL',
      'The URL does not contain a valid YouTube video ID.',
    )
  }

  return result.data
}

interface YouTubeOEmbedResponse {
  title: string
  author_name: string
  thumbnail_url: string
}

export const getVideoMetadata = async (
  videoId: string,
): Promise<VideoMetadata> => {
  const knownVideo = [demoVideoMetadata, ...mockSuggestions].find(
    (video) => video.videoId === videoId,
  )

  if (knownVideo) {
    return knownVideo
  }

  try {
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`,
      { signal: AbortSignal.timeout(5_000) },
    )

    if (!response.ok)
      throw new Error(`YouTube metadata returned ${response.status}`)
    const details = (await response.json()) as YouTubeOEmbedResponse

    return {
      videoId,
      title: details.title,
      channel: details.author_name,
      thumbnailUrl: details.thumbnail_url,
      language: 'en',
      difficulty: 'Intermediate',
      duration: 0,
    }
  } catch {
    return {
      videoId,
      title: 'YouTube learning session',
      channel: 'YouTube',
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      language: 'en',
      difficulty: 'Intermediate',
      duration: 0,
    }
  }
}
