import {
  ArrowRight,
  Captions,
  Crown,
  Eye,
  EyeOff,
  Languages,
  Lock,
  RefreshCw,
  Settings2,
  Sparkles,
} from 'lucide-react'
import { languageNames } from '@linguatube/shared'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'
import toast from 'react-hot-toast'
import { Badge, Button, EmptyState, Skeleton } from '../../components/ui'
import { api } from '../../lib/api'
import { cn } from '../../lib/cn'
import { formatTimestamp } from '../../lib/format'
import { canViewTranslation, findActiveLineIndex } from '../../lib/transcript'
import { useAuthStore } from '../../store/authStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useSubscriptionStore } from '../../store/subscriptionStore'
import { useTranscriptStore } from '../../store/transcriptStore'
import { useVideoStore } from '../../store/videoStore'
import { TranscriptSettingsDrawer } from './TranscriptSettingsDrawer'

interface TranscriptPanelProps {
  onSeek: (seconds: number) => void
  height?: number | undefined
}

const fontClasses = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
}

const highlightClasses = {
  violet:
    'border-primary/45 bg-primary/12 shadow-[inset_3px_0_0_var(--app-primary)]',
  cyan: 'border-accent/45 bg-accent/10 shadow-[inset_3px_0_0_var(--app-accent)]',
  emerald:
    'border-success/45 bg-success/10 shadow-[inset_3px_0_0_var(--app-success)]',
}

