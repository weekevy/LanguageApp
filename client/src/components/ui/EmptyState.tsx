import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) => (
  <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
    <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-border bg-elevated text-secondary">
      <Icon className="h-5 w-5" />
    </span>
    <h3 className="font-semibold text-foreground">{title}</h3>
    <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
)
