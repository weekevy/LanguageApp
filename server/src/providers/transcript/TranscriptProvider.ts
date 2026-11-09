import type { TranscriptPayload } from "@linguatube/shared";

export interface TranscriptProvider {
  readonly name: string;
  getTranscript(videoId: string): Promise<TranscriptPayload>;
}
