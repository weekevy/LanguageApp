import type { LanguageCode } from '@linguatube/shared'
import { languageNames, supportedLanguages } from '@linguatube/shared'
import {
  Captions,
  Check,
  ChevronDown,
  Coffee,
  Database,
  Flame,
  Gem,
  Globe2,
  Heart,
  Leaf,
  Languages,
  LockKeyhole,
  LogIn,
  LogOut,
  Moon,
  Palette,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  UserPlus,
  Waves,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Avatar, Badge, Button, Card, Select, Toggle } from '../components/ui'
import { cn } from '../lib/cn'
import { useAuthStore } from '../store/authStore'
import {
  useSettingsStore,
  type AppLanguage,
  type AppTheme,
} from '../store/settingsStore'
import { useUiStore } from '../store/uiStore'

type SettingsPanel = 'theme' | 'language'

const appThemes: Array<{
  id: AppTheme
  label: string
  description: string
  icon: typeof Moon
  preview: string
  panel: string
}> = [
  {
    id: 'dark',
    label: 'Obsidian',
    description: 'Deep and focused',
    icon: Moon,
    preview: 'bg-[#0b0b12]',
    panel: 'bg-[#1c1c2a]',
  },
  {
    id: 'light',
    label: 'Cloud',
    description: 'Bright and minimal',
    icon: Sun,
    preview: 'bg-[#fafafc]',
    panel: 'bg-white',
  },
  {
    id: 'midnight',
    label: 'Midnight',
    description: 'Cool night blues',
    icon: Sparkles,
    preview: 'bg-[#070a18]',
    panel: 'bg-[#17203b]',
  },
  {
    id: 'aurora',
    label: 'Aurora',
    description: 'Calm emerald glow',
    icon: Leaf,
    preview: 'bg-[#071512]',
    panel: 'bg-[#14332c]',
  },
  {
    id: 'rose',
    label: 'Rose noir',
    description: 'Elegant dark rose',
    icon: Heart,
    preview: 'bg-[#180a12]',
    panel: 'bg-[#3a172c]',
  },
  {
    id: 'ocean',
    label: 'Deep ocean',
    description: 'Fresh aquatic tones',
    icon: Waves,
    preview: 'bg-[#04151c]',
    panel: 'bg-[#0e3542]',
  },
  {
    id: 'sunset',
    label: 'Sunset ember',
    description: 'Warm orange energy',
    icon: Flame,
    preview: 'bg-[#1c0d0a]',
    panel: 'bg-[#422119]',
  },
  {
    id: 'royal',
    label: 'Royal violet',
    description: 'Rich purple contrast',
    icon: Gem,
    preview: 'bg-[#100b24]',
    panel: 'bg-[#281b52]',
  },
  {
    id: 'mocha',
    label: 'Warm mocha',
    description: 'Soft earthy comfort',
    icon: Coffee,
    preview: 'bg-[#17100d]',
    panel: 'bg-[#35261e]',
  },
]

