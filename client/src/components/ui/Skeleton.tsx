import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('animate-pulse rounded-lg bg-elevated', className)}
    aria-hidden="true"
    {...props}
  />
)
