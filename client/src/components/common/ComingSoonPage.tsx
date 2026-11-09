import { ArrowLeft, Sparkles, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Card } from '../ui'

interface ComingSoonPageProps {
  icon: LucideIcon
  title: string
  description: string
  accent: string
}

export const ComingSoonPage = ({
  icon: Icon,
  title,
  description,
  accent,
}: ComingSoonPageProps) => (
  <div className="mx-auto flex min-h-[calc(100vh-4.25rem)] max-w-4xl items-center px-4 py-12 sm:px-6">
    <Card className="relative w-full overflow-hidden p-8 text-center sm:p-14">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-secondary shadow-glow">
          <Icon className="h-7 w-7" />
        </span>
        <Badge variant="primary" className="mt-6">
          <Sparkles className="mr-1 h-3 w-3" /> Coming soon
        </Badge>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">
          {description}
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Home
        </Link>
      </div>
    </Card>
  </div>
)
