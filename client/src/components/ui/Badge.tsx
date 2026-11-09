import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'outline'

const variants: Record<BadgeVariant, string> = {
  default: 'bg-elevated text-muted',
  primary: 'bg-primary/15 text-secondary',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  outline: 'border border-border text-muted',
}

export const Badge = ({
  className,
  variant = 'default',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold',
      variants[variant],
      className,
    )}
    {...props}
  />
)
