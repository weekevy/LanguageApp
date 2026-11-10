import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/cn'
import { useCssPresence } from '../../lib/presence'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const widths = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
}: ModalProps) => {
  const presence = useCssPresence(open)

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

  if (!presence.mounted) return null

  return createPortal(
    <div
      className={cn(
        'css-modal fixed inset-0 z-100 flex items-end justify-center bg-black/70 sm:items-center sm:p-4',
        presence.visible && 'is-open',
      )}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`css-modal-panel w-full ${widths[size]} max-h-[92dvh] overflow-y-auto overscroll-contain rounded-t-3xl border-x border-t border-border bg-surface shadow-[var(--app-shadow)] [will-change:transform,opacity] sm:max-h-[calc(100dvh-2rem)] sm:rounded-3xl sm:border`}
      >
        <header className="relative flex items-start justify-between gap-4 overflow-hidden border-b border-border px-5 pb-4 pt-7 sm:px-6 sm:py-5">
          <span className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-border-strong sm:hidden" />
          <div className="pointer-events-none absolute -right-8 -top-16 h-32 w-32 rounded-full bg-primary/14 blur-2xl" />
          <div>
            <h2 id="modal-title" className="font-semibold text-foreground">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm leading-5 text-muted">{description}</p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </header>
        {children}
      </section>
    </div>,
    document.body,
  )
}
