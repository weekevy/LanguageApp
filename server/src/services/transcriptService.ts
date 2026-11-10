import type { TranscriptPayload } from '@linguatube/shared'
import { transcriptProvider } from '../providers/index.js'

const transcriptCache = new Map<
  string,
  { expiresAt: number; payload: TranscriptPayload }
>()
const transcriptCacheTtlMs = 60 * 60 * 1_000

export const getTranscript = async (
  videoId: string,
): Promise<TranscriptPayload> => {
  const cached = transcriptCache.get(videoId)
  if (cached && cached.expiresAt > Date.now()) return cached.payload

  const payload = await transcriptProvider.getTranscript(videoId)
  transcriptCache.set(videoId, {
    expiresAt: Date.now() + transcriptCacheTtlMs,
    payload,
  })
  return payload
}
