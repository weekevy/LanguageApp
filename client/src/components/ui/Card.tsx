import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export const Card = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'rounded-2xl border border-border bg-surface shadow-[var(--app-shadow-soft)]',
      className,
    )}
    {...props}
  />
)
