import { Link2, PlaySquare, Repeat2 } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Link2,
    title: 'Paste a video',
    description: 'Choose a YouTube video you already want to understand.',
  },
  {
    number: '02',
    icon: PlaySquare,
    title: 'Follow the language',
    description: 'Watch with a synchronized transcript and useful translations.',
  },
  {
    number: '03',
    icon: Repeat2,
    title: 'Replay what matters',
    description: 'Seek, repeat, and shape the reading experience around you.',
  },
]

export const HowItWorks = () => (
  <section className="mt-14 overflow-hidden rounded-3xl border border-border bg-surface px-5 py-8 sm:px-8 lg:px-10">
    <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:items-center">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
          A calmer workflow
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          From watching to understanding in three steps.
        </h2>
      </div>
      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map(({ number, icon: Icon, title, description }) => (
          <li key={number} className="relative rounded-2xl border border-border bg-elevated/60 p-4">
            <span className="absolute right-4 top-3 font-mono text-[10px] text-muted/70">
              {number}
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-secondary">
              <Icon className="h-4 w-4" />
            </span>
            <h3 className="mt-4 text-sm font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-xs leading-5 text-muted">{description}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
)
