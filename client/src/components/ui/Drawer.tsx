import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/cn'
import { useMediaQuery } from '../../lib/media'
import { Button } from './Button'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export const Drawer = ({ open, onClose, title, children }: DrawerProps) => {
  const isMobile = useMediaQuery('(max-width: 639px)')

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open])

  return createPortal(
    <div
      className={cn('css-drawer fixed inset-0 z-90', open && 'is-open')}
      aria-hidden={!open}
      inert={!open}
    >
      <button
        type="button"
        aria-label="Close settings"
        className="css-drawer-backdrop absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={cn(
          'css-drawer-panel absolute flex w-full flex-col bg-surface shadow-none sm:shadow-[var(--app-shadow)]',
          isMobile
            ? 'is-mobile inset-x-2 bottom-2 max-h-[72dvh] rounded-3xl border border-border'
            : 'is-desktop inset-y-0 right-0 max-w-md border-l border-border',
        )}
      >
        <header className="relative flex items-center justify-between overflow-hidden border-b border-border px-4 pb-3 pt-6 sm:px-5 sm:py-4">
          <span className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-border-strong sm:hidden" />
          <div className="pointer-events-none absolute -right-5 -top-12 h-24 w-24 rounded-full bg-primary/14 blur-2xl" />
          <h2 id="drawer-title" className="font-semibold text-foreground">
            {title}
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close drawer"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </header>
        <div className="app-scrollbar flex-1 overflow-y-auto p-4 sm:p-5">
          {children}
        </div>
      </aside>
    </div>,
    document.body,
  )
}
