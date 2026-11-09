import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
}

export const Select = ({ className, options, ...props }: SelectProps) => (
  <div className="relative">
    <select
      className={cn(
        'h-10 w-full appearance-none rounded-lg border border-border bg-elevated px-3 pr-9 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/10',
        className,
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
  </div>
)
