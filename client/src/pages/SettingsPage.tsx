import type { LanguageCode } from '@linguatube/shared'
import { languageNames, supportedLanguages } from '@linguatube/shared'
import {
  Captions,
  Check,
  ChevronDown,
  Coffee,
  Crown,
  Database,
  Flame,
  Gem,
  Globe2,
  Heart,
  Leaf,
  Languages,
  LogIn,
  LogOut,
  Moon,
  Palette,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Sun,
  UserPlus,
  UserRound,
  Waves,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import toast from 'react-hot-toast'
import {
  LanguageFlag,
  type LanguageFlagCode,
} from '../components/common/LanguageFlag'
import { Avatar, Badge, Button, Card, Select, Toggle } from '../components/ui'
import { cn } from '../lib/cn'
import { useAuthStore } from '../store/authStore'
import {
  useSettingsStore,
  type AppLanguage,
  type AppTheme,
} from '../store/settingsStore'
import { useSubscriptionStore } from '../store/subscriptionStore'
import { useUiStore } from '../store/uiStore'

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
  flagCode: LanguageFlagCode
  detail: string
}> = [
  {
    id: 'system',
    label: 'System language',
    nativeLabel: 'Automatic',
    flagCode: 'system',
    detail: 'Follow this device',
  },
  {
    id: 'en',
    label: 'English',
    nativeLabel: 'English',
    flagCode: 'gb',
    detail: 'United Kingdom',
  },
  {
    id: 'fr',
    label: 'French',
    nativeLabel: 'Français',
    flagCode: 'fr',
    detail: 'France',
  },
  {
    id: 'ar',
    label: 'Arabic',
    nativeLabel: 'العربية',
    flagCode: 'sa',
    detail: 'العربية',
  },
  {
    id: 'es',
    label: 'Spanish',
    nativeLabel: 'Español',
    flagCode: 'es',
    detail: 'España',
  },
  {
    id: 'de',
    label: 'German',
    nativeLabel: 'Deutsch',
    flagCode: 'de',
    detail: 'Deutschland',
  },
  {
    id: 'it',
    label: 'Italian',
    nativeLabel: 'Italiano',
    flagCode: 'it',
    detail: 'Italia',
  },
  {
    id: 'pt',
    label: 'Portuguese',
    nativeLabel: 'Português',
    flagCode: 'pt',
    detail: 'Portugal',
  },
  {
    id: 'ja',
    label: 'Japanese',
    nativeLabel: '日本語',
    flagCode: 'jp',
    detail: '日本',
  },
  {
    id: 'zh',
    label: 'Chinese',
    nativeLabel: '中文',
    flagCode: 'cn',
    detail: '中国',
  },
]

interface SettingsSectionProps {
  id: string
  title: string
  icon: ReactNode
  iconClassName: string
  defaultOpen?: boolean
  children: ReactNode
}

