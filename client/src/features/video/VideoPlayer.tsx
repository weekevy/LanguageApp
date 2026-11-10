import {
  FastForward,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Rewind,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { LoadingSpinner, Slider } from '../../components/ui'
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
const CONTROLS_HIDE_DELAY = 2800
const PLAYBACK_POLL_INTERVAL = 200

const iconButton =
  'grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/90 transition duration-150 hover:bg-white/15 hover:text-white active:scale-90 disabled:opacity-40 sm:h-10 sm:w-10'

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
    const hideTimerRef = useRef<number | null>(null)
    const lastPointerTypeRef = useRef<string>('mouse')
    const wasHiddenOnPressRef = useRef(false)
    const [isReady, setIsReady] = useState(false)
    const [playerError, setPlayerError] = useState<string | null>(null)
    const [volume, setVolume] = useState(100)
    const [isMuted, setIsMuted] = useState(false)
    const [playbackRate, setPlaybackRate] = useState(1)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [controlsVisible, setControlsVisible] = useState(true)

    // Controls are always visible while paused, and fade out while playing.
    const showControls = !isPlaying || controlsVisible

    const clearHideTimer = useCallback(() => {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current)
        hideTimerRef.current = null
      }
    }, [])

    const scheduleHide = useCallback(() => {
      clearHideTimer()
      hideTimerRef.current = window.setTimeout(
        () => setControlsVisible(false),
        CONTROLS_HIDE_DELAY,
      )
    }, [clearHideTimer])

    const revealControls = useCallback(() => {
      setControlsVisible(true)
      if (isPlaying) scheduleHide()
    }, [isPlaying, scheduleHide])

    useEffect(() => {
      if (isPlaying) {
        scheduleHide()
      } else {
        clearHideTimer()
        setControlsVisible(true)
      }
      return clearHideTimer
    }, [isPlaying, scheduleHide, clearHideTimer])

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

    const cyclePlaybackRate = useCallback(() => {
      const currentIndex = playbackRates.indexOf(playbackRate)
      const nextRate = playbackRates[(currentIndex + 1) % playbackRates.length]!
      playerRef.current?.setPlaybackRate(nextRate)
      setPlaybackRate(nextRate)
    }, [playbackRate])

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
      const playerContainer = containerRef.current
      const playerMount = document.createElement('div')
      playerMount.className = 'h-full w-full'
      setIsReady(false)
      setPlayerError(null)
      setPlaybackRate(1)
      playerContainer.replaceChildren(playerMount)

      void loadYouTubeApi()
        .then((youtube) => {
          if (cancelled) return

          playerRef.current = new youtube.Player(playerMount, {
            videoId: currentVideo.videoId,
            width: '100%',
            height: '100%',
            playerVars: {
              playsinline: 1,
              rel: 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              cc_load_policy: 0,
              iv_load_policy: 3,
              modestbranding: 1,
              showinfo: 0,
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
                  if (document.visibilityState === 'hidden') return
                  const player = playerRef.current
                  if (
                    !player ||
                    player.getPlayerState() !== youtube.PlayerState.PLAYING
                  ) {
                    return
                  }
                  setPlayback(player.getCurrentTime(), player.getDuration())
                }, PLAYBACK_POLL_INTERVAL)
              },
              onStateChange: ({ data }) => {
                const nextIsPlaying = data === youtube.PlayerState.PLAYING
                setIsPlaying(nextIsPlaying)
                const player = playerRef.current
                if (player) {
                  setPlayback(player.getCurrentTime(), player.getDuration())
                }
                if (data === youtube.PlayerState.ENDED) {
                  setPlayback(player?.getDuration() ?? 0)
                }
              },
              onError: () => {
                setPlayerError(
                  'This video cannot play inside the app. It may block embedding or be unavailable.',
                )
              },
            },
          })
        })
        .catch((error: unknown) => {
          setPlayerError(
            error instanceof Error
              ? error.message
              : 'The video player could not be loaded.',
          )
        })

      return () => {
        cancelled = true
        if (timerRef.current !== null) window.clearInterval(timerRef.current)
        timerRef.current = null
        playerRef.current?.destroy()
        playerRef.current = null
        playerContainer.replaceChildren()
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
          revealControls()
          if (player.getPlayerState() === YT.PlayerState.PLAYING)
            player.pauseVideo()
          else player.playVideo()
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault()
          revealControls()
          seekTo(player.getCurrentTime() - 5)
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          revealControls()
          seekTo(player.getCurrentTime() + 5)
        } else if (event.key.toLocaleLowerCase() === 'm') {
          event.preventDefault()
          revealControls()
          toggleMute()
        } else if (event.key.toLocaleLowerCase() === 'f') {
          event.preventDefault()
          void toggleFullscreen()
        }
      }

      window.addEventListener('keydown', handleKeyboard)
      return () => window.removeEventListener('keydown', handleKeyboard)
    }, [isReady, revealControls, seekTo, toggleFullscreen, toggleMute])

    if (!currentVideo) return null

    const safeMax = Math.max(duration, 1)
    const progressPercent = Math.min(100, (currentTime / safeMax) * 100)
    const controlsEnabled = isReady && !playerError

    return (
      <section
        ref={playerShellRef}
        className={cn(
          'video-player-shell rounded-2xl bg-surface p-1.5 sm:p-2',
          isFullscreen &&
            'flex h-screen flex-col rounded-none border-0 bg-black p-0',
        )}
      >
        <div
          className={cn(
            'group/player relative aspect-video overflow-hidden rounded-xl bg-black',
            isFullscreen && 'min-h-0 flex-1 aspect-auto rounded-none',
            isPlaying && !showControls && 'cursor-none',
          )}
          onPointerMove={(event) => {
            if (event.pointerType === 'mouse') revealControls()
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === 'mouse' && isPlaying) scheduleHide()
          }}
        >
          <div
            ref={containerRef}
            className="pointer-events-none absolute inset-0"
          />
          {!isReady && !playerError && (
            <div className="absolute inset-0 z-30 grid place-items-center bg-black">
              <div className="text-center text-white">
                <LoadingSpinner className="mx-auto h-7 w-7 text-secondary" />
                <p className="mt-3 text-xs text-white/60">Loading video…</p>
              </div>
            </div>
          )}
          {playerError && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black px-8 text-center">
              <p className="max-w-md text-sm text-white/80">{playerError}</p>
            </div>
          )}

          {isReady && !isPlaying && currentTime < 0.25 && !playerError && (
            <button
              type="button"
              className="group absolute inset-0 z-20 overflow-hidden bg-black"
              aria-label="Play video"
              onClick={togglePlayback}
            >
              <img
                src={currentVideo.thumbnailUrl}
                alt=""
                className="h-full w-full object-cover transition-transform duration-200 group-active:scale-[1.01]"
              />
            </button>
          )}

          {isReady && currentTime >= 0.25 && !playerError && (
            <button
              type="button"
              className="absolute inset-0 z-15"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              onPointerDown={(event) => {
                lastPointerTypeRef.current = event.pointerType
                wasHiddenOnPressRef.current = !showControls
              }}
              onClick={() => {
                // On touch screens, the first tap only reveals the controls.
                if (
                  lastPointerTypeRef.current !== 'mouse' &&
                  wasHiddenOnPressRef.current
                ) {
                  revealControls()
                  return
                }
                togglePlayback()
                revealControls()
              }}
            />
          )}

          {/* Overlay controls */}
          {controlsEnabled && (
            <div
              className={cn(
                'pointer-events-none absolute inset-x-0 bottom-0 z-40 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-2 pb-2 pt-10 transition-[opacity,transform] duration-300 ease-out sm:px-4 sm:pb-4 sm:pt-20',
                showControls
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-2 opacity-0',
              )}
            >
              <div
                className={cn(
                  'mx-auto max-w-3xl',
                  showControls && 'pointer-events-auto',
                )}
              >
                {/* Progress */}
                <div className="flex items-center gap-1.5 sm:gap-3">
                  <span className="w-8 text-right font-mono text-[9px] tabular-nums text-white/80 sm:w-10 sm:text-[10px]">
                    {formatTimestamp(currentTime)}
                  </span>
                  <div className="relative flex-1">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute left-0 top-1/2 h-1 w-full origin-left rounded-full bg-gradient-to-r from-primary to-secondary"
                      style={{
                        transform: `translateY(-50%) scaleX(${progressPercent / 100})`,
                      }}
                    />
                    <Slider
                      aria-label="Video progress"
                      min={0}
                      max={safeMax}
                      step={0.05}
                      value={Math.min(currentTime, safeMax)}
                      onChange={(event) => {
                        revealControls()
                        seekTo(Number(event.target.value))
                      }}
                    />
                  </div>
                  <span className="w-8 font-mono text-[9px] tabular-nums text-white/80 sm:w-10 sm:text-[10px]">
                    {formatTimestamp(duration)}
                  </span>
                </div>

                {/* Floating glass dock */}
                <div className="mt-1.5 flex items-center justify-between gap-0.5 rounded-full bg-black/55 px-1 py-0.5 shadow-md shadow-black/30 ring-1 ring-white/15 sm:mt-2 sm:gap-1 sm:px-2 sm:py-1">
                  {/* Left: restart + volume */}
                  <div className="group/volume flex min-w-0 flex-1 items-center gap-0.5">
                    <button
                      type="button"
                      className={cn(iconButton, 'hidden sm:grid')}
                      aria-label="Restart video"
                      onClick={() => seekTo(0)}
                    >
                      <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                    <button
                      type="button"
                      className={iconButton}
                      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                      onClick={toggleMute}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      ) : (
                        <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      )}
                    </button>
                    <div className="hidden w-0 overflow-hidden opacity-0 transition-all duration-200 group-focus-within/volume:w-20 group-focus-within/volume:opacity-100 group-hover/volume:w-20 group-hover/volume:opacity-100 sm:block">
                      <Slider
                        aria-label="Video volume"
                        min={0}
                        max={100}
                        value={isMuted ? 0 : volume}
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
                    </div>
                  </div>

                  {/* Center: transport */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      type="button"
                      className={iconButton}
                      aria-label="Go back 10 seconds"
                      onClick={() => seekTo(currentTime - 10)}
                    >
                      <Rewind className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                    <button
                      type="button"
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-md shadow-primary/35 ring-1 ring-white/30 transition duration-150 hover:scale-105 active:scale-90 sm:h-12 sm:w-12 sm:shadow-lg"
                      aria-label={isPlaying ? 'Pause video' : 'Play video'}
                      onClick={togglePlayback}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4 fill-current sm:h-5 sm:w-5" />
                      ) : (
                        <Play className="ml-0.5 h-4 w-4 fill-current sm:h-5 sm:w-5" />
                      )}
                    </button>
                    <button
                      type="button"
                      className={iconButton}
                      aria-label="Go forward 10 seconds"
                      onClick={() => seekTo(currentTime + 10)}
                    >
                      <FastForward className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  </div>

                  {/* Right: speed + fullscreen */}
                  <div className="flex min-w-0 flex-1 items-center justify-end gap-0.5">
                    <button
                      type="button"
                      className="grid h-8 min-w-8 shrink-0 place-items-center rounded-full px-1.5 text-[10px] font-bold tabular-nums text-white/90 transition duration-150 hover:bg-white/15 hover:text-white active:scale-90 sm:h-10 sm:min-w-10 sm:px-2 sm:text-[11px]"
                      aria-label={`Playback speed ${playbackRate} times. Change speed`}
                      onClick={cyclePlaybackRate}
                    >
                      {playbackRate}×
                    </button>
                    <button
                      type="button"
                      className={iconButton}
                      aria-label={
                        isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'
                      }
                      onClick={() => void toggleFullscreen()}
                    >
                      {isFullscreen ? (
                        <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      ) : (
                        <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    )
  },
)
