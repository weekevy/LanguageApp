import type { LanguageCode, TranscriptLine } from '@linguatube/shared'
import { create } from 'zustand'

interface TranscriptState {
  lines: TranscriptLine[]
  language: LanguageCode
  isMock: boolean
  notice: string | null
  isLoading: boolean
  error: string | null
  translatingLineIds: Set<string>
  setTranscript: (payload: {
    lines: TranscriptLine[]
    language: LanguageCode
    isMock: boolean
    notice: string
  }) => void
  clearTranscript: () => void
  startLoading: () => void
  setError: (message: string) => void
  setLineTranslation: (lineId: string, translatedText: string) => void
  setTranslating: (lineId: string, isTranslating: boolean) => void
  clearTranslations: () => void
}

export const useTranscriptStore = create<TranscriptState>((set) => ({
  lines: [],
  language: 'en',
  isMock: true,
  notice: null,
  isLoading: false,
  error: null,
  translatingLineIds: new Set(),
  setTranscript: ({ lines, language, isMock, notice }) =>
    set({
      lines,
      language,
      isMock,
      notice,
      isLoading: false,
      error: null,
      translatingLineIds: new Set(),
    }),
  clearTranscript: () =>
    set({
      lines: [],
      notice: null,
      error: null,
      translatingLineIds: new Set(),
    }),
  startLoading: () => set({ isLoading: true, error: null }),
  setError: (error) => set({ error, isLoading: false }),
  setLineTranslation: (lineId, translatedText) =>
    set((state) => ({
      lines: state.lines.map((line) =>
        line.id === lineId
          ? { ...line, translatedText, isTranslated: true }
          : line,
      ),
    })),
  setTranslating: (lineId, isTranslating) =>
    set((state) => {
      const translatingLineIds = new Set(state.translatingLineIds)
      if (isTranslating) translatingLineIds.add(lineId)
      else translatingLineIds.delete(lineId)
      return { translatingLineIds }
    }),
  clearTranslations: () =>
    set((state) => ({
      lines: state.lines.map((line) => {
        const nextLine = { ...line }
        delete nextLine.translatedText
        nextLine.isTranslated = false
        return nextLine
      }),
    })),
}))
