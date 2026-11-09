import type { TranscriptPayload } from "@linguatube/shared";
import { AppError } from "../../lib/errors.js";
import type { TranscriptProvider } from "./TranscriptProvider.js";

export class RealTranscriptProvider implements TranscriptProvider {
  readonly name = "real-unconfigured";

  async getTranscript(_videoId: string): Promise<TranscriptPayload> {
    throw new AppError(
      503,
      "TRANSCRIPT_PROVIDER_UNAVAILABLE",
      "A real transcript provider has not been configured. Switch TRANSCRIPT_PROVIDER to mock or add a supported provider implementation.",
    );
  }
}
