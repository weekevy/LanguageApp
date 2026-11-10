import { Menu, X } from 'lucide-react'
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { useCssPresence } from '../../lib/presence'
import { useUiStore } from '../../store/uiStore'
import { Button } from '../ui'
import { navigationItems } from './navigation'

export const MobileMenu = () => {
  const open = useUiStore((state) => state.isMobileMenuOpen)
  const close = useUiStore((state) => state.closeMobileMenu)
  const presence = useCssPresence(open, 200)

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!presence.mounted) return null

  return (
    <div
      className={cn(
        'css-mobile-menu fixed inset-0 z-80 lg:hidden',
        presence.visible && 'is-open',
      )}
    >
      <button
        type="button"
        aria-label="Close navigation"
        className="css-mobile-menu-backdrop absolute inset-0 bg-black/60"
        onClick={close}
      />
      <aside className="mobile-menu-panel css-mobile-menu-panel absolute inset-y-0 left-0 flex w-[min(82vw,310px)] flex-col rounded-tr-3xl bg-surface p-5 shadow-[8px_0_24px_rgba(0,0,0,0.16)] [will-change:transform]">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-elevated text-secondary">
              <Menu className="h-4.5 w-4.5" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Menu</p>
              <p className="text-[10px] text-muted">Navigate LinguaTube</p>
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
        <nav className="app-scrollbar mt-3 flex-1 space-y-1 overflow-y-auto border-t border-border pt-4">
          {navigationItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              onClick={close}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-xl border border-transparent px-2.5 py-2.5 text-sm font-medium text-muted transition-[color,background-color,border-color,transform] duration-150 active:scale-[0.98]',
                  isActive && 'border-border bg-elevated text-foreground',
                )
              }
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg text-secondary transition-colors group-hover:bg-surface-hover">
                <Icon className="h-4.5 w-4.5" />
              </span>
              {label}
              {['Speaking', 'Writing', 'Shadowing', 'Pronunciation'].includes(
                label,
              ) && (
                <span className="ml-auto rounded-full border border-border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-muted/65">
                  Soon
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  )
}
