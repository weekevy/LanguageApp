import type { TranscriptPayload } from '@linguatube/shared'
import {
  demoTranscriptEntries,
  demoVideoId,
  mockTranscriptEntries,
} from '../mockData.js'
import type { TranscriptProvider } from './TranscriptProvider.js'

export class MockTranscriptProvider implements TranscriptProvider {
  readonly name = 'mock'

  async getTranscript(videoId: string): Promise<TranscriptPayload> {
    const isSynchronizedDemo = videoId === demoVideoId
    const entries = isSynchronizedDemo
      ? demoTranscriptEntries
      : mockTranscriptEntries

    return {
      videoId,
      language: 'en',
      isMock: true,
      notice: isSynchronizedDemo
        ? 'Curated demo: this hand-timed transcript is synchronized to the sample video.'
        : 'Demo transcript: this sample is not extracted from the selected YouTube video.',
      lines: entries.map((entry) => ({
        id: entry.id,
        start: entry.start,
        end: entry.end,
        text: entry.text,
        language: entry.language,
        speaker: entry.speaker ?? 'Host',
        ...(entry.words ? { words: entry.words } : {}),
        translatedText: entry.translations.fr ?? `[Mock French] ${entry.text}`,
        isTranslated: true,
      })),
    }
  }
}
