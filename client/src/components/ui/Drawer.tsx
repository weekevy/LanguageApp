import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './Button'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export const Drawer = ({ open, onClose, title, children }: DrawerProps) => {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, open])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-90">
          <motion.button
            type="button"
            aria-label="Close settings"
            className="absolute inset-0 bg-black/55 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-border bg-surface shadow-[var(--app-shadow)]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <header className="relative flex items-center justify-between overflow-hidden border-b border-border px-5 py-4">
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
            <div className="app-scrollbar flex-1 overflow-y-auto p-5">
              {children}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
