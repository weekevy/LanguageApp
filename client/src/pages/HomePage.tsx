import { RefreshCw, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { HowItWorks } from '../components/home/HowItWorks'
import { LanguageStrip } from '../components/home/LanguageStrip'
import { Button, Card, Skeleton } from '../components/ui'
import { VideoSuggestions } from '../features/suggestions/VideoSuggestions'
import { PaywallBanner } from '../features/subscription/PaywallBanner'
import { TranscriptPanel } from '../features/transcript/TranscriptPanel'
import {
  VideoPlayer,
  type VideoPlayerHandle,
} from '../features/video/VideoPlayer'
import {
  DEFAULT_DEMO_VIDEO_ID,
  useDemoSession,
} from '../features/video/useDemoSession'
import { useVideoStore } from '../store/videoStore'

const LessonLoadingState = () => (
  <div className="mt-3 grid items-start gap-3 sm:mt-5 xl:grid-cols-[minmax(440px,0.9fr)_minmax(0,1.1fr)]">
    <Card className="order-2 h-88 p-3 sm:h-125 sm:p-4 xl:order-1 xl:h-150">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <Skeleton className="h-9 w-9 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-2 h-3 w-24" />
        </div>
      </div>
      <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-14 w-full rounded-xl sm:h-20" />
        ))}
      </div>
    </Card>
    <Card className="order-1 overflow-hidden xl:order-2">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="hidden items-center gap-3 p-5 sm:flex">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-2 flex-1 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>
    </Card>
  </div>
)

export default function HomePage() {
  const currentVideo = useVideoStore((state) => state.currentVideo)
  const isLoading = useVideoStore((state) => state.isLoading)
  const error = useVideoStore((state) => state.error)
  const loadDemoSession = useDemoSession()
  const playerRef = useRef<VideoPlayerHandle>(null)
  const videoCardRef = useRef<HTMLDivElement>(null)
  const requestedDemo = useRef(false)
  const [videoCardHeight, setVideoCardHeight] = useState<number>()

  useEffect(() => {
    if (currentVideo || requestedDemo.current) return
    requestedDemo.current = true
    void loadDemoSession()
  }, [currentVideo, loadDemoSession])

  useEffect(() => {
    const element = videoCardRef.current
    if (!element || typeof ResizeObserver === 'undefined') return

    const updateHeight = () => {
      const height = Math.round(element.getBoundingClientRect().height)
      if (height > 0) setVideoCardHeight(height)
    }
    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(element)
    return () => observer.disconnect()
  }, [currentVideo])

  const isOpeningDemo = !currentVideo && isLoading
  const isCuratedDemo = currentVideo?.videoId === DEFAULT_DEMO_VIDEO_ID

  return (
    <div className="w-full px-2 pb-5 pt-1.5 sm:px-3 sm:py-5 lg:px-3 lg:py-6 xl:px-4">
      {isOpeningDemo && <LessonLoadingState />}

      {!currentVideo && !isLoading && error && (
        <Card className="mx-auto mt-5 max-w-2xl p-6 text-center">
          <RefreshCw className="mx-auto h-7 w-7 text-secondary" />
          <h2 className="mt-3 text-sm font-semibold text-foreground">
            The demo lesson could not open
          </h2>
          <p className="mt-2 text-xs leading-5 text-muted">{error}</p>
          <Button
            type="button"
            variant="secondary"
            className="mt-4"
            onClick={() => void loadDemoSession()}
          >
            <RefreshCw className="h-4 w-4" /> Try again
          </Button>
        </Card>
      )}

      {currentVideo && (
        <section
          className="grid items-start gap-3 xl:grid-cols-[minmax(440px,0.9fr)_minmax(0,1.1fr)]"
          aria-label="Interactive video lesson"
        >
          <div className="order-2 min-h-0 xl:order-1">
            <TranscriptPanel
              height={videoCardHeight}
              onSeek={(seconds) => playerRef.current?.seekTo(seconds)}
            />
          </div>
          <div ref={videoCardRef} className="order-1 xl:order-2">
            <VideoPlayer ref={playerRef} />
          </div>
        </section>
      )}

      {currentVideo && (
        <div className="mt-3 sm:mt-5">
          <PaywallBanner />
        </div>
      )}

      {isCuratedDemo && <HowItWorks />}
      {isCuratedDemo && <LanguageStrip />}

      <div className="mt-9 sm:mt-16">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted">
          <Sparkles className="h-3.5 w-3.5 text-secondary" /> Choose another
          lesson whenever you are ready.
        </div>
        <VideoSuggestions />
      </div>
    </div>
  )
}
