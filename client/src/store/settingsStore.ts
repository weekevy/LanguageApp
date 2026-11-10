import type { LanguageCode } from '@linguatube/shared'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TranscriptFont = 'sans' | 'serif' | 'mono'
export type AppLanguage = 'system' | LanguageCode
export type AppTheme =
  | 'dark'
  | 'light'
  | 'midnight'
  | 'aurora'
  | 'rose'
  | 'ocean'
  | 'sunset'
  | 'royal'
  | 'mocha'
export type TextAlignment = 'left' | 'center' | 'right'

export interface TranscriptSettings {
  appTheme: AppTheme
  appLanguage: AppLanguage
  fontFamily: TranscriptFont
  fontSize: number
  fontWeight: number
  lineHeight: number
  textAlignment: TextAlignment
  backgroundOpacity: number
  captionOpacity: number
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
  appLanguage: 'system',
  fontFamily: 'sans',
  fontSize: 19,
  fontWeight: 450,
  lineHeight: 1.7,
  textAlignment: 'left',
  backgroundOpacity: 92,
  captionOpacity: 100,
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
      version: 5,
      migrate: (persistedState, version) => {
        const persisted = persistedState as Partial<SettingsState> & {
          settings?: Partial<TranscriptSettings>
        }
        if (version < 5 && persisted.settings) {
          return {
            ...persisted,
            settings: {
              ...defaultTranscriptSettings,
              ...persisted.settings,
              ...(version < 2 ? { highlightActiveWords: true } : {}),
              ...(version < 4 ? { captionOpacity: 100 } : {}),
              ...(version < 5 ? { appLanguage: 'system' as const } : {}),
              ...(persisted.settings.fontSize === undefined ||
              persisted.settings.fontSize === 17
                ? { fontSize: 19 }
                : {}),
            },
          } as SettingsState
        }
        return persisted as SettingsState
      },
    },
  ),
)