const SettingsSection = ({
  id,
  title,
  icon,
  iconClassName,
  defaultOpen = false,
  children,
}: SettingsSectionProps) => {
  const [open, setOpen] = useState(defaultOpen)
  const [hasOpened, setHasOpened] = useState(defaultOpen)

  const toggle = () => {
    if (!open) setHasOpened(true)
    setOpen(!open)
  }

  return (
    <Card
      className={cn(
        'overflow-hidden rounded-2xl transition-colors duration-200 sm:rounded-3xl',
        open ? 'border-primary/45' : 'hover:border-primary/30',
      )}
    >
      <button
        id={`${id}-settings-trigger`}
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-settings-panel`}
        onClick={toggle}
        className="flex h-15 w-full items-center gap-3 px-3.5 text-left active:bg-elevated/45 sm:h-17 sm:px-5"
      >
        <span
          className={cn(
            'grid h-10 w-10 shrink-0 place-items-center rounded-xl',
            iconClassName,
          )}
        >
          {icon}
        </span>
        <span className="min-w-0 flex-1 text-sm font-semibold text-foreground sm:text-base">
          {title}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-muted transition-transform duration-300',
            open && 'rotate-180 text-secondary',
          )}
        />
      </button>

      <div
        id={`${id}-settings-panel`}
        role="region"
        aria-labelledby={`${id}-settings-trigger`}
        aria-hidden={!open}
        inert={!open}
        className={cn('settings-accordion-panel', open && 'is-open')}
      >
        <div className="settings-accordion-content">
          {hasOpened ? children : null}
        </div>
      </div>
    </Card>
  )
}

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const settings = useSettingsStore((state) => state.settings)
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const resetSettings = useSettingsStore((state) => state.resetSettings)
  const openAuth = useUiStore((state) => state.openAuth)
  const openUpgrade = useSubscriptionStore((state) => state.openUpgrade)

  return (
    <div className="mx-auto w-full max-w-7xl px-3 pb-12 pt-4 sm:px-6 sm:pb-14 sm:pt-6 lg:px-8">
      <header className="mb-4 px-1 sm:mb-6">
        <h1 className="text-2xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
          Settings
        </h1>
      </header>

      {!user && (
        <section className="mx-auto w-[95%] rounded-2xl border border-border bg-surface p-2.5 shadow-[var(--app-shadow-soft)] sm:w-full sm:rounded-3xl sm:p-4">
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto sm:min-w-32"
              onClick={() => openAuth('login')}
            >
              <LogIn className="h-4 w-4" /> Login
            </Button>
            <Button
              type="button"
              size="sm"
              className="w-full sm:w-auto sm:min-w-40"
              onClick={() => openAuth('register')}
            >
              <UserPlus className="h-4 w-4" /> Create account
            </Button>
          </div>
        </section>
      )}

      <section
        className="mx-auto mt-3 w-[95%] space-y-2.5 sm:mt-5 sm:w-full sm:space-y-3"
        aria-label="Application settings"
      >
        {user && (
          <SettingsSection
            id="account"
            title="Account"
            icon={<UserRound className="h-4.5 w-4.5" />}
            iconClassName="bg-gradient-to-br from-primary/22 to-secondary/12 text-secondary ring-1 ring-primary/20"
          >
            <div className="grid gap-2 border-t border-border p-3 sm:grid-cols-2 sm:gap-3 sm:p-5">
              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-border/70 bg-elevated/40 p-3.5">
                <Avatar name={user.name} className="h-11 w-11 shrink-0" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-elevated/40 p-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-warning/12 text-warning">
                  <Crown className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                    Membership
                  </p>
                  <p className="mt-0.5 text-sm font-semibold capitalize text-foreground">
                    {user.plan}
                  </p>
                </div>
                {user.plan === 'pro' ? (
                  <Badge variant="primary">Active</Badge>
                ) : (
                  <Button type="button" size="sm" onClick={openUpgrade}>
                    Upgrade
                  </Button>
                )}
              </div>
            </div>
          </SettingsSection>
        )}

        <SettingsSection
          id="theme"
          title="Theme"
          icon={
            <>
              <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-accent/20 blur-sm" />
              <Palette className="relative h-4.5 w-4.5" />
            </>
          }
          iconClassName="relative overflow-hidden bg-gradient-to-br from-primary/25 to-accent/12 text-secondary ring-1 ring-primary/25"
        >
          <div className="grid grid-cols-2 gap-2 border-t border-border p-3 sm:grid-cols-3 sm:gap-3 sm:p-5 lg:grid-cols-5">
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
                      'group relative block overflow-hidden rounded-2xl border p-2.5 text-left transition-[border-color,background-color,transform] duration-200 active:scale-[0.98] sm:p-3',
                      selected
                        ? 'border-primary/55 bg-primary/10'
                        : 'border-border bg-elevated/45 hover:border-border-strong',
                    )}
                  >
                    <div
                      className={cn(
                        'h-11 w-full rounded-xl p-1.5 sm:h-20',
                        preview,
                      )}
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
                    <div className="mt-2 flex min-w-0 items-start gap-2 sm:mt-2.5">
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
        </SettingsSection>

        <SettingsSection
          id="translation"
          title="Translation language"
          icon={<Languages className="h-4.5 w-4.5" />}
          iconClassName="bg-gradient-to-br from-success/20 to-accent/10 text-success ring-1 ring-success/20"
        >
          <div className="border-t border-border p-3 sm:p-5">
            <label className="block">
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
                className="h-11 rounded-xl"
              />
            </label>
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-border bg-elevated/60 p-3 text-[11px] leading-5 text-muted">
              <Captions className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
              Caption translations refresh independently from the app language.
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          id="language"
          title="Application language"
          icon={<Globe2 className="h-4.5 w-4.5" />}
          iconClassName="bg-gradient-to-br from-secondary/20 to-primary/10 text-secondary ring-1 ring-primary/20"
        >
          <div className="grid grid-cols-2 gap-2 border-t border-border p-3 sm:gap-3 sm:p-5 lg:grid-cols-5">
            {appLanguages.map(
              ({ id, label, nativeLabel, flagCode, detail }) => {
                const selected = settings.appLanguage === id
                return (
                  <button
                    key={id}
                    type="button"
                    dir="auto"
                    aria-pressed={selected}
                    onClick={() => updateSetting('appLanguage', id)}
                    className={cn(
                      'relative flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-3 text-center transition-[border-color,background-color,transform] duration-200 active:scale-[0.97] sm:min-h-31 sm:px-4 sm:py-4',
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
                    <LanguageFlag
                      code={flagCode}
                      label={label}
                      className="h-9 w-13.5 sm:h-12 sm:w-18"
                    />
                    <span className="min-w-0 max-w-full px-3 sm:px-0">
                      <span className="block truncate text-xs font-bold text-foreground">
                        {nativeLabel}
                      </span>
                      <span className="mt-1 hidden truncate text-[9px] text-muted sm:block">
                        {id === 'system' ? detail : `${label} · ${detail}`}
                      </span>
                    </span>
                  </button>
                )
              },
            )}
          </div>
        </SettingsSection>

        <SettingsSection
          id="behavior"
          title="Learning behavior"
          icon={<SlidersHorizontal className="h-4.5 w-4.5" />}
          iconClassName="bg-gradient-to-br from-accent/20 to-primary/10 text-accent ring-1 ring-accent/20"
        >
          <div className="space-y-2 border-t border-border p-3 sm:px-5 sm:py-4">
            <div className="rounded-xl border border-border/70 bg-elevated/35 px-3 py-1.5">
              <Toggle
                checked={settings.keepActiveCentered}
                onCheckedChange={(value) =>
                  updateSetting('keepActiveCentered', value)
                }
                label="Center the active sentence"
                description="Position the current sentence near the middle."
              />
            </div>
            <div className="rounded-xl border border-border/70 bg-elevated/35 px-3 py-1.5">
              <Toggle
                checked={settings.showTranslations}
                onCheckedChange={(value) =>
                  updateSetting('showTranslations', value)
                }
                label="Show translations by default"
                description="Display available translations when lessons open."
              />
            </div>
            <div className="rounded-xl border border-border/70 bg-elevated/35 px-3 py-1.5">
              <Toggle
                checked={settings.showTimestamps}
                onCheckedChange={(value) =>
                  updateSetting('showTimestamps', value)
                }
                label="Show sentence timestamps"
                description="Keep video times visible beside transcript lines."
              />
            </div>
          </div>
        </SettingsSection>
      </section>

      <div className="mx-auto mt-3 w-[95%] sm:mt-5 sm:w-full">
        <Card className="rounded-[1.75rem] p-4 sm:p-6">
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
              toast.success('Learning preferences reset')
            }}
          >
            <RotateCcw className="h-4 w-4" /> Reset to defaults
          </Button>
        </Card>
      </div>

      {user && (
        <section className="mx-auto mt-3 w-[95%] rounded-2xl border border-border bg-surface p-2.5 shadow-[var(--app-shadow-soft)] sm:mt-5 sm:w-full sm:rounded-3xl sm:p-4">
          <Button
            type="button"
            variant="danger"
            size="sm"
            className="w-full sm:ml-auto sm:flex sm:w-auto sm:min-w-36"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </section>
      )}
    </div>
  )
}
