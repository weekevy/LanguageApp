import { Globe2 } from 'lucide-react'

const languages = [
  ['EN', 'English'],
  ['FR', 'Français'],
  ['AR', 'العربية'],
  ['ES', 'Español'],
  ['DE', 'Deutsch'],
  ['IT', 'Italiano'],
  ['PT', 'Português'],
  ['JA', '日本語'],
  ['ZH', '中文'],
]

export const LanguageStrip = () => (
  <section className="deferred-section mt-3 rounded-2xl border border-border bg-surface px-3 py-3 sm:mt-5 sm:px-6 sm:py-4">
    <div className="flex flex-col gap-3 sm:gap-4 xl:flex-row xl:items-center">
      <div className="flex shrink-0 items-center gap-2 text-xs font-semibold text-foreground">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/10 text-accent sm:h-8 sm:w-8">
          <Globe2 className="h-4 w-4" />
        </span>
        Nine translation targets
      </div>
      <div className="app-scrollbar flex gap-2 overflow-x-auto pb-1 xl:ml-auto xl:pb-0">
        {languages.map(([code, name]) => (
          <span
            key={code}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-elevated/70 px-2.5 py-1 text-[10px] text-muted sm:gap-2 sm:px-3 sm:py-1.5"
          >
            <strong className="text-secondary">{code}</strong>
            {name}
          </span>
        ))}
      </div>
    </div>
  </section>
)
