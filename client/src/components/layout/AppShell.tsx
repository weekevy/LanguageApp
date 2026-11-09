import { motion } from 'framer-motion'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Outlet, useLocation } from 'react-router-dom'
import { configureApiIdentity } from '../../lib/api'
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

export const AppShell = () => {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const appTheme = useSettingsStore((state) => state.settings.appTheme)
  const refreshLimits = useSubscriptionStore((state) => state.refreshLimits)
  const sidebarCollapsed = useUiStore((state) => state.isSidebarCollapsed)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('theme-midnight', 'theme-aurora', 'theme-rose')
    root.classList.toggle('dark', appTheme !== 'light')
    if (!['dark', 'light'].includes(appTheme))
      root.classList.add(`theme-${appTheme}`)
    root.style.colorScheme = appTheme === 'light' ? 'light' : 'dark'
  }, [appTheme])

  useEffect(() => {
    configureApiIdentity(user)
    void refreshLimits().catch(() => {
      toast.error('The API is offline. Start both apps with npm run dev.')
    })
  }, [refreshLimits, user])

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-70 [background-image:radial-gradient(circle_at_78%_4%,rgba(109,94,252,0.10),transparent_26%),radial-gradient(circle_at_18%_94%,rgba(34,211,238,0.07),transparent_24%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:48px_48px]"
      />
      <Sidebar />
      <div
        className={cn(
          'relative z-10 min-h-screen transition-[padding] duration-300 ease-out',
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-62',
        )}
      >
        <Topbar />
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="min-h-[calc(100vh-4.25rem)] pb-28 lg:pb-0"
        >
          <Outlet />
        </motion.main>
      </div>
      <MobileNavigation />
      <MobileMenu />
      <AuthModal />
      <UpgradeModal />
    </div>
  )
}
