import {
  Captions,
  Languages,
  MousePointer2,
  Palette,
  ScanText,
  Sparkles,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge, Card } from '../ui'

const transcriptLines = [
  'Learn with content you genuinely enjoy.',
  'Follow every sentence as it is spoken.',
  'Return to difficult moments in one click.',
]

export const LandingBento = () => (
  <section className="mt-14" aria-labelledby="learning-experience-heading">
    <div className="mx-auto max-w-2xl text-center">
      <Badge variant="outline">
        <Sparkles className="mr-1.5 h-3 w-3 text-secondary" /> Built for focused learning
      </Badge>
      <h2
        id="learning-experience-heading"
        className="mt-5 text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl"
      >
        Everything stays connected to the moment.
      </h2>
      <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
        Listen, read, translate, and repeat without breaking your concentration.
      </p>
    </div>

    <div className="mt-9 grid gap-4 lg:grid-cols-12">
      <motion.div
        className="lg:col-span-7"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
      >
        <Card className="relative h-full min-h-105 overflow-hidden p-6 sm:p-8">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative flex items-start justify-between gap-5">
            <div>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-secondary">
                <Captions className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-foreground">
                A transcript that follows along
              </h3>
              <p className="mt-2 max-w-lg text-sm leading-6 text-muted">
                The active sentence stays visible while the video plays. Select any line to return to that exact moment.
              </p>
            </div>
            <Badge variant="primary">Synchronized</Badge>
          </div>

          <div className="relative mt-8 rounded-2xl border border-border bg-background/55 p-3 shadow-inner">
            <div className="mb-3 flex items-center justify-between px-2 py-1">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                <ScanText className="h-3.5 w-3.5" /> Live transcript
              </span>
              <span className="rounded-full bg-success/12 px-2 py-1 text-[9px] font-bold text-success">
                Playing
              </span>
            </div>
            <div className="space-y-2">
              {transcriptLines.map((line, index) => (
                <div
                  key={line}
                  className={`flex gap-3 rounded-xl border px-3.5 py-3.5 transition ${
                    index === 1
                      ? 'border-primary/35 bg-primary/10 shadow-[inset_3px_0_0_var(--app-primary)]'
                      : 'border-transparent bg-elevated/60'
                  }`}
                >
                  <span className="pt-0.5 font-mono text-[9px] text-muted">
                    0:{String(6 + index * 5).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{line}</p>
                    {index === 1 && (
                      <p className="mt-1.5 text-xs text-secondary">
                        Suivez chaque phrase pendant qu&apos;elle est prononcée.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute -bottom-4 right-5 inline-flex items-center gap-2 rounded-xl border border-border bg-elevated px-3 py-2 text-[10px] font-semibold text-foreground shadow-panel">
              <MousePointer2 className="h-3.5 w-3.5 text-accent" /> Click to seek
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.08 }}
        >
          <Card className="relative h-full overflow-hidden p-6">
            <div className="absolute -bottom-20 -right-14 h-44 w-44 rounded-full bg-accent/12 blur-3xl" />
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
              <Languages className="h-4.5 w-4.5" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-foreground">Translate only when needed</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Reveal one line or translate the session in bulk. Your first guess always comes first.
            </p>
            <div className="relative mt-5 space-y-2 rounded-xl border border-border bg-elevated/70 p-4">
              <p className="text-sm font-medium text-foreground">Consistency changes everything.</p>
              <div className="h-px bg-border" />
              <p className="text-sm text-accent">La régularité change tout.</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.14 }}
        >
          <Card className="relative h-full overflow-hidden p-6">
            <div className="absolute -left-16 -top-20 h-44 w-44 rounded-full bg-secondary/12 blur-3xl" />
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary/12 text-secondary">
              <Palette className="h-4.5 w-4.5" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-foreground">Make reading feel natural</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Adjust type, spacing, themes, visibility, and scrolling without leaving the transcript.
            </p>
            <div className="mt-5 flex gap-2">
              {['Aa', 'Serif', 'Mono'].map((label, index) => (
                <span
                  key={label}
                  className={`flex-1 rounded-lg border px-2 py-2 text-center text-xs ${
                    index === 0
                      ? 'border-primary/40 bg-primary/10 text-secondary'
                      : 'border-border bg-elevated text-muted'
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  </section>
)
