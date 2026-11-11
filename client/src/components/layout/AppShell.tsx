import { Menu } from 'lucide-react'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Outlet, useLocation } from 'react-router-dom'
import { configureApiIdentity } from '../../lib/api'
import { syncNativeSystemBars } from '../../lib/systemBars'
import { useAuthStore } from '../../store/authStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useSubscriptionStore } from '../../store/subscriptionStore'
import { useUiStore } from '../../store/uiStore'
import { cn } from '../../lib/cn'
import { AuthModal } from '../../features/auth/AuthModal'
import { UpgradeModal } from '../../features/subscription/UpgradeModal'
import { MobileMenu } from './MobileMenu'
import { MobileNavigation } from './MobileNavigation'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface PageNavigationState {
  pageDirection?: 'forward' | 'backward'
}

const secondaryRoutes = new Set([
  '/speaking',
  '/writing',
  '/shadowing',
  '/pronunciation',
  '/pricing',
  '/settings',
  '/help',
])

export const AppShell = () => {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const appTheme = useSettingsStore((state) => state.settings.appTheme)
  const appLanguage = useSettingsStore((state) => state.settings.appLanguage)
  const refreshLimits = useSubscriptionStore((state) => state.refreshLimits)
  const sidebarCollapsed = useUiStore((state) => state.isSidebarCollapsed)
  const openMobileMenu = useUiStore((state) => state.openMobileMenu)
  const pageDirection =
    (location.state as PageNavigationState | null)?.pageDirection ?? 'forward'
  const hideTopbar = secondaryRoutes.has(location.pathname)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove(
      'theme-midnight',
      'theme-aurora',
      'theme-rose',
      'theme-ocean',
      'theme-sunset',
      'theme-royal',
      'theme-mocha',
    )
    root.classList.toggle('dark', appTheme !== 'light')
    if (!['dark', 'light'].includes(appTheme))
      root.classList.add(`theme-${appTheme}`)
    root.style.colorScheme = appTheme === 'light' ? 'light' : 'dark'
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        'content',
        getComputedStyle(root).getPropertyValue('--app-background').trim(),
      )
    void syncNativeSystemBars(appTheme)
  }, [appTheme])

  useEffect(() => {
    const systemLanguage = navigator.language.split('-')[0]?.toLowerCase()
    const resolvedLanguage =
      appLanguage === 'system' ? (systemLanguage ?? 'en') : appLanguage
    const supportedLanguage = [
      'en',
      'fr',
      'ar',
      'es',
      'de',
      'it',
      'pt',
      'ja',
      'zh',
    ].includes(resolvedLanguage)
      ? resolvedLanguage
      : 'en'

    document.documentElement.lang = supportedLanguage
    document.documentElement.dir = supportedLanguage === 'ar' ? 'rtl' : 'ltr'
  }, [appLanguage])

  useEffect(() => {
    configureApiIdentity(user)
    void refreshLimits().catch(() => {
      toast.error('The API is offline. Start both apps with npm run dev.')
    })
  }, [refreshLimits, user])

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <Sidebar />
      <div
        className={cn(
          'relative z-10 min-h-screen',
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-62',
        )}
      >
        {!hideTopbar && <Topbar />}
        {hideTopbar && (
          <button
            type="button"
            aria-label="Open navigation"
            onClick={openMobileMenu}
            className="fixed right-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-30 grid h-9 w-9 place-items-center rounded-full border border-border/70 bg-surface/90 text-foreground shadow-[0_4px_16px_rgba(0,0,0,0.18)] backdrop-blur lg:hidden"
          >
            <Menu className="h-5 w-5" strokeWidth={1.8} />
          </button>
        )}
        <main
          className={cn(
            'pb-24 lg:pb-0',
            hideTopbar
              ? 'mobile-safe-top min-h-screen'
              : 'min-h-[calc(100vh-4.25rem)]',
          )}
        >
          <div
            key={location.pathname}
            className={cn(
              'app-page-transition',
              pageDirection === 'backward'
                ? 'app-page-transition--backward'
                : 'app-page-transition--forward',
            )}
          >
            <Outlet />
          </div>
        </main>
      </div>
      <MobileNavigation />
      <MobileMenu />
      <AuthModal />
      <UpgradeModal />
    </div>
  )
}
