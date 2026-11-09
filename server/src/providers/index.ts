import { env } from "../config/env.js";
import { MockTranscriptProvider } from "./transcript/MockTranscriptProvider.js";
import { RealTranscriptProvider } from "./transcript/RealTranscriptProvider.js";
import type { TranscriptProvider } from "./transcript/TranscriptProvider.js";
import { MockTranslationProvider } from "./translation/MockTranslationProvider.js";
import { RealTranslationProvider } from "./translation/RealTranslationProvider.js";
import type { TranslationProvider } from "./translation/TranslationProvider.js";

export const transcriptProvider: TranscriptProvider =
  env.TRANSCRIPT_PROVIDER === "mock"
    ? new MockTranscriptProvider()
    : new RealTranscriptProvider();

export const translationProvider: TranslationProvider =
  env.TRANSLATION_PROVIDER === "mock"
    ? new MockTranslationProvider()
    : new RealTranslationProvider();
