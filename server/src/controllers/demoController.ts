import type { DemoSessionPayload } from '@linguatube/shared'
import type { RequestHandler } from 'express'
import { successResponse } from '../lib/responses.js'
import { demoVideoId } from '../providers/mockData.js'
import { MockTranscriptProvider } from '../providers/transcript/MockTranscriptProvider.js'
import { getVideoMetadata } from '../services/videoService.js'

const demoTranscriptProvider = new MockTranscriptProvider()

export const readDemoSession: RequestHandler = async (_request, response) => {
  const payload: DemoSessionPayload = {
    metadata: await getVideoMetadata(demoVideoId),
    transcript: await demoTranscriptProvider.getTranscript(demoVideoId),
  }

  response.json(successResponse(payload))
}