const appLanguages: Array<{
  id: AppLanguage
  label: string
  nativeLabel: string
  flag: string
  detail: string
}> = [
  {
    id: 'system',
    label: 'System language',
    nativeLabel: 'Automatic',
    flag: '🌐',
    detail: 'Follow this device',
  },
  {
    id: 'en',
    label: 'English',
    nativeLabel: 'English',
    flag: '🇬🇧',
    detail: 'United Kingdom',
  },
  {
    id: 'fr',
    label: 'French',
    nativeLabel: 'Français',
    flag: '🇫🇷',
    detail: 'France',
  },
  {
    id: 'ar',
    label: 'Arabic',
    nativeLabel: 'العربية',
    flag: '🇸🇦',
    detail: 'العربية',
  },
  {
    id: 'es',
    label: 'Spanish',
    nativeLabel: 'Español',
    flag: '🇪🇸',
    detail: 'España',
  },
  {
    id: 'de',
    label: 'German',
    nativeLabel: 'Deutsch',
    flag: '🇩🇪',
    detail: 'Deutschland',
  },
  {
    id: 'it',
    label: 'Italian',
    nativeLabel: 'Italiano',
    flag: '🇮🇹',
    detail: 'Italia',
  },
  {
    id: 'pt',
    label: 'Portuguese',
    nativeLabel: 'Português',
    flag: '🇵🇹',
    detail: 'Portugal',
  },
  {
    id: 'ja',
    label: 'Japanese',
    nativeLabel: '日本語',
    flag: '🇯🇵',
    detail: '日本',
  },
  {
    id: 'zh',
    label: 'Chinese',
    nativeLabel: '中文',
    flag: '🇨🇳',
    detail: '中国',
  },
]

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const settings = useSettingsStore((state) => state.settings)
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const resetSettings = useSettingsStore((state) => state.resetSettings)
  const openAuth = useUiStore((state) => state.openAuth)
  const [openPanel, setOpenPanel] = useState<SettingsPanel | null>(null)

  const selectedTheme = useMemo(
    () =>
      appThemes.find((theme) => theme.id === settings.appTheme) ??
      appThemes[0]!,
    [settings.appTheme],
  )
  const selectedLanguage = useMemo(
    () =>
      appLanguages.find((language) => language.id === settings.appLanguage) ??
      appLanguages[0]!,
    [settings.appLanguage],
  )

  const togglePanel = (panel: SettingsPanel) => {
    setOpenPanel((current) => (current === panel ? null : panel))
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-3 pb-10 pt-3 sm:px-6 sm:pb-14 sm:pt-6 lg:px-8">
      <header className="mb-5 px-1 sm:mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary sm:text-xs">
          Personal control center
        </p>
        <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
              Settings made personal.
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-muted sm:text-sm sm:leading-6">
              Shape the interface, language, and learning experience around you.
            </p>
          </div>
          <Badge variant="primary" className="w-fit">
            Preferences save automatically
          </Badge>
        </div>
      </header>

      <section className="relative overflow-hidden rounded-3xl border border-primary/25 bg-surface p-4 shadow-[var(--app-shadow-soft)] sm:p-6 lg:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_92%_0%,color-mix(in_srgb,var(--app-primary)_18%,transparent),transparent_36%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3.5 sm:items-center sm:gap-4">
            {user ? (
              <Avatar name={user.name} className="h-12 w-12 text-sm" />
            ) : (
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/25 to-accent/15 text-secondary ring-1 ring-primary/25">
                <LockKeyhole className="h-5 w-5" />
              </span>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-foreground sm:text-lg">
                  {user
                    ? 'Your account is connected'
                    : 'Unlock your full workspace'}
                </h2>
                {user && (
                  <Badge variant={user.plan === 'pro' ? 'primary' : 'outline'}>
                    {user.plan}
                  </Badge>
                )}
              </div>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-muted sm:text-sm">
                {user
                  ? 'Your identity and account preferences are available in this session.'
                  : 'Login or create a free account to access saved language profiles, vocabulary, and additional personalization.'}
              </p>
              {!user && (
                <div className="mt-3 hidden flex-wrap gap-2 sm:flex">
                  {[
                    'Saved vocabulary',
                    'Language profiles',
                    'Personal progress',
                  ].map((benefit) => (
                    <span
                      key={benefit}
                      className="inline-flex items-center gap-1.5 rounded-full bg-elevated/75 px-2.5 py-1 text-[10px] font-semibold text-muted"
                    >
                      <ShieldCheck className="h-3 w-3 text-success" />
                      {benefit}
                    </span>
                  ))}
                </div>
              )}
              {user && (
                <p className="mt-2 truncate text-[11px] text-muted">
                  {user.name} · {user.email}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:min-w-72">
            {user ? (
              <Button
                type="button"
                variant="danger"
                className="w-full sm:min-w-36"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full sm:min-w-32"
                  onClick={() => openAuth('login')}
                >
                  <LogIn className="h-4 w-4" /> Login
                </Button>
                <Button
                  type="button"
                  className="w-full sm:min-w-40"
                  onClick={() => openAuth('register')}
                >
                  <UserPlus className="h-4 w-4" /> Create account
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      <section
        className="mt-5 grid gap-3 lg:mt-6 lg:grid-cols-2 lg:gap-5"
        aria-label="Interface preferences"
      >
        <button
          type="button"
          aria-expanded={openPanel === 'theme'}
          aria-controls="theme-settings-panel"
          onClick={() => togglePanel('theme')}
          className={cn(
            'group relative overflow-hidden rounded-3xl border bg-surface p-4 text-left shadow-[var(--app-shadow-soft)] transition-[border-color,transform] duration-200 active:scale-[0.99] sm:p-5',
            openPanel === 'theme'
              ? 'border-primary/45'
              : 'border-border hover:border-primary/30',
          )}
        >
          <div className="relative flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/12 text-secondary sm:h-14 sm:w-14">
              <Palette className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                Appearance
              </p>
              <h2 className="mt-1 text-base font-bold text-foreground">
                Theme
              </h2>
              <p className="mt-1 truncate text-xs text-muted">
                {selectedTheme.label} · {selectedTheme.description}
              </p>
            </div>
            <div
              className={cn(
                'h-12 w-12 shrink-0 rounded-2xl p-1.5',
                selectedTheme.preview,
              )}
            >
              <div
                className={cn(
                  'h-full rounded-xl ring-1 ring-white/10',
                  selectedTheme.panel,
                )}
              />
            </div>
            <ChevronDown
              className={cn(
                'h-4 w-4 shrink-0 text-muted transition-transform duration-200',
                openPanel === 'theme' && 'rotate-180 text-secondary',
              )}
            />
          </div>
        </button>

        <button
          type="button"
          aria-expanded={openPanel === 'language'}
          aria-controls="language-settings-panel"
          onClick={() => togglePanel('language')}
          className={cn(
            'group relative overflow-hidden rounded-3xl border bg-surface p-4 text-left shadow-[var(--app-shadow-soft)] transition-[border-color,transform] duration-200 active:scale-[0.99] sm:p-5',
            openPanel === 'language'
              ? 'border-primary/45'
              : 'border-border hover:border-primary/30',
          )}
        >
          <div className="relative flex items-center gap-4">
            <span
              role="img"
              aria-label={selectedLanguage.label}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-elevated text-3xl ring-1 ring-border sm:h-14 sm:w-14"
            >
              {selectedLanguage.flag}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                Interface
              </p>
              <h2 className="mt-1 text-base font-bold text-foreground">
                Application language
              </h2>
              <p className="mt-1 truncate text-xs text-muted">
                {selectedLanguage.nativeLabel} · {selectedLanguage.detail}
              </p>
            </div>
            <Globe2 className="hidden h-5 w-5 text-secondary sm:block" />
            <ChevronDown
              className={cn(
                'h-4 w-4 shrink-0 text-muted transition-transform duration-200',
                openPanel === 'language' && 'rotate-180 text-secondary',
              )}
            />
          </div>
        </button>
      </section>

      {openPanel === 'theme' && (
        <Card
          id="theme-settings-panel"
          className="settings-panel-reveal mt-3 overflow-hidden border-primary/20 lg:mt-5"
        >
          <div className="border-b border-border px-4 py-4 sm:px-6">
            <h2 className="text-sm font-bold text-foreground">
              Choose your visual atmosphere
            </h2>
            <p className="mt-1 text-xs text-muted">
              The video border, transcript, navigation, and native Android bars
              follow your selection.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2.5 p-3 sm:grid-cols-3 sm:gap-3 sm:p-5 lg:grid-cols-5">
            {appThemes.map(
              ({ id, label, description, icon: Icon, preview, panel }) => {
                const selected = settings.appTheme === id
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => updateSetting('appTheme', id)}
                    className={cn(
                      'group relative overflow-hidden rounded-2xl border p-2.5 text-left transition-[border-color,background-color,transform] duration-200 active:scale-[0.98] sm:p-3',
                      selected
                        ? 'border-primary/55 bg-primary/10'
                        : 'border-border bg-elevated/45 hover:border-border-strong',
                    )}
                  >
                    <div
                      className={cn('h-16 rounded-xl p-1.5 sm:h-20', preview)}
                    >
                      <div
                        className={cn(
                          'relative h-full overflow-hidden rounded-lg ring-1 ring-white/10',
                          panel,
                        )}
                      >
                        <span className="absolute left-2 top-2 h-1.5 w-8 rounded-full bg-primary/80" />
                        <span className="absolute inset-x-2 bottom-2 h-6 rounded-md bg-white/6" />
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-start gap-2">
                      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-bold text-foreground">
                          {label}
                        </span>
                        <span className="mt-0.5 hidden truncate text-[9px] text-muted sm:block">
                          {description}
                        </span>
                      </span>
                      {selected && (
                        <span className="ml-auto grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-white">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </button>
                )
              },
            )}
          </div>
        </Card>
      )}

      {openPanel === 'language' && (
        <Card
          id="language-settings-panel"
          className="settings-panel-reveal mt-3 overflow-hidden border-primary/20 lg:mt-5"
        >
          <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Choose the application language
              </h2>
              <p className="mt-1 text-xs text-muted">
                This preference sets the interface locale and reading direction.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-elevated px-3 py-1.5 text-[10px] font-semibold text-muted">
              <Globe2 className="h-3.5 w-3.5 text-secondary" />
              {selectedLanguage.nativeLabel}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 p-3 sm:grid-cols-3 sm:gap-3 sm:p-5 lg:grid-cols-5">
            {appLanguages.map(({ id, label, nativeLabel, flag, detail }) => {
              const selected = settings.appLanguage === id
              return (
                <button
                  key={id}
                  type="button"
                  dir="auto"
                  aria-pressed={selected}
                  onClick={() => updateSetting('appLanguage', id)}
                  className={cn(
                    'relative flex min-h-31 flex-col items-center justify-center rounded-2xl border px-3 py-4 text-center transition-[border-color,background-color,transform] duration-200 active:scale-[0.97]',
                    selected
                      ? 'border-primary/55 bg-primary/10'
                      : 'border-border bg-elevated/45 hover:border-border-strong hover:bg-elevated',
                  )}
                >
                  {selected && (
                    <span className="absolute right-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <span
                    role="img"
                    aria-label={label}
                    className="text-4xl leading-none drop-shadow-sm"
                  >
                    {flag}
                  </span>
                  <span className="mt-3 text-xs font-bold text-foreground">
                    {nativeLabel}
                  </span>
                  <span className="mt-1 text-[9px] text-muted">
                    {id === 'system' ? detail : label}
                  </span>
                </button>
              )
            })}
          </div>
        </Card>
      )}

      <div className="mt-5 grid items-start gap-5 xl:mt-6 xl:grid-cols-[1.08fr_0.92fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border px-4 py-4 sm:px-6">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
              <SlidersHorizontal className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Learning behavior
              </h2>
              <p className="mt-0.5 text-xs text-muted">
                Set comfortable defaults for every lesson.
              </p>
            </div>
          </div>
          <div className="divide-y divide-border px-4 py-2 sm:px-6">
            <Toggle
              checked={settings.keepActiveCentered}
              onCheckedChange={(value) =>
                updateSetting('keepActiveCentered', value)
              }
              label="Center the active sentence"
              description="Position the current sentence near the middle."
            />
            <Toggle
              checked={settings.showTranslations}
              onCheckedChange={(value) =>
                updateSetting('showTranslations', value)
              }
              label="Show translations by default"
              description="Display available translations when lessons open."
            />
            <Toggle
              checked={settings.showTimestamps}
              onCheckedChange={(value) =>
                updateSetting('showTimestamps', value)
              }
              label="Show sentence timestamps"
              description="Keep video times visible beside transcript lines."
            />
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-success/10 text-success">
                <Languages className="h-4.5 w-4.5" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Translation language
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  Separate from the application interface language.
                </p>
              </div>
            </div>
            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-semibold text-muted">
                Translate captions into
              </span>
              <Select
                value={settings.targetLanguage}
                onChange={(event) =>
                  updateSetting(
                    'targetLanguage',
                    event.target.value as LanguageCode,
                  )
                }
                options={supportedLanguages.map((code) => ({
                  value: code,
                  label: languageNames[code],
                }))}
                className="h-12 rounded-xl"
              />
            </label>
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-border bg-elevated/60 p-3 text-[11px] leading-5 text-muted">
              <Captions className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
              Caption translations refresh independently from the app language.
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-warning/10 text-warning">
                <Database className="h-4.5 w-4.5" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Reset preferences
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  Return all interface and transcript settings to defaults.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="mt-5 w-full"
              onClick={() => {
                resetSettings()
                setOpenPanel(null)
                toast.success('Learning preferences reset')
              }}
            >
              <RotateCcw className="h-4 w-4" /> Reset to defaults
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
