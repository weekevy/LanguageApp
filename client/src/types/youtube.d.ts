declare namespace YT {
  const PlayerState: {
    UNSTARTED: -1
    ENDED: 0
    PLAYING: 1
    PAUSED: 2
    BUFFERING: 3
    CUED: 5
  }

  interface PlayerOptions {
    videoId: string
    width?: string | number
    height?: string | number
    playerVars?: Record<string, string | number>
    events?: {
      onReady?: (event: PlayerEvent) => void
      onStateChange?: (event: OnStateChangeEvent) => void
      onError?: (event: OnErrorEvent) => void
    }
  }

  interface PlayerEvent {
    target: Player
  }

  interface OnStateChangeEvent extends PlayerEvent {
    data: number
  }

  interface OnErrorEvent extends PlayerEvent {
    data: number
  }

  class Player {
    constructor(element: HTMLElement | string, options: PlayerOptions)
    playVideo(): void
    pauseVideo(): void
    seekTo(seconds: number, allowSeekAhead: boolean): void
    getCurrentTime(): number
    getDuration(): number
    getPlayerState(): number
    getVolume(): number
    setVolume(volume: number): void
    isMuted(): boolean
    mute(): void
    unMute(): void
    getPlaybackRate(): number
    setPlaybackRate(rate: number): void
    getAvailablePlaybackRates(): number[]
    destroy(): void
  }
}

interface Window {
  YT?: typeof YT
  onYouTubeIframeAPIReady?: () => void
}
