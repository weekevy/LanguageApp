import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { LoadingSpinner } from './LoadingSpinner'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'border border-primary/80 bg-primary text-white shadow-lg shadow-primary/20 hover:-translate-y-px hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/20 active:translate-y-0 disabled:bg-primary/60',
  secondary:
    'border border-border bg-elevated text-foreground shadow-sm hover:border-primary/40 hover:bg-surface-hover',
  ghost: 'text-muted hover:bg-surface-hover hover:text-foreground',
  danger: 'bg-danger/15 text-danger hover:bg-danger/25',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 rounded-lg px-3 text-xs',
  md: 'h-11 rounded-xl px-4 text-sm',
  lg: 'h-13 rounded-xl px-5 text-sm',
  icon: 'h-10 w-10 rounded-xl p-0',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-2 font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner className="h-4 w-4" />}
      {children}
    </button>
  ),
)

Button.displayName = 'Button'
