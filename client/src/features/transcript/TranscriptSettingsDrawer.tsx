import { RotateCcw } from 'lucide-react'
import type { LanguageCode } from '@linguatube/shared'
import { languageNames, supportedLanguages } from '@linguatube/shared'
import { Button, Drawer, Select, Slider, Toggle } from '../../components/ui'
import { cn } from '../../lib/cn'
import {
  useSettingsStore,
  type TranscriptFont,
} from '../../store/settingsStore'

interface TranscriptSettingsDrawerProps {
  open: boolean
  onClose: () => void
}

const Section = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <section className="border-b border-border py-4 first:pt-0 last:border-0 sm:py-5">
    <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted sm:mb-4 sm:text-[11px]">
      {title}
    </h3>
    {children}
  </section>
)

export const TranscriptSettingsDrawer = ({
  open,
  onClose,
}: TranscriptSettingsDrawerProps) => {
  const settings = useSettingsStore((state) => state.settings)
  const update = useSettingsStore((state) => state.updateSetting)
  const reset = useSettingsStore((state) => state.resetSettings)
  return (
    <Drawer open={open} onClose={onClose} title="Transcript appearance">
      <Section title="Typography">
        <div className="grid grid-cols-3 gap-2">
          {(['sans', 'serif', 'mono'] as TranscriptFont[]).map((font) => (
            <button
              key={font}
              type="button"
              onClick={() => update('fontFamily', font)}
              className={cn(
                'rounded-lg border border-border bg-elevated px-2 py-2.5 text-xs capitalize text-muted transition hover:text-foreground',
                settings.fontFamily === font &&
                  'border-primary/50 bg-primary/10 text-secondary',
              )}
            >
              {font}
            </button>
          ))}
        </div>
        <label className="mt-4 block sm:mt-5">
          <span className="mb-2 flex justify-between text-xs text-muted">
            Font size{' '}
            <strong className="text-foreground">{settings.fontSize}px</strong>
          </span>
          <Slider
            min={13}
            max={26}
            value={settings.fontSize}
            onChange={(event) => update('fontSize', Number(event.target.value))}
          />
        </label>
        <label className="mt-4 block sm:mt-5">
          <span className="mb-2 flex justify-between text-xs text-muted">
            Font weight{' '}
            <strong className="text-foreground">{settings.fontWeight}</strong>
          </span>
          <Slider
            min={400}
            max={700}
            step={50}
            value={settings.fontWeight}
            onChange={(event) =>
              update('fontWeight', Number(event.target.value))
            }
          />
        </label>
        <label className="mt-4 block sm:mt-5">
          <span className="mb-2 flex justify-between text-xs text-muted">
            Line height{' '}
            <strong className="text-foreground">
              {settings.lineHeight.toFixed(1)}
            </strong>
          </span>
          <Slider
            min={1.3}
            max={2.2}
            step={0.1}
            value={settings.lineHeight}
            onChange={(event) =>
              update('lineHeight', Number(event.target.value))
            }
          />
        </label>
        <div className="mt-4 sm:mt-5">
          <span className="mb-2 block text-xs text-muted">Text alignment</span>
          <Select
            value={settings.textAlignment}
            onChange={(event) =>
              update(
                'textAlignment',
                event.target.value as 'left' | 'center' | 'right',
              )
            }
            options={[
              { value: 'left', label: 'Left' },
              { value: 'center', label: 'Center' },
              { value: 'right', label: 'Right' },
            ]}
          />
        </div>
      </Section>

      <Section title="Appearance">
        <p className="mb-4 rounded-xl bg-primary/8 px-3 py-2.5 text-[11px] leading-4 text-muted">
          The transcript now follows your selected app theme automatically.
        </p>
        <label className="block">
          <span className="mb-2 flex justify-between text-xs text-muted">
            Background opacity
            <strong className="text-foreground">
              {settings.backgroundOpacity}%
            </strong>
          </span>
          <Slider
            min={60}
            max={100}
            value={settings.backgroundOpacity}
            onChange={(event) =>
              update('backgroundOpacity', Number(event.target.value))
            }
          />
        </label>
        <Toggle
          checked={settings.showBorder}
          onCheckedChange={(value) => update('showBorder', value)}
          label="Transcript border"
        />
        <div className="mt-3">
          <span className="mb-2 block text-xs text-muted">
            Active line color
          </span>
          <Select
            value={settings.activeHighlight}
            onChange={(event) =>
              update(
                'activeHighlight',
                event.target.value as 'violet' | 'cyan' | 'emerald',
              )
            }
            options={[
              { value: 'violet', label: 'Violet' },
              { value: 'cyan', label: 'Cyan' },
              { value: 'emerald', label: 'Emerald' },
            ]}
          />
        </div>
      </Section>

      <Section title="Content">
        <Toggle
          checked={settings.showOriginal}
          onCheckedChange={(value) => update('showOriginal', value)}
          label="Captions"
        />
        <label className="mt-3 block">
          <span className="mb-2 flex justify-between text-xs text-muted">
            Caption opacity
            <strong className="text-foreground">
              {settings.captionOpacity}%
            </strong>
          </span>
          <Slider
            min={0}
            max={100}
            step={5}
            value={settings.captionOpacity}
            disabled={!settings.showOriginal}
            onChange={(event) =>
              update('captionOpacity', Number(event.target.value))
            }
          />
        </label>
        <Toggle
          checked={settings.showTranslations}
          onCheckedChange={(value) => update('showTranslations', value)}
          label="Translations"
        />
        <Toggle
          checked={settings.showTimestamps}
          onCheckedChange={(value) => update('showTimestamps', value)}
          label="Timestamps"
        />
        <Toggle
          checked={settings.showSpeakers}
          onCheckedChange={(value) => update('showSpeakers', value)}
          label="Speaker labels"
        />
        <label className="mt-3 block">
          <span className="mb-2 block text-xs text-muted">
            Translation language
          </span>
          <Select
            value={settings.targetLanguage}
            onChange={(event) =>
              update('targetLanguage', event.target.value as LanguageCode)
            }
            options={supportedLanguages
              .filter((code) => code !== 'en')
              .map((code) => ({ value: code, label: languageNames[code] }))}
          />
        </label>
      </Section>

      <Section title="Behavior">
        <Toggle
          checked={settings.keepActiveCentered}
          onCheckedChange={(value) => update('keepActiveCentered', value)}
          label="Keep active line centered"
        />
        <Toggle
          checked={settings.autoHideTranslations}
          onCheckedChange={(value) => update('autoHideTranslations', value)}
          label="Focus translation on active line"
          description="Hide translations for inactive lines while the video plays."
        />
        <Toggle
          checked={settings.highlightActiveWords}
          onCheckedChange={(value) => update('highlightActiveWords', value)}
          label="Word-level highlighting"
          description="Follow each spoken word when timing data is available."
        />
      </Section>

      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={reset}
      >
        <RotateCcw className="h-4 w-4" /> Reset transcript settings
      </Button>
    </Drawer>
  )
}
