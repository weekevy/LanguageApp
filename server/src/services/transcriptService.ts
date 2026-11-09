import type { TranscriptPayload } from "@linguatube/shared";
import { transcriptProvider } from "../providers/index.js";

export const getTranscript = async (
  videoId: string,
): Promise<TranscriptPayload> => transcriptProvider.getTranscript(videoId);
