import { describe, expect, it } from 'vitest'
import { defaultTranscriptSettings, useSettingsStore } from './settingsStore'

describe('settings persistence', () => {
  it('persists transcript preferences in localStorage', () => {
    useSettingsStore.getState().updateSetting('fontSize', 22)
    useSettingsStore.getState().updateSetting('targetLanguage', 'es')
    useSettingsStore.getState().updateSetting('captionOpacity', 65)
    useSettingsStore.getState().updateSetting('appLanguage', 'fr')

    const persisted = localStorage.getItem('linguatube-transcript-settings')
    expect(persisted).toContain('"fontSize":22')
    expect(persisted).toContain('"targetLanguage":"es"')
    expect(persisted).toContain('"captionOpacity":65')
    expect(persisted).toContain('"appLanguage":"fr"')

    useSettingsStore.getState().resetSettings()
    expect(useSettingsStore.getState().settings).toEqual(
      defaultTranscriptSettings,
    )
  })
})
