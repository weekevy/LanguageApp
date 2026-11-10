import type { TranscriptLine } from '@linguatube/shared'
import {
  BookmarkPlus,
  Check,
  Crown,
  Eye,
  EyeOff,
  Languages,
  Lock,
  RefreshCw,
} from 'lucide-react'
import { Fragment, memo, useMemo, useRef, type KeyboardEvent } from 'react'
import { Button } from '../../components/ui'
import { cn } from '../../lib/cn'
import { formatTimestamp } from '../../lib/format'
import type { TranscriptSettings } from '../../store/settingsStore'
import { useVideoStore } from '../../store/videoStore'

export interface SelectedTranscriptWord {
  lineId: string
  wordId: string
  text: string
}

export interface TranscriptLineItemProps {
  line: TranscriptLine
  index: number
  isActive: boolean
  currentTime: number | null
  isPlaying: boolean
  isUnlocked: boolean
  isHidden: boolean
  isTranslating: boolean
  selectedWord: SelectedTranscriptWord | null
  selectedWordSaved: boolean
  settings: TranscriptSettings
  isFreePlan: boolean
  onSeek: (seconds: number) => void
  onLineKeyDown: (
    event: KeyboardEvent<HTMLDivElement>,
    index: number,
    start: number,
  ) => void
  onSelectWord: (lineId: string, wordId: string, text: string) => void
  onToggleTranslation: (lineId: string) => void
  onTranslateLine: (lineId: string) => void
  onSaveWord: (line: TranscriptLine, word: SelectedTranscriptWord) => void
  onUpgrade: () => void
}

const fontClasses = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
}

const highlightClasses = {
  violet: 'border-primary/45 bg-primary/12',
  cyan: 'border-accent/45 bg-accent/10',
  emerald: 'border-success/45 bg-success/10',
}

const normalizeSelectedWord = (word: string) =>
  word.trim().replace(/^[^\p{L}\p{N}'’-]+|[^\p{L}\p{N}'’-]+$/gu, '')

