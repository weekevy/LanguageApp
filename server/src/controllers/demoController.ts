import type { DemoSessionPayload } from '@linguatube/shared'
import type { RequestHandler } from 'express'
import { successResponse } from '../lib/responses.js'
import { demoVideoId } from '../providers/mockData.js'
import { getTranscript } from '../services/transcriptService.js'
import { getVideoMetadata } from '../services/videoService.js'

export const readDemoSession: RequestHandler = async (_request, response) => {
  const payload: DemoSessionPayload = {
    metadata: getVideoMetadata(demoVideoId),
    transcript: await getTranscript(demoVideoId),
  }

  response.json(successResponse(payload))
}
