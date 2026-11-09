import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { useUiStore } from '../../store/uiStore'
import { Button } from '../ui'
import { navigationItems } from './navigation'

export const MobileMenu = () => {
  const open = useUiStore((state) => state.isMobileMenuOpen)
  const close = useUiStore((state) => state.closeMobileMenu)

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-80 lg:hidden">
          <motion.button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="absolute inset-y-0 left-0 flex w-[min(88vw,340px)] flex-col border-r border-border bg-surface p-5 shadow-panel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/12 text-secondary">
                  <Menu className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Navigation
                  </p>
                  <p className="text-[10px] text-muted">
                    Choose your learning space
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close menu"
                onClick={close}
              >
                <X className="h-4.5 w-4.5" />
              </Button>
            </div>
            <nav className="app-scrollbar mt-8 flex-1 space-y-1 overflow-y-auto">
              {navigationItems.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  onClick={close}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted hover:bg-surface-hover hover:text-foreground',
                      isActive &&
                        'bg-primary/12 text-secondary shadow-[inset_0_0_0_1px_rgba(109,94,252,0.16)]',
                    )
                  }
                >
                  <Icon className="h-4.5 w-4.5" />
                  {label}
                  {[
                    'Speaking',
                    'Writing',
                    'Shadowing',
                    'Pronunciation',
                  ].includes(label) && (
                    <span className="ml-auto rounded-full border border-border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-muted/65">
                      Soon
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
