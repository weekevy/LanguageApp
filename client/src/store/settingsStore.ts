import type { LanguageCode } from '@linguatube/shared'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TranscriptFont = 'sans' | 'serif' | 'mono'
export type AppTheme = 'dark' | 'light' | 'midnight' | 'aurora' | 'rose'
export type TranscriptTheme =
  'dark' | 'light' | 'sepia' | 'contrast' | 'ocean' | 'lavender' | 'forest'
export type TextAlignment = 'left' | 'center' | 'right'

export interface TranscriptSettings {
  appTheme: AppTheme
  fontFamily: TranscriptFont
  fontSize: number
  fontWeight: number
  lineHeight: number
  textAlignment: TextAlignment
  transcriptTheme: TranscriptTheme
  backgroundOpacity: number
  showBorder: boolean
  activeHighlight: 'violet' | 'cyan' | 'emerald'
  showOriginal: boolean
  showTranslations: boolean
  showTimestamps: boolean
  showSpeakers: boolean
  targetLanguage: LanguageCode
  autoScroll: boolean
  autoHideTranslations: boolean
  highlightActiveWords: boolean
  keepActiveCentered: boolean
}

export const defaultTranscriptSettings: TranscriptSettings = {
  appTheme: 'dark',
  fontFamily: 'sans',
  fontSize: 17,
  fontWeight: 450,
  lineHeight: 1.7,
  textAlignment: 'left',
  transcriptTheme: 'dark',
  backgroundOpacity: 92,
  showBorder: true,
  activeHighlight: 'violet',
  showOriginal: true,
  showTranslations: true,
  showTimestamps: true,
  showSpeakers: true,
  targetLanguage: 'fr',
  autoScroll: true,
  autoHideTranslations: false,
  highlightActiveWords: true,
  keepActiveCentered: true,
}

interface SettingsState {
  settings: TranscriptSettings
  updateSetting: <Key extends keyof TranscriptSettings>(
    key: Key,
    value: TranscriptSettings[Key],
  ) => void
  resetSettings: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultTranscriptSettings,
      updateSetting: (key, value) =>
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        })),
      resetSettings: () => set({ settings: defaultTranscriptSettings }),
    }),
    {
      name: 'linguatube-transcript-settings',
      version: 2,
      migrate: (persistedState, version) => {
        const persisted = persistedState as Partial<SettingsState> & {
          settings?: Partial<TranscriptSettings>
        }
        if (version < 2 && persisted.settings) {
          return {
            ...persisted,
            settings: {
              ...defaultTranscriptSettings,
              ...persisted.settings,
              highlightActiveWords: true,
            },
          } as SettingsState
        }
        return persisted as SettingsState
      },
    },
  ),
)
