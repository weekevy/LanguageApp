import { languageNames } from '@linguatube/shared'
import {
  ExternalLink,
  FastForward,
  Gauge,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Rewind,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Youtube,
} from 'lucide-react'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Badge, Button, LoadingSpinner, Slider } from '../../components/ui'
import { cn } from '../../lib/cn'
import { formatTimestamp } from '../../lib/format'
import { useVideoStore } from '../../store/videoStore'
import { loadYouTubeApi } from './youtubeApi'

export interface VideoPlayerHandle {
  seekTo: (seconds: number) => void
  play: () => void
  pause: () => void
}

const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2]

export const VideoPlayer = forwardRef<VideoPlayerHandle>(
  function VideoPlayer(_props, ref) {
    const currentVideo = useVideoStore((state) => state.currentVideo)
    const currentTime = useVideoStore((state) => state.currentTime)
    const duration = useVideoStore((state) => state.duration)
    const isPlaying = useVideoStore((state) => state.isPlaying)
    const setPlayback = useVideoStore((state) => state.setPlayback)
    const setIsPlaying = useVideoStore((state) => state.setIsPlaying)
    const playerShellRef = useRef<HTMLElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const playerRef = useRef<YT.Player | null>(null)
    const timerRef = useRef<number | null>(null)
    const [isReady, setIsReady] = useState(false)
    const [playerError, setPlayerError] = useState<string | null>(null)
    const [volume, setVolume] = useState(100)
    const [isMuted, setIsMuted] = useState(false)
    const [playbackRate, setPlaybackRate] = useState(1)
    const [isFullscreen, setIsFullscreen] = useState(false)

    const seekTo = useCallback(
      (seconds: number) => {
        const safeDuration = duration || currentVideo?.duration || 0
        const nextTime = Math.max(0, Math.min(seconds, safeDuration))
        playerRef.current?.seekTo(nextTime, true)
        setPlayback(nextTime)
      },
      [currentVideo?.duration, duration, setPlayback],
    )

    const togglePlayback = useCallback(() => {
      const player = playerRef.current
      if (!player) return
      if (player.getPlayerState() === YT.PlayerState.PLAYING)
        player.pauseVideo()
      else player.playVideo()
    }, [])

    const toggleMute = useCallback(() => {
      const player = playerRef.current
      if (!player) return
      if (player.isMuted()) {
        player.unMute()
        setIsMuted(false)
      } else {
        player.mute()
        setIsMuted(true)
      }
    }, [])

    const toggleFullscreen = useCallback(async () => {
      if (!playerShellRef.current) return
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await playerShellRef.current.requestFullscreen()
      }
    }, [])

    useImperativeHandle(
      ref,
      () => ({
        seekTo,
        play() {
          playerRef.current?.playVideo()
        },
        pause() {
          playerRef.current?.pauseVideo()
        },
      }),
      [seekTo],
    )

    useEffect(() => {
      if (!currentVideo || !containerRef.current) return
      let cancelled = false
      setIsReady(false)
      setPlayerError(null)
      setPlaybackRate(1)
      containerRef.current.replaceChildren()

      void loadYouTubeApi()
        .then((youtube) => {
          if (cancelled || !containerRef.current) return

          playerRef.current = new youtube.Player(containerRef.current, {
            videoId: currentVideo.videoId,
            width: '100%',
            height: '100%',
            playerVars: {
              playsinline: 1,
              rel: 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              origin: window.location.origin,
            },
            events: {
              onReady: ({ target }) => {
                if (cancelled) return
                setIsReady(true)
                setVolume(target.getVolume())
                setIsMuted(target.isMuted())
                setPlayback(0, target.getDuration() || currentVideo.duration)
                timerRef.current = window.setInterval(() => {
                  const player = playerRef.current
                  if (!player) return
                  setPlayback(player.getCurrentTime(), player.getDuration())
                }, 100)
              },
              onStateChange: ({ data }) => {
                setIsPlaying(data === youtube.PlayerState.PLAYING)
                if (data === youtube.PlayerState.ENDED) {
                  setPlayback(playerRef.current?.getDuration() ?? 0)
                }
              },
              onError: () => {
                setPlayerError(
                  'YouTube could not play this video here. It may block embedding or be unavailable.',
                )
              },
            },
          })
        })
        .catch((error: unknown) => {
          setPlayerError(
            error instanceof Error
              ? error.message
              : 'The YouTube player could not be loaded.',
          )
        })

      return () => {
        cancelled = true
        if (timerRef.current !== null) window.clearInterval(timerRef.current)
        timerRef.current = null
        playerRef.current?.destroy()
        playerRef.current = null
        setIsReady(false)
      }
    }, [currentVideo, setIsPlaying, setPlayback])

    useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(document.fullscreenElement === playerShellRef.current)
      }
      document.addEventListener('fullscreenchange', handleFullscreenChange)
      return () =>
        document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }, [])

    useEffect(() => {
      if (!isReady) return

      const handleKeyboard = (event: KeyboardEvent) => {
        const target = event.target as HTMLElement | null
        if (
          target?.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(
            target?.tagName ?? '',
          )
        ) {
          return
        }

        const player = playerRef.current
        if (!player) return

        if (event.code === 'Space') {
          event.preventDefault()
          if (player.getPlayerState() === YT.PlayerState.PLAYING)
            player.pauseVideo()
          else player.playVideo()
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault()
          seekTo(player.getCurrentTime() - 5)
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          seekTo(player.getCurrentTime() + 5)
        } else if (event.key.toLocaleLowerCase() === 'm') {
          event.preventDefault()
          toggleMute()
        } else if (event.key.toLocaleLowerCase() === 'f') {
          event.preventDefault()
          void toggleFullscreen()
        }
      }

      window.addEventListener('keydown', handleKeyboard)
      return () => window.removeEventListener('keydown', handleKeyboard)
    }, [isReady, seekTo, toggleFullscreen, toggleMute])

    if (!currentVideo) return null

    return (
      <section
        ref={playerShellRef}
        className={cn(
          'overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--app-shadow)]',
          isFullscreen &&
            'flex h-screen flex-col rounded-none border-0 bg-black',
        )}
      >
        <div
          className={cn(
            'flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface/90 px-4 py-3.5 sm:px-5',
            isFullscreen && 'border-white/10 bg-black',
          )}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-danger/10 text-danger">
                <Youtube className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <h2
                  className={cn(
                    'truncate text-sm font-semibold text-foreground',
                    isFullscreen && 'text-white',
                  )}
                >
                  {currentVideo.title}
                </h2>
                <p
                  className={cn(
                    'mt-0.5 truncate text-[11px] text-muted',
                    isFullscreen && 'text-white/55',
                  )}
                >
                  {currentVideo.channel}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="primary">
              {languageNames[currentVideo.language]}
            </Badge>
            <Badge variant="outline">{currentVideo.difficulty}</Badge>
            <a
              href={`https://www.youtube.com/watch?v=${currentVideo.videoId}`}
              target="_blank"
              rel="noreferrer"
              className="grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              aria-label="Open video on YouTube"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div
          className={cn(
            'relative aspect-video bg-black shadow-inner',
            isFullscreen && 'min-h-0 flex-1 aspect-auto',
          )}
        >
          <div ref={containerRef} className="absolute inset-0" />
          {!isReady && !playerError && (
            <div className="absolute inset-0 grid place-items-center bg-black">
              <div className="text-center text-white">
                <LoadingSpinner className="mx-auto h-7 w-7 text-secondary" />
                <p className="mt-3 text-xs text-white/60">
                  Connecting to YouTube…
                </p>
              </div>
            </div>
          )}
          {playerError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black px-8 text-center">
              <Youtube className="h-9 w-9 text-danger" />
              <p className="mt-3 max-w-md text-sm text-white/80">
                {playerError}
              </p>
              <a
                href={`https://www.youtube.com/watch?v=${currentVideo.videoId}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 text-xs font-semibold text-secondary hover:underline"
              >
                Watch on YouTube instead
              </a>
            </div>
          )}
        </div>

        <div
          className={cn(
            'border-t border-border bg-elevated/40 px-3 py-3 sm:px-5',
            isFullscreen && 'border-white/10 bg-black text-white',
          )}
        >
          <div className="flex items-center gap-3">
            <span className="w-10 text-right font-mono text-[10px] text-muted">
              {formatTimestamp(currentTime)}
            </span>
            <Slider
              aria-label="Video progress"
              min={0}
              max={Math.max(duration, 1)}
              step={0.05}
              value={Math.min(currentTime, Math.max(duration, 1))}
              disabled={!isReady}
              onChange={(event) => seekTo(Number(event.target.value))}
            />
            <span className="w-10 font-mono text-[10px] text-muted">
              {formatTimestamp(duration)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                aria-label="Restart video"
                disabled={!isReady}
                onClick={() => seekTo(0)}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                aria-label="Go back 10 seconds"
                disabled={!isReady}
                onClick={() => seekTo(currentTime - 10)}
              >
                <Rewind className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                className="h-10 w-10 rounded-full"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                disabled={!isReady}
                onClick={togglePlayback}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="ml-0.5 h-4 w-4 fill-current" />
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                aria-label="Go forward 10 seconds"
                disabled={!isReady}
                onClick={() => seekTo(currentTime + 10)}
              >
                <FastForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                disabled={!isReady}
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Slider
                aria-label="Video volume"
                min={0}
                max={100}
                value={isMuted ? 0 : volume}
                disabled={!isReady}
                className="hidden w-18 sm:block lg:w-24"
                onChange={(event) => {
                  const nextVolume = Number(event.target.value)
                  playerRef.current?.setVolume(nextVolume)
                  if (nextVolume > 0 && playerRef.current?.isMuted()) {
                    playerRef.current.unMute()
                    setIsMuted(false)
                  }
                  setVolume(nextVolume)
                }}
              />
              <label className="relative inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-surface px-2 text-[11px] font-semibold text-foreground">
                <Gauge className="h-3.5 w-3.5 text-secondary" />
                <select
                  aria-label="Playback speed"
                  value={playbackRate}
                  disabled={!isReady}
                  className="appearance-none bg-transparent pr-1 outline-none"
                  onChange={(event) => {
                    const rate = Number(event.target.value)
                    playerRef.current?.setPlaybackRate(rate)
                    setPlaybackRate(rate)
                  }}
                >
                  {playbackRates.map((rate) => (
                    <option
                      key={rate}
                      value={rate}
                      className="bg-elevated text-foreground"
                    >
                      {rate}x
                    </option>
                  ))}
                </select>
              </label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                aria-label={
                  isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'
                }
                disabled={!isReady}
                onClick={() => void toggleFullscreen()}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {!isFullscreen && (
          <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-2.5 text-[10px] text-muted sm:px-5">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-secondary" /> Transcript follows
              playback every 100ms
            </span>
            <span className="hidden sm:inline">
              Speed · volume · keyboard · fullscreen
            </span>
          </div>
        )}
      </section>
    )
  },
)
