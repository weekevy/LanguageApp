import type { RequestHandler } from "express";
import { successResponse } from "../lib/responses.js";
import { getTranscript } from "../services/transcriptService.js";
import type { VideoIdParams } from "../validators/videoValidators.js";

export const readTranscript: RequestHandler = async (request, response) => {
  const { videoId } = request.validatedParams as VideoIdParams;
  const transcript = await getTranscript(videoId);
  response.json(successResponse(transcript));
};
