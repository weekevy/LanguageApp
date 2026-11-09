import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export const LoadingSpinner = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      'inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent',
      className,
    )}
    aria-hidden="true"
    {...props}
  />
)
