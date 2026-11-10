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
    description:
      'Watch with a synchronized transcript and useful translations.',
  },
  {
    number: '03',
    icon: Repeat2,
    title: 'Replay what matters',
    description: 'Seek, repeat, and shape the reading experience around you.',
  },
]

export const HowItWorks = () => (
  <section className="deferred-section mt-8 overflow-hidden rounded-2xl border border-border bg-surface px-4 py-5 sm:mt-14 sm:rounded-3xl sm:px-8 sm:py-8 lg:px-10">
    <div className="grid gap-5 sm:gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:items-center">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
          A calmer workflow
        </p>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:mt-3 sm:text-3xl">
          From watching to understanding in three steps.
        </h2>
      </div>
      <ol className="grid gap-2.5 sm:grid-cols-3 sm:gap-3">
        {steps.map(({ number, icon: Icon, title, description }) => (
          <li
            key={number}
            className="relative rounded-xl border border-border bg-elevated/60 p-3 sm:rounded-2xl sm:p-4"
          >
            <span className="absolute right-3 top-3 font-mono text-[10px] text-muted/70 sm:right-4">
              {number}
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-secondary">
              <Icon className="h-4 w-4" />
            </span>
            <h3 className="mt-3 text-sm font-semibold text-foreground sm:mt-4">
              {title}
            </h3>
            <p className="mt-1.5 text-xs leading-5 text-muted sm:mt-2">
              {description}
            </p>
          </li>
        ))}
      </ol>
    </div>
  </section>
)
