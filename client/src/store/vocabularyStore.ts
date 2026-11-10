import type { LanguageCode } from '@linguatube/shared'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SavedWord {
  id: string
  text: string
  language: LanguageCode
  videoId: string
  lineId: string
  context: string
  savedAt: string
}

interface VocabularyState {
  words: SavedWord[]
  saveWord: (word: Omit<SavedWord, 'id' | 'savedAt'>) => void
  removeWord: (id: string) => void
}

export const getSavedWordId = (text: string, language: LanguageCode) =>
  `${language}:${text.toLocaleLowerCase()}`

export const useVocabularyStore = create<VocabularyState>()(
  persist(
    (set) => ({
      words: [],
      saveWord: (word) =>
        set((state) => {
          const id = getSavedWordId(word.text, word.language)
          if (state.words.some((savedWord) => savedWord.id === id)) return state
          return {
            words: [
              { ...word, id, savedAt: new Date().toISOString() },
              ...state.words,
            ],
          }
        }),
      removeWord: (id) =>
        set((state) => ({
          words: state.words.filter((word) => word.id !== id),
        })),
    }),
    { name: 'linguatube-saved-vocabulary', version: 1 },
  ),
)
