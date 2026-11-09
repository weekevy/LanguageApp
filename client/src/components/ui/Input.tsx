import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
  error?: string | undefined
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, error, ...props }, ref) => (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'h-12 w-full rounded-xl border border-border bg-elevated px-4 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-primary/60 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60',
            Boolean(icon) && 'pl-11',
            error && 'border-danger/70 focus:border-danger focus:ring-danger/10',
            className,
          )}
          aria-invalid={Boolean(error)}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  ),
)

Input.displayName = 'Input'
