import type { LanguageCode } from '@linguatube/shared'
import { languageNames } from '@linguatube/shared'
import { allMockTranscriptEntries } from '../mockData.js'
import type {
  ProviderTranslation,
  TranslationProvider,
} from './TranslationProvider.js'

const normalize = (value: string) => value.trim().toLocaleLowerCase()

export class MockTranslationProvider implements TranslationProvider {
  readonly name = 'mock'

  async translate(
    text: string,
    _sourceLang: LanguageCode,
    targetLang: LanguageCode,
  ): Promise<ProviderTranslation> {
    const entry = allMockTranscriptEntries.find(
      (candidate) => normalize(candidate.text) === normalize(text),
    )
    const knownTranslation = entry?.translations[targetLang]

    if (knownTranslation) {
      return { text: knownTranslation, isMock: true }
    }

    return {
      text: `[Mock ${languageNames[targetLang]}] ${text}`,
      isMock: true,
    }
  }
}
