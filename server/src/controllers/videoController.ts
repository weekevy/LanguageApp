import type { RequestHandler } from 'express'
import type { ParseVideoInput, VideoParseResult } from '@linguatube/shared'
import { successResponse } from '../lib/responses.js'
import { consumeVideoLoad } from '../services/usageService.js'
import {
  extractYouTubeVideoId,
  getVideoMetadata,
} from '../services/videoService.js'

export const parseVideo: RequestHandler = async (request, response) => {
  const input = request.validatedBody as ParseVideoInput
  const identity = request.mockIdentity ?? {
    id: 'anonymous-local-device',
    plan: 'free' as const,
  }
  const videoId = extractYouTubeVideoId(input.url)
  const limits = consumeVideoLoad(identity.id, identity.plan, videoId)
  const result: VideoParseResult = {
    videoId,
    metadata: await getVideoMetadata(videoId),
    limits,
  }

  response.json(successResponse(result))
}