export const TranscriptLineItem = memo(function TranscriptLineItem({
  line,
  index,
  isActive,
  currentTime,
  isPlaying,
  isUnlocked,
  isHidden,
  isTranslating,
  selectedWord,
  selectedWordSaved,
  settings,
  isFreePlan,
  onSeek,
  onLineKeyDown,
  onSelectWord,
  onToggleTranslation,
  onTranslateLine,
  onSaveWord,
  onUpgrade,
}: TranscriptLineItemProps) {
  const lastTouchRef = useRef<{ wordId: string; time: number } | null>(null)
  const displayWords = useMemo(
    () =>
      line.words ??
      (line.text.match(/\S+/g) ?? []).map((text, wordIndex) => ({
        id: `${line.id}-display-word-${wordIndex}`,
        text,
        start: line.start,
        end: line.end,
      })),
    [line],
  )
  const showTranslation =
    settings.showTranslations &&
    !isHidden &&
    !(settings.autoHideTranslations && isPlaying && !isActive)
  const activeWordId =
    isActive && settings.highlightActiveWords && currentTime !== null
      ? line.words?.find(
          (word, wordIndex) =>
            currentTime >= word.start &&
            (currentTime < word.end ||
              (wordIndex === (line.words?.length ?? 0) - 1 &&
                currentTime <= word.end)),
        )?.id
      : undefined
  const activeProgress =
    isActive && currentTime !== null
      ? Math.min(
          100,
          Math.max(
            0,
            ((currentTime - line.start) /
              Math.max(line.end - line.start, 0.01)) *
              100,
          ),
        )
      : 0

  return (
    <article
      className={cn(
        'transcript-line group relative rounded-xl border border-transparent',
        isActive
          ? highlightClasses[settings.activeHighlight]
          : 'hover:border-[var(--transcript-border)] hover:bg-white/3',
      )}
    >
      <div
        role="button"
        tabIndex={0}
        data-line-id={line.id}
        data-transcript-line
        aria-label={`Jump to ${formatTimestamp(line.start)}`}
        className={cn(
          'w-full rounded-xl px-3 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 sm:px-3.5',
          fontClasses[settings.fontFamily],
        )}
        style={{
          fontSize: settings.fontSize,
          fontWeight: settings.fontWeight,
          lineHeight: settings.lineHeight,
          textAlign: settings.textAlignment,
        }}
        onClick={() => onSeek(line.start)}
        onKeyDown={(event) => onLineKeyDown(event, index, line.start)}
      >
        <span className="mb-1.5 flex items-center gap-2 pr-14 text-[10px] font-semibold uppercase tracking-wider transcript-muted">
          {settings.showTimestamps && formatTimestamp(line.start)}
          {settings.showSpeakers && line.speaker && (
            <>
              <span aria-hidden="true">·</span>
              {line.speaker}
            </>
          )}
          {isActive && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary/16 px-2 py-0.5 text-[9px] text-secondary">
              <span className="h-1 w-1 rounded-full bg-secondary" /> Playing
            </span>
          )}
        </span>

        {settings.showOriginal && (
          <span
            className="block"
            style={{ opacity: settings.captionOpacity / 100 }}
          >
            {displayWords.map((word) => (
              <Fragment key={word.id}>
                <button
                  type="button"
                  tabIndex={-1}
                  className={cn(
                    'transcript-word inline touch-manipulation rounded px-0.5 text-inherit',
                    activeWordId === word.id &&
                      'is-active bg-primary text-white',
                    selectedWord?.wordId === word.id &&
                      'is-selected bg-secondary/20 text-secondary underline decoration-secondary/60 underline-offset-4',
                  )}
                  aria-label={`Select ${word.text}`}
                  onKeyDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation()
                    const text = normalizeSelectedWord(word.text)
                    if (text) onSelectWord(line.id, word.id, text)
                  }}
                  onDoubleClick={(event) => {
                    event.stopPropagation()
                    onSeek(word.start)
                  }}
                  onPointerUp={(event) => {
                    event.stopPropagation()
                    if (event.pointerType === 'mouse') return

                    const previous = lastTouchRef.current
                    if (
                      previous?.wordId === word.id &&
                      event.timeStamp - previous.time <= 350
                    ) {
                      lastTouchRef.current = null
                      onSeek(word.start)
                      return
                    }

                    lastTouchRef.current = {
                      wordId: word.id,
                      time: event.timeStamp,
                    }
                  }}
                >
                  {word.text}
                </button>{' '}
              </Fragment>
            ))}
          </span>
        )}

        {showTranslation && (
          <span className="transcript-translation relative mt-2 block text-[0.88em] transcript-muted">
            {isUnlocked ? (
              isTranslating ? (
                <span className="inline-flex items-center gap-2 text-secondary">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />{' '}
                  Translating…
                </span>
              ) : line.translatedText ? (
                line.translatedText
              ) : (
                <span className="text-secondary">
                  Tap the language icon above to translate.
                </span>
              )
            ) : (
              <span className="block select-none blur-[5px]">
                {line.translatedText ??
                  'This translation is available with LinguaTube Pro.'}
              </span>
            )}
          </span>
        )}
      </div>

      {selectedWord && (
        <div className="transcript-word-save mx-3 mb-3 flex items-center justify-between gap-3 rounded-xl bg-elevated/90 px-3 py-2 text-[11px]">
          <span className="min-w-0 truncate transcript-muted">
            Save{' '}
            <strong className="text-[var(--transcript-text)]">
              “{selectedWord.text}”
            </strong>
            ?
          </span>
          <button
            type="button"
            disabled={selectedWordSaved}
            className={cn(
              'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 font-semibold transition-[background-color,color,transform] active:scale-95',
              selectedWordSaved
                ? 'bg-success/12 text-success'
                : 'bg-primary text-white',
            )}
            onClick={() => onSaveWord(line, selectedWord)}
          >
            {selectedWordSaved ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <BookmarkPlus className="h-3.5 w-3.5" />
            )}
            {selectedWordSaved ? 'Saved' : 'Save word'}
          </button>
        </div>
      )}

      <div className="absolute right-2 top-2 hidden items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 sm:flex">
        {settings.showTranslations && isUnlocked && (
          <button
            type="button"
            className="grid h-7 w-7 place-items-center rounded-lg bg-elevated text-muted hover:text-foreground"
            aria-label={
              isHidden ? 'Show line translation' : 'Hide line translation'
            }
            onClick={() => onToggleTranslation(line.id)}
          >
            {isHidden ? (
              <Eye className="h-3.5 w-3.5" />
            ) : (
              <EyeOff className="h-3.5 w-3.5" />
            )}
          </button>
        )}
        {isUnlocked && !line.translatedText && (
          <button
            type="button"
            className="grid h-7 w-7 place-items-center rounded-lg bg-elevated text-secondary"
            aria-label="Translate this line"
            onClick={() => onTranslateLine(line.id)}
          >
            <Languages className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {!isUnlocked && settings.showTranslations && (
        <button
          type="button"
          onClick={onUpgrade}
          className="absolute bottom-2.5 right-3 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-elevated/95 px-2 py-1 text-[9px] font-bold text-secondary"
        >
          <Lock className="h-2.5 w-2.5" /> Pro
        </button>
      )}

      {index === 4 && isFreePlan && (
        <div className="mx-3 mb-3 flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/8 px-3 py-2.5">
          <div className="flex items-center gap-2 text-[11px] text-muted">
            <Crown className="h-3.5 w-3.5 text-warning" />
            Remaining translations are locked on Free.
          </div>
          <Button type="button" size="sm" onClick={onUpgrade}>
            Unlock
          </Button>
        </div>
      )}

      {isActive && (
        <span className="pointer-events-none absolute inset-x-3 bottom-0 h-0.5 overflow-hidden rounded-full bg-primary/10">
          <span
            className="block h-full w-full origin-left rounded-full bg-gradient-to-r from-primary to-accent transition-transform duration-200 ease-linear"
            style={{ transform: `scaleX(${activeProgress / 100})` }}
          />
        </span>
      )}
    </article>
  )
})

type ActiveTranscriptLineItemProps = Omit<
  TranscriptLineItemProps,
  'currentTime' | 'isActive'
>

export const ActiveTranscriptLineItem = memo(function ActiveTranscriptLineItem(
  props: ActiveTranscriptLineItemProps,
) {
  const currentTime = useVideoStore((state) => state.currentTime)

  return <TranscriptLineItem {...props} isActive currentTime={currentTime} />
})
