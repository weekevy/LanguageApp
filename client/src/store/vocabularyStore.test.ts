import { beforeEach, describe, expect, it } from 'vitest'
import { useVocabularyStore } from './vocabularyStore'

describe('saved vocabulary', () => {
  beforeEach(() => {
    useVocabularyStore.setState({ words: [] })
    localStorage.removeItem('linguatube-saved-vocabulary')
  })

  it('saves a selected word once with its video context', () => {
    const word = {
      text: 'language',
      language: 'en' as const,
      videoId: 'M7lc1UVf-VE',
      lineId: 'line-1',
      context: 'Learning a language takes practice.',
    }

    useVocabularyStore.getState().saveWord(word)
    useVocabularyStore.getState().saveWord(word)

    expect(useVocabularyStore.getState().words).toHaveLength(1)
    expect(useVocabularyStore.getState().words[0]).toMatchObject(word)
    expect(localStorage.getItem('linguatube-saved-vocabulary')).toContain(
      'language',
    )
  })
})
