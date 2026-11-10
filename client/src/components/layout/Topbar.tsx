import {
  ChevronDown,
  Crown,
  LogOut,
  Menu,
  Moon,
  Sun,
  UserRound,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { formatResetTime } from '../../lib/format'
import { useAuthStore } from '../../store/authStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useSubscriptionStore } from '../../store/subscriptionStore'
import { useUiStore } from '../../store/uiStore'
import { Avatar, Badge, Button, Dropdown, Tooltip } from '../ui'
import { VideoUrlForm } from '../../features/video/VideoUrlForm'

export const Topbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const settings = useSettingsStore((state) => state.settings)
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const limits = useSubscriptionStore((state) => state.limits)
  const openAuth = useUiStore((state) => state.openAuth)
  const openMobileMenu = useUiStore((state) => state.openMobileMenu)
  const openUpgrade = useSubscriptionStore((state) => state.openUpgrade)
  const pageLabel =
    {
      '/': 'Learning studio',
      '/speaking': 'Speaking',
      '/writing': 'Writing',
      '/shadowing': 'Shadowing',
      '/pronunciation': 'Pronunciation',
      '/pricing': 'Plans & pricing',
      '/settings': 'Settings',
      '/help': 'Help center',
    }[location.pathname] ?? 'LinguaTube'

  return (
    <header className="app-topbar sticky top-0 z-30 flex h-15 items-center justify-between gap-3 bg-background px-3 sm:px-6 lg:h-17 lg:border-b lg:border-border/60 lg:px-5 xl:px-6">
      <div className="flex items-center gap-3 lg:hidden">
        <button
          type="button"
          className="hamburger-trigger grid h-9 w-9 place-items-center rounded-full bg-surface text-foreground"
          aria-label="Open navigation"
          onClick={openMobileMenu}
        >
          <Menu className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </div>

      <div className="hidden min-w-0 flex-1 items-center gap-4 lg:flex">
        <div className="w-24 shrink-0 xl:w-27">
          <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-muted/60">
            LinguaTube
          </p>
          <p className="mt-0.5 truncate text-xs font-semibold text-foreground">
            {pageLabel}
          </p>
        </div>
        <div className="min-w-0 flex-1 xl:max-w-2xl">
          <VideoUrlForm navbar wide />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {limits && limits.plan === 'free' && (
          <Tooltip
            label={`Daily allowance resets at ${formatResetTime(limits.resetsAt)}`}
          >
            <span className="hidden rounded-full border border-border bg-elevated/80 px-3 py-1.5 text-[11px] font-medium text-muted shadow-sm 2xl:inline-flex">
              <strong className="mr-1 text-foreground">
                {limits.remaining}
              </strong>{' '}
              videos left today
            </span>
          </Tooltip>
        )}
        {limits?.plan === 'pro' && (
          <Badge variant="primary" className="hidden 2xl:inline-flex">
            Unlimited Pro
          </Badge>
        )}

        <Tooltip
          label={`Switch to ${settings.appTheme === 'dark' ? 'light' : 'dark'} theme`}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Toggle color theme"
            onClick={() =>
              updateSetting(
                'appTheme',
                settings.appTheme === 'dark' ? 'light' : 'dark',
              )
            }
          >
            {settings.appTheme === 'dark' ? (
              <Sun className="h-4.5 w-4.5" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
          </Button>
        </Tooltip>

        {user?.plan !== 'pro' && (
          <button
            type="button"
            aria-label="Try LinguaTube Pro for free"
            title="Try LinguaTube Pro for free"
            className="premium-gold inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning/80"
            onClick={openUpgrade}
          >
            <Crown className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Try for free</span>
          </button>
        )}

        {user ? (
          <Dropdown
            trigger={
              <span className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-surface-hover">
                <Avatar name={user.name} />
                <ChevronDown className="hidden h-3.5 w-3.5 text-muted sm:block" />
              </span>
            }
          >
            {(close) => (
              <>
                <div className="border-b border-border px-3 py-2.5">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-muted">{user.email}</p>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-muted hover:bg-surface-hover hover:text-foreground"
                  onClick={() => {
                    close()
                    navigate('/settings')
                  }}
                >
                  <UserRound className="h-4 w-4" /> Profile settings
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-danger/10"
                  onClick={() => {
                    close()
                    logout()
                  }}
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </>
            )}
          </Dropdown>
        ) : (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => openAuth()}
          >
            <UserRound className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </Button>
        )}
      </div>
    </header>
  )
}
