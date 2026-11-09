import { Captions } from 'lucide-react'
import { cn } from '../../lib/cn'

export const Logo = ({ compact = false }: { compact?: boolean }) => (
  <span className="inline-flex items-center gap-2.5" aria-label="LinguaTube">
    <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl border border-white/15 bg-gradient-to-br from-primary via-secondary to-accent text-white shadow-lg shadow-primary/25">
      <Captions className="h-5 w-5" />
      <span className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-white/20" />
    </span>
    <span
      className={cn(
        'text-base font-bold tracking-[-0.03em] text-foreground',
        compact && 'sr-only',
      )}
    >
      Lingua<span className="text-secondary">Tube</span>
    </span>
  </span>
)
