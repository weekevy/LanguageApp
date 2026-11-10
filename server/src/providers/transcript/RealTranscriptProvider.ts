import type {
  TranscriptLine,
  TranscriptPayload,
  TranscriptWord,
} from '@linguatube/shared'
import { getSubtitles, type Subtitle } from 'youtube-caption-extractor'
import { AppError } from '../../lib/errors.js'
import type { TranscriptProvider } from './TranscriptProvider.js'

const fetchYouTube: typeof fetch = (input, init = {}) => {
  const timeoutSignal = AbortSignal.timeout(8_000)
  const signal = init.signal
    ? AbortSignal.any([init.signal, timeoutSignal])
    : timeoutSignal
  return fetch(input, { ...init, signal })
}

export const normalizeSubtitles = (
  videoId: string,
  subtitles: Subtitle[],
): TranscriptLine[] =>
  subtitles
    .map((subtitle, index): TranscriptLine | null => {
      const text = subtitle.text.replace(/\s+/g, ' ').trim()
      const start = Number.parseFloat(subtitle.start)
      if (!text || !Number.isFinite(start) || start < 0) return null

      const parsedDuration = Number.parseFloat(subtitle.dur)
      const nextStart = Number.parseFloat(subtitles[index + 1]?.start ?? '')
      const duration =
        Number.isFinite(parsedDuration) && parsedDuration > 0
          ? parsedDuration
          : Number.isFinite(nextStart) && nextStart > start
            ? nextStart - start
            : 2
      const rawEnd = start + Math.max(duration, 0.1)
      const end =
        Number.isFinite(nextStart) && nextStart > start
          ? Math.max(start + 0.05, Math.min(rawEnd, nextStart))
          : rawEnd
      const tokens = text.match(/\S+/g) ?? []
      const tokenWeights = tokens.map((token) =>
        Math.max(1, token.replace(/[^\p{L}\p{N}]/gu, '').length),
      )
      const totalWeight = tokenWeights.reduce((sum, weight) => sum + weight, 0)
      let elapsedWeight = 0
      const words: TranscriptWord[] = tokens.map((word, wordIndex) => {
        const wordStart =
          start + ((end - start) * elapsedWeight) / Math.max(totalWeight, 1)
        elapsedWeight += tokenWeights[wordIndex] ?? 1
        return {
          id: `${videoId}-${index}-word-${wordIndex}`,
          start: wordStart,
          end:
            start + ((end - start) * elapsedWeight) / Math.max(totalWeight, 1),
          text: word,
        }
      })

      return {
        id: `${videoId}-caption-${index}`,
        start,
        end,
        text,
        language: 'en',
        isTranslated: false,
        ...(words.length > 0 ? { words } : {}),
      }
    })
    .filter((line): line is TranscriptLine => line !== null)

export class RealTranscriptProvider implements TranscriptProvider {
  readonly name = 'youtube-captions'

  async getTranscript(videoId: string): Promise<TranscriptPayload> {
    try {
      const subtitles = await getSubtitles({
        videoID: videoId,
        lang: 'en',
        fetch: fetchYouTube,
      })

      if (subtitles.length === 0) {
        throw new AppError(
          404,
          'CAPTIONS_UNAVAILABLE',
          'This video does not provide a transcript or caption track.',
        )
      }

      const lines = normalizeSubtitles(videoId, subtitles)

      return {
        videoId,
        language: 'en',
        isMock: false,
        notice:
          'YouTube captions for this video. Word highlighting is estimated within each caption segment.',
        lines,
      }
    } catch (error) {
      if (error instanceof AppError) throw error

      const message = error instanceof Error ? error.message : String(error)
      const unavailable = /unavailable|private|playable/i.test(message)

      throw new AppError(
        unavailable ? 404 : 502,
        unavailable ? 'VIDEO_UNAVAILABLE' : 'CAPTION_EXTRACTION_FAILED',
        unavailable
          ? 'This YouTube video is private, unavailable, or cannot be embedded.'
          : 'YouTube captions could not be retrieved. The video may have no captions or YouTube may be temporarily blocking caption access.',
      )
    }
  }
}
