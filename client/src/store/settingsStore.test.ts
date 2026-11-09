import { describe, expect, it } from 'vitest'
import {
  defaultTranscriptSettings,
  useSettingsStore,
} from './settingsStore'

describe('settings persistence', () => {
  it('persists transcript preferences in localStorage', () => {
    useSettingsStore.getState().updateSetting('fontSize', 22)
    useSettingsStore.getState().updateSetting('targetLanguage', 'es')

    const persisted = localStorage.getItem('linguatube-transcript-settings')
    expect(persisted).toContain('"fontSize":22')
    expect(persisted).toContain('"targetLanguage":"es"')

    useSettingsStore.getState().resetSettings()
    expect(useSettingsStore.getState().settings).toEqual(defaultTranscriptSettings)
  })
})
