import type { LanguageCode } from '@linguatube/shared'
import { languageNames, supportedLanguages } from '@linguatube/shared'
import {
  Captions,
  CheckCircle2,
  Database,
  Heart,
  Leaf,
  Languages,
  LogOut,
  Moon,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Sun,
  UserRound,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Avatar, Badge, Button, Card, Select, Toggle } from '../components/ui'
import { cn } from '../lib/cn'
import { useAuthStore } from '../store/authStore'
import { useSettingsStore, type AppTheme } from '../store/settingsStore'
import { useUiStore } from '../store/uiStore'

const appThemes: Array<{
  id: AppTheme
  label: string
  icon: typeof Moon
  preview: string
  panel: string
}> = [
  {
    id: 'dark',
    label: 'Obsidian',
    icon: Moon,
    preview: 'bg-[#0b0b12]',
    panel: 'bg-[#1c1c2a]',
  },
  {
    id: 'light',
    label: 'Cloud',
    icon: Sun,
    preview: 'bg-[#fafafc]',
    panel: 'bg-white',
  },
  {
    id: 'midnight',
    label: 'Midnight',
    icon: Sparkles,
    preview: 'bg-[#070a18]',
    panel: 'bg-[#17203b]',
  },
  {
    id: 'aurora',
    label: 'Aurora',
    icon: Leaf,
    preview: 'bg-[#071512]',
    panel: 'bg-[#14332c]',
  },
  {
    id: 'rose',
    label: 'Rose noir',
    icon: Heart,
    preview: 'bg-[#180a12]',
    panel: 'bg-[#3a172c]',
  },
]

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const settings = useSettingsStore((state) => state.settings)
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const resetSettings = useSettingsStore((state) => state.resetSettings)
  const openAuth = useUiStore((state) => state.openAuth)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-8 shadow-[var(--app-shadow-soft)] sm:px-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/14 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
              Your workspace
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
              Make LinguaTube yours.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              Choose how the app looks, how transcripts behave, and which
              language translations use by default.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-border bg-elevated/75 px-4 py-3">
            {user ? (
              <Avatar name={user.name} />
            ) : (
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/12 text-secondary">
                <UserRound className="h-4 w-4" />
              </span>
            )}
            <div className="min-w-0">
              <p className="max-w-38 truncate text-sm font-semibold text-foreground">
                {user?.name ?? 'Guest learner'}
              </p>
              <p className="text-[10px] text-muted">
                {user ? `${user.plan} plan` : 'Local session'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="space-y-5">
          <Card className="overflow-hidden">
            <div className="flex items-center gap-3 border-b border-border px-5 py-4 sm:px-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/12 text-secondary">
                <Sun className="h-4.5 w-4.5" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Appearance
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  Choose your app interface theme.
                </p>
              </div>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
              {appThemes.map(({ id, label, icon: Icon, preview, panel }) => {
                const selected = settings.appTheme === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => updateSetting('appTheme', id)}
                    className={cn(
                      'group relative overflow-hidden rounded-2xl border p-4 text-left transition',
                      selected
                        ? 'border-primary/50 bg-primary/8 shadow-[0_10px_30px_rgba(109,94,252,0.1)]'
                        : 'border-border bg-elevated/55 hover:border-border-strong',
                    )}
                  >
                    <div
                      className={cn(
                        'mb-4 h-20 overflow-hidden rounded-xl border border-white/10 p-2',
                        preview,
                      )}
                    >
                      <div
                        className={cn(
                          'h-full rounded-lg border border-white/10 p-2 shadow-inner',
                          panel,
                        )}
                      >
                        <div className="flex gap-1.5">
                          <span className="h-2 w-8 rounded-full bg-primary/75" />
                          <span
                            className={cn(
                              'h-2 w-14 rounded-full',
                              id === 'light' ? 'bg-black/8' : 'bg-white/10',
                            )}
                          />
                        </div>
                        <div
                          className={cn(
                            'mt-3 h-8 rounded-md',
                            id === 'light' ? 'bg-black/4' : 'bg-white/5',
                          )}
                        />
                      </div>
                    </div>
                    <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Icon className="h-4 w-4 text-secondary" /> {label}
                      {selected && (
                        <CheckCircle2 className="ml-auto h-4 w-4 text-secondary" />
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center gap-3 border-b border-border px-5 py-4 sm:px-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
                <SlidersHorizontal className="h-4.5 w-4.5" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Learning behavior
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  Set sensible defaults for every session.
                </p>
              </div>
            </div>
            <div className="divide-y divide-border px-5 py-2 sm:px-6">
              <Toggle
                checked={settings.autoScroll}
                onCheckedChange={(value) => updateSetting('autoScroll', value)}
                label="Follow the active sentence"
                description="Keep the current transcript line visible as the video plays."
              />
              <Toggle
                checked={settings.keepActiveCentered}
                onCheckedChange={(value) =>
                  updateSetting('keepActiveCentered', value)
                }
                label="Center the active sentence"
                description="Position the current sentence near the middle of the transcript."
              />
              <Toggle
                checked={settings.showTranslations}
                onCheckedChange={(value) =>
                  updateSetting('showTranslations', value)
                }
                label="Show translations by default"
                description="Display available translations when a lesson opens."
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
        </div>

        <div className="space-y-5">
          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-success/10 text-success">
                <Languages className="h-4.5 w-4.5" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Translation language
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  Used for new transcript translations.
                </p>
              </div>
            </div>
            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-semibold text-muted">
                Translate into
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
              Existing lesson translations refresh when you choose a different
              language.
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/12 text-secondary">
                  <UserRound className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    Account
                  </h2>
                  <p className="mt-0.5 text-xs text-muted">
                    Your local demo profile.
                  </p>
                </div>
              </div>
              {user && (
                <Badge variant={user.plan === 'pro' ? 'primary' : 'outline'}>
                  {user.plan}
                </Badge>
              )}
            </div>
            {user ? (
              <div className="mt-5 rounded-xl border border-border bg-elevated/65 p-4">
                <p className="text-sm font-semibold text-foreground">
                  {user.name}
                </p>
                <p className="mt-1 text-xs text-muted">{user.email}</p>
              </div>
            ) : (
              <p className="mt-5 rounded-xl border border-border bg-elevated/65 p-4 text-xs leading-5 text-muted">
                Sign in with the demo account to keep an account identity across
                sessions.
              </p>
            )}
            <Button
              type="button"
              variant={user ? 'danger' : 'secondary'}
              className="mt-4 w-full"
              onClick={user ? logout : openAuth}
            >
              {user ? (
                <LogOut className="h-4 w-4" />
              ) : (
                <UserRound className="h-4 w-4" />
              )}
              {user ? 'Sign out' : 'Sign in'}
            </Button>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-warning/10 text-warning">
                <Database className="h-4.5 w-4.5" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Reset preferences
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  Return transcript settings to their defaults.
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-muted">
              Your theme, typography, language, visibility, and scrolling
              settings will be reset. Your profile stays intact.
            </p>
            <Button
              type="button"
              variant="secondary"
              className="mt-4 w-full"
              onClick={() => {
                resetSettings()
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
