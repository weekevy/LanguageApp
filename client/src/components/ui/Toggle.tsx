import { cn } from '../../lib/cn'

interface ToggleProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
  description?: string
  disabled?: boolean
}

export const Toggle = ({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
}: ToggleProps) => (
  <label className="flex cursor-pointer items-start justify-between gap-4 py-2">
    <span>
      <span className="block text-sm font-medium text-foreground">{label}</span>
      {description && (
        <span className="mt-0.5 block text-xs leading-5 text-muted">
          {description}
        </span>
      )}
    </span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:opacity-50',
        checked
          ? 'border-primary bg-primary'
          : 'border-border-strong bg-elevated',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0.5',
        )}
      />
    </button>
  </label>
)