export const TranscriptPanel = ({ onSeek, height }: TranscriptPanelProps) => {
  const lines = useTranscriptStore((state) => state.lines)
  const language = useTranscriptStore((state) => state.language)
  const isMock = useTranscriptStore((state) => state.isMock)
  const notice = useTranscriptStore((state) => state.notice)
  const isLoading = useTranscriptStore((state) => state.isLoading)
  const error = useTranscriptStore((state) => state.error)
  const translatingLineIds = useTranscriptStore(
    (state) => state.translatingLineIds,
  )
  const setLineTranslation = useTranscriptStore(
    (state) => state.setLineTranslation,
  )
  const setTranslating = useTranscriptStore((state) => state.setTranslating)
  const clearTranslations = useTranscriptStore(
    (state) => state.clearTranslations,
  )
  const currentTime = useVideoStore((state) => state.currentTime)
  const isPlaying = useVideoStore((state) => state.isPlaying)
  const settings = useSettingsStore((state) => state.settings)
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const plan = useAuthStore((state) => state.user?.plan ?? 'free')
  const openUpgrade = useSubscriptionStore((state) => state.openUpgrade)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [hiddenTranslations, setHiddenTranslations] = useState<Set<string>>(
    new Set(),
  )
  const [isBulkTranslating, setIsBulkTranslating] = useState(false)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const previousTargetLanguage = useRef(settings.targetLanguage)

  const activeIndex = useMemo(
    () => findActiveLineIndex(lines, currentTime),
    [currentTime, lines],
  )
  const activeLineId = activeIndex >= 0 ? lines[activeIndex]?.id : undefined
  const isSynchronizedDemo = notice
    ?.toLocaleLowerCase()
    .includes('synchronized')

  const translateLine = useCallback(
    async (lineId: string) => {
      const line = lines.find((candidate) => candidate.id === lineId)
      if (!line || translatingLineIds.has(lineId)) return

      setTranslating(lineId, true)
      try {
        const result = await api.translate(
          line.text,
          settings.targetLanguage,
          line.language,
        )
        setLineTranslation(lineId, result.translated)
      } catch (translationError) {
        toast.error(
          translationError instanceof Error
            ? translationError.message
            : 'Translation failed.',
        )
      } finally {
        setTranslating(lineId, false)
      }
    },
    [
      lines,
      setLineTranslation,
      setTranslating,
      settings.targetLanguage,
      translatingLineIds,
    ],
  )

  const translateAvailableLines = useCallback(async () => {
    const availableLines = lines.filter((_line, index) =>
      canViewTranslation(index, plan),
    )
    if (availableLines.length === 0) return

    setIsBulkTranslating(true)
    await Promise.allSettled(
      availableLines.map(async (line) => {
        setTranslating(line.id, true)
        try {
          const result = await api.translate(
            line.text,
            settings.targetLanguage,
            line.language,
          )
          setLineTranslation(line.id, result.translated)
        } finally {
          setTranslating(line.id, false)
        }
      }),
    )
    setIsBulkTranslating(false)
    toast.success(
      plan === 'pro'
        ? 'All transcript lines translated'
        : 'Your five free translations are ready',
    )
  }, [lines, plan, setLineTranslation, setTranslating, settings.targetLanguage])

  useEffect(() => {
    if (
      previousTargetLanguage.current === settings.targetLanguage ||
      lines.length === 0
    ) {
      return
    }

    previousTargetLanguage.current = settings.targetLanguage
    clearTranslations()
    void translateAvailableLines()
  }, [
    clearTranslations,
    lines.length,
    settings.targetLanguage,
    translateAvailableLines,
  ])

  useEffect(() => {
    if (!activeLineId || !settings.autoScroll) return
    const scroller = scrollerRef.current
    const activeElement = scrollerRef.current?.querySelector<HTMLElement>(
      `[data-line-id="${activeLineId}"]`,
    )
    if (!scroller || !activeElement) return

    const scrollerRect = scroller.getBoundingClientRect()
    const activeRect = activeElement.getBoundingClientRect()
    const elementTop = activeRect.top - scrollerRect.top + scroller.scrollTop
    const elementBottom = elementTop + activeRect.height
    let targetTop: number

    if (settings.keepActiveCentered) {
      targetTop = elementTop - scroller.clientHeight / 2 + activeRect.height / 2
    } else if (elementTop < scroller.scrollTop) {
      targetTop = elementTop - 12
    } else if (elementBottom > scroller.scrollTop + scroller.clientHeight) {
      targetTop = elementBottom - scroller.clientHeight + 12
    } else {
      return
    }

    const nextTop = Math.max(0, targetTop)
    if (typeof scroller.scrollTo === 'function') {
      scroller.scrollTo({ top: nextTop, behavior: 'smooth' })
    } else {
      scroller.scrollTop = nextTop
    }
  }, [activeLineId, settings.autoScroll, settings.keepActiveCentered])

  const handleLineKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    const nextIndex = event.key === 'ArrowDown' ? index + 1 : index - 1
    scrollerRef.current
      ?.querySelectorAll<HTMLButtonElement>('[data-transcript-line]')
      .item(nextIndex)
      ?.focus()
  }

  const transcriptStyle = {
    '--transcript-opacity': settings.backgroundOpacity / 100,
    ...(height ? { height, minHeight: height, maxHeight: height } : {}),
  } as CSSProperties

  return (
    <>
      <section
        className={cn(
          'transcript-surface flex h-[620px] max-h-[calc(100vh-7rem)] min-h-120 flex-col overflow-hidden rounded-2xl shadow-[var(--app-shadow)]',
          `transcript-theme-${settings.transcriptTheme}`,
          settings.showBorder ? 'border' : 'border border-transparent',
        )}
        style={transcriptStyle}
      >
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--transcript-border)] px-4 py-3.5">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-primary/20 bg-gradient-to-br from-primary/20 to-accent/10 text-secondary">
              <Captions className="h-4.5 w-4.5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">
                  Interactive transcript
                </h2>
                {isMock && (
                  <Badge variant={isSynchronizedDemo ? 'success' : 'warning'}>
                    {isSynchronizedDemo ? 'Synced demo' : 'Demo data'}
                  </Badge>
                )}
              </div>
              <p className="transcript-muted mt-0.5 flex items-center gap-1.5 text-[10px] font-medium">
                {languageNames[language]}
                <ArrowRight className="h-2.5 w-2.5" />
                {languageNames[settings.targetLanguage]}
                <span aria-hidden="true">·</span>
                {lines.length} lines
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              isLoading={isBulkTranslating}
              disabled={lines.length === 0}
              onClick={() => void translateAvailableLines()}
            >
              <Languages className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Translate</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Open transcript settings"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="flex items-center justify-between gap-4 border-b border-[var(--transcript-border)] bg-black/3 px-4 py-2.5">
          <span className="transcript-muted flex min-w-0 items-center gap-2 text-[11px]">
            <span
              className={cn(
                'h-1.5 w-1.5 shrink-0 rounded-full',
                isPlaying ? 'soft-pulse bg-success' : 'bg-muted',
              )}
            />
            <span className="truncate">
              {isPlaying
                ? 'Following the video'
                : 'Select a sentence to jump there'}
            </span>
          </span>
          <button
            type="button"
            aria-pressed={settings.showTranslations}
            onClick={() =>
              updateSetting('showTranslations', !settings.showTranslations)
            }
            className={cn(
              'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-[10px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70',
              settings.showTranslations
                ? 'border-primary/35 bg-primary/12 text-secondary'
                : 'border-[var(--transcript-border)] text-[var(--transcript-muted)] hover:text-[var(--transcript-text)]',
            )}
          >
            {settings.showTranslations ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
            {settings.showTranslations
              ? 'Hide translation'
              : 'Show translation'}
          </button>
        </div>

        {notice && (
          <div
            className={cn(
              'flex items-start gap-2 border-b px-4 py-2.5 text-[11px] leading-5',
              isSynchronizedDemo
                ? 'border-success/15 bg-success/8 text-success'
                : 'border-warning/15 bg-warning/8 text-warning',
            )}
          >
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {notice}
          </div>
        )}

        <div
          ref={scrollerRef}
          className="app-scrollbar flex-1 overflow-y-auto p-3 sm:p-4"
        >
          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 7 }, (_, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-[var(--transcript-border)] p-4"
                >
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="mt-3 h-4 w-full" />
                  <Skeleton className="mt-2 h-3 w-4/5" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && error && (
            <EmptyState
              icon={RefreshCw}
              title="Transcript unavailable"
              description={error}
            />
          )}

          {!isLoading && !error && lines.length === 0 && (
            <EmptyState
              icon={Captions}
              title="Your transcript will appear here"
              description="Load a YouTube video to start an interactive learning session."
            />
          )}

          {!isLoading && !error && lines.length > 0 && (
            <div className="space-y-2">
              {lines.map((line, index) => {
                const isActive = index === activeIndex
                const isUnlocked = canViewTranslation(index, plan)
                const isHidden = hiddenTranslations.has(line.id)
                const focusHidesTranslation =
                  settings.autoHideTranslations && isPlaying && !isActive
                const showTranslation =
                  settings.showTranslations &&
                  !isHidden &&
                  !focusHidesTranslation
                const isTranslating = translatingLineIds.has(line.id)
                const activeWordId =
                  isActive && settings.highlightActiveWords
                    ? line.words?.find(
                        (word, wordIndex) =>
                          currentTime >= word.start &&
                          (currentTime < word.end ||
                            (wordIndex === (line.words?.length ?? 0) - 1 &&
                              currentTime <= word.end)),
                      )?.id
                    : undefined
                const activeProgress = isActive
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
                    key={line.id}
                    className={cn(
                      'group relative rounded-xl border border-transparent transition-all duration-200',
                      isActive
                        ? highlightClasses[settings.activeHighlight]
                        : 'hover:border-[var(--transcript-border)] hover:bg-white/3 hover:shadow-sm',
                    )}
                  >
                    <button
                      type="button"
                      data-line-id={line.id}
                      data-transcript-line
                      className={cn(
                        'w-full rounded-xl px-3.5 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70',
                        fontClasses[settings.fontFamily],
                      )}
                      style={{
                        fontSize: settings.fontSize,
                        fontWeight: settings.fontWeight,
                        lineHeight: settings.lineHeight,
                        textAlign: settings.textAlignment,
                      }}
                      onClick={() => onSeek(line.start)}
                      onKeyDown={(event) => handleLineKeyDown(event, index)}
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
                          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-[9px] text-secondary">
                            <span className="soft-pulse h-1 w-1 rounded-full bg-secondary" />{' '}
                            Playing
                          </span>
                        )}
                      </span>
                      {settings.showOriginal && (
                        <span className="block">
                          {settings.highlightActiveWords && line.words
                            ? line.words.map((word) => (
                                <span
                                  key={word.id}
                                  className={cn(
                                    'mr-[0.28em] inline-block rounded px-0.5 transition-all duration-100',
                                    activeWordId === word.id &&
                                      'scale-[1.04] bg-primary px-1 text-white shadow-md shadow-primary/25',
                                  )}
                                >
                                  {word.text}
                                </span>
                              ))
                            : line.text}
                        </span>
                      )}
                      {showTranslation && (
                        <span className="relative mt-2 block text-[0.88em] transcript-muted">
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
                                Select translate to generate this line.
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
                    </button>

                    <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                      {settings.showTranslations && isUnlocked && (
                        <button
                          type="button"
                          className="grid h-7 w-7 place-items-center rounded-lg bg-elevated text-muted shadow-sm hover:text-foreground"
                          aria-label={
                            isHidden
                              ? 'Show line translation'
                              : 'Hide line translation'
                          }
                          onClick={() =>
                            setHiddenTranslations((current) => {
                              const next = new Set(current)
                              if (next.has(line.id)) next.delete(line.id)
                              else next.add(line.id)
                              return next
                            })
                          }
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
                          className="grid h-7 w-7 place-items-center rounded-lg bg-elevated text-secondary shadow-sm"
                          aria-label="Translate this line"
                          onClick={() => void translateLine(line.id)}
                        >
                          <Languages className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    {!isUnlocked && settings.showTranslations && (
                      <button
                        type="button"
                        onClick={openUpgrade}
                        className="absolute bottom-2.5 right-3 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-elevated/95 px-2 py-1 text-[9px] font-bold text-secondary shadow-sm"
                      >
                        <Lock className="h-2.5 w-2.5" /> Pro
                      </button>
                    )}

                    {index === 4 && plan === 'free' && (
                      <div className="mx-3 mb-3 flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/8 px-3 py-2.5">
                        <div className="flex items-center gap-2 text-[11px] text-muted">
                          <Crown className="h-3.5 w-3.5 text-warning" />
                          Remaining translations are locked on Free.
                        </div>
                        <Button type="button" size="sm" onClick={openUpgrade}>
                          Unlock
                        </Button>
                      </div>
                    )}

                    {isActive && (
                      <span className="pointer-events-none absolute inset-x-3 bottom-0 h-0.5 overflow-hidden rounded-full bg-primary/10">
                        <span
                          className="block h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-100 ease-linear"
                          style={{ width: `${activeProgress}%` }}
                        />
                      </span>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </div>
        <footer className="flex items-center justify-between gap-3 border-t border-[var(--transcript-border)] px-4 py-2.5">
          <span className="transcript-muted text-[10px]">
            Use ↑ ↓ to move between sentences
          </span>
          <span className="rounded-full border border-[var(--transcript-border)] px-2 py-1 text-[9px] font-semibold transcript-muted">
            {activeIndex >= 0 ? activeIndex + 1 : 0} / {lines.length}
          </span>
        </footer>
      </section>

      <TranscriptSettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  )
}
