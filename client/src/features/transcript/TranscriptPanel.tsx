import type { TranscriptLine } from '@linguatube/shared'
import { Captions, Languages, RefreshCw, Settings2 } from 'lucide-react'
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
import { Button, EmptyState, Skeleton } from '../../components/ui'
import { api } from '../../lib/api'
import { cn } from '../../lib/cn'
import { canViewTranslation, findActiveLineIndex } from '../../lib/transcript'
import { useAuthStore } from '../../store/authStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useSubscriptionStore } from '../../store/subscriptionStore'
import { useTranscriptStore } from '../../store/transcriptStore'
import { useVideoStore } from '../../store/videoStore'
import { getSavedWordId, useVocabularyStore } from '../../store/vocabularyStore'
import {
  ActiveTranscriptLineItem,
  TranscriptLineItem,
  type SelectedTranscriptWord,
} from './TranscriptLineItem'
import { TranscriptSettingsDrawer } from './TranscriptSettingsDrawer'

interface TranscriptPanelProps {
  onSeek: (seconds: number) => void
  height?: number | undefined
}

export const TranscriptPanel = ({ onSeek, height }: TranscriptPanelProps) => {
  const lines = useTranscriptStore((state) => state.lines)
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
  const isPlaying = useVideoStore((state) => state.isPlaying)
  const currentVideo = useVideoStore((state) => state.currentVideo)
  const settings = useSettingsStore((state) => state.settings)
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const plan = useAuthStore((state) => state.user?.plan ?? 'free')
  const openUpgrade = useSubscriptionStore((state) => state.openUpgrade)
  const savedWords = useVocabularyStore((state) => state.words)
  const saveWord = useVocabularyStore((state) => state.saveWord)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [selectedWord, setSelectedWord] =
    useState<SelectedTranscriptWord | null>(null)
  const [hiddenTranslations, setHiddenTranslations] = useState<Set<string>>(
    new Set(),
  )
  const [isBulkTranslating, setIsBulkTranslating] = useState(false)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const previousTargetLanguage = useRef(settings.targetLanguage)

  const activeIndex = useVideoStore((state) =>
    findActiveLineIndex(lines, state.currentTime),
  )
  const activeLineId = activeIndex >= 0 ? lines[activeIndex]?.id : undefined
  const savedWordIds = useMemo(
    () => new Set(savedWords.map((word) => word.id)),
    [savedWords],
  )
  const hasTranslations = useMemo(
    () => lines.some((line) => line.translatedText),
    [lines],
  )

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
    if (!activeLineId) return
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
  }, [activeLineId, settings.keepActiveCentered])

  const handleLineKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>, index: number, start: number) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onSeek(start)
        return
      }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
      event.preventDefault()
      const nextIndex = event.key === 'ArrowDown' ? index + 1 : index - 1
      scrollerRef.current
        ?.querySelectorAll<HTMLElement>('[data-transcript-line]')
        .item(nextIndex)
        ?.focus()
    },
    [onSeek],
  )

  const handleSelectWord = useCallback(
    (lineId: string, wordId: string, text: string) => {
      setSelectedWord({ lineId, wordId, text })
    },
    [],
  )

  const handleToggleTranslation = useCallback((lineId: string) => {
    setHiddenTranslations((current) => {
      const next = new Set(current)
      if (next.has(lineId)) next.delete(lineId)
      else next.add(lineId)
      return next
    })
  }, [])

  const handleTranslateLine = useCallback(
    (lineId: string) => void translateLine(lineId),
    [translateLine],
  )

  const handleSaveWord = useCallback(
    (line: TranscriptLine, word: SelectedTranscriptWord) => {
      saveWord({
        text: word.text,
        language: line.language,
        videoId: currentVideo?.videoId ?? 'unknown',
        lineId: line.id,
        context: line.text,
      })
      toast.success(`Saved “${word.text}”`)
    },
    [currentVideo?.videoId, saveWord],
  )

  const handleTranslationVisibility = useCallback(() => {
    if (settings.showTranslations && !hasTranslations) {
      void translateAvailableLines()
      return
    }

    const nextVisible = !settings.showTranslations
    updateSetting('showTranslations', nextVisible)
    if (nextVisible && !hasTranslations) void translateAvailableLines()
  }, [
    hasTranslations,
    settings.showTranslations,
    translateAvailableLines,
    updateSetting,
  ])

  const transcriptStyle = {
    '--transcript-surface': `color-mix(in srgb, var(--app-surface) ${settings.backgroundOpacity}%, transparent)`,
    ...(height ? { '--video-card-height': `${height}px` } : {}),
  } as CSSProperties

  return (
    <>
      <section
        className={cn(
          'transcript-surface match-video-height flex h-[620px] max-h-[calc(100vh-7rem)] min-h-120 flex-col overflow-hidden rounded-2xl shadow-[var(--app-shadow)]',
          settings.showBorder ? 'border' : 'border border-transparent',
        )}
        style={transcriptStyle}
      >
        <header
          className="flex items-center justify-between gap-2 border-b border-[var(--transcript-border)] px-2.5 py-2 sm:px-3"
          aria-label="Transcript controls"
        >
          <div className="flex min-w-0 items-center gap-1.5 rounded-full bg-elevated/65 px-2.5 py-1.5 text-[10px] font-semibold transcript-muted">
            <span
              className={cn(
                'h-1.5 w-1.5 shrink-0 rounded-full',
                isPlaying ? 'bg-success' : 'bg-muted/60',
              )}
            />
            <span className="tabular-nums text-[var(--transcript-text)]">
              {activeIndex >= 0 ? activeIndex + 1 : 0}
            </span>
            <span aria-hidden="true">/</span>
            <span className="tabular-nums">{lines.length}</span>
          </div>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                'h-8 w-8 rounded-full',
                settings.showOriginal && 'bg-primary/12 text-secondary',
              )}
              aria-label={
                settings.showOriginal ? 'Hide captions' : 'Show captions'
              }
              title={settings.showOriginal ? 'Hide captions' : 'Show captions'}
              aria-pressed={settings.showOriginal}
              onClick={() =>
                updateSetting('showOriginal', !settings.showOriginal)
              }
            >
              <Captions className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                'h-8 w-8 rounded-full',
                settings.showTranslations && 'bg-primary/12 text-secondary',
              )}
              disabled={lines.length === 0 || isBulkTranslating}
              aria-label={
                isBulkTranslating
                  ? 'Translating transcript'
                  : settings.showTranslations && !hasTranslations
                    ? 'Generate translations'
                    : settings.showTranslations
                      ? 'Hide translations'
                      : 'Show translations'
              }
              title={
                settings.showTranslations && !hasTranslations
                  ? 'Generate translations'
                  : settings.showTranslations
                    ? 'Hide translations'
                    : 'Show translations'
              }
              aria-pressed={settings.showTranslations}
              onClick={handleTranslationVisibility}
            >
              {isBulkTranslating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Languages className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              aria-label="Open transcript settings"
              title="Transcript settings"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div
          ref={scrollerRef}
          className="app-scrollbar flex-1 overscroll-y-auto overflow-y-auto p-2.5 sm:p-4"
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
                const selectedLineWord =
                  selectedWord?.lineId === line.id ? selectedWord : null
                const selectedWordSaved = selectedLineWord
                  ? savedWordIds.has(
                      getSavedWordId(selectedLineWord.text, line.language),
                    )
                  : false

                const lineItemProps = {
                  line,
                  index,
                  isPlaying,
                  isUnlocked: canViewTranslation(index, plan),
                  isHidden: hiddenTranslations.has(line.id),
                  isTranslating: translatingLineIds.has(line.id),
                  selectedWord: selectedLineWord,
                  selectedWordSaved,
                  settings,
                  isFreePlan: plan === 'free',
                  onSeek,
                  onLineKeyDown: handleLineKeyDown,
                  onSelectWord: handleSelectWord,
                  onToggleTranslation: handleToggleTranslation,
                  onTranslateLine: handleTranslateLine,
                  onSaveWord: handleSaveWord,
                  onUpgrade: openUpgrade,
                }

                return index === activeIndex ? (
                  <ActiveTranscriptLineItem key={line.id} {...lineItemProps} />
                ) : (
                  <TranscriptLineItem
                    key={line.id}
                    {...lineItemProps}
                    isActive={false}
                    currentTime={null}
                  />
                )
              })}
            </div>
          )}
        </div>
      </section>

      <TranscriptSettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  )
}
