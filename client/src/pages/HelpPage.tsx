import {
  CircleHelp,
  Keyboard,
  LifeBuoy,
  PlayCircle,
  Settings2,
} from 'lucide-react'
import { Card } from '../components/ui'

const helpItems = [
  {
    icon: PlayCircle,
    title: 'Starting a lesson',
    description:
      'Paste a public YouTube URL on Home. The video, transcript, and translations load together.',
  },
  {
    icon: Keyboard,
    title: 'Player shortcuts',
    description:
      'Use Space to play, arrow keys to seek, M to mute, and F for fullscreen.',
  },
  {
    icon: Settings2,
    title: 'Transcript controls',
    description:
      'Open the transcript settings to change themes, typography, translation language, and word tracking.',
  },
]

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-surface p-7 shadow-[var(--app-shadow-soft)] sm:p-10">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/12 blur-3xl" />
        <div className="relative">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/10 text-accent">
            <LifeBuoy className="h-5 w-5" />
          </span>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
            Help center
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
            How can we help?
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            Quick answers for the learning studio, player, transcript, and
            account.
          </p>
        </div>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {helpItems.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="p-5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-secondary">
              <Icon className="h-4.5 w-4.5" />
            </span>
            <h2 className="mt-4 text-sm font-semibold text-foreground">
              {title}
            </h2>
            <p className="mt-2 text-xs leading-6 text-muted">{description}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-5 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <CircleHelp className="mt-0.5 h-5 w-5 text-secondary" />
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Still need help?
            </h2>
            <p className="mt-1 text-xs text-muted">
              Send a message to the local project support address.
            </p>
          </div>
        </div>
        <a
          href="mailto:support@linguatube.local"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-elevated px-4 text-xs font-semibold text-foreground transition hover:border-primary/40 hover:text-secondary"
        >
          Contact support
        </a>
      </Card>
    </div>
  )
}
