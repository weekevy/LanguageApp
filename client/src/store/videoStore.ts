import type { VideoMetadata } from '@linguatube/shared'
import { create } from 'zustand'

interface VideoState {
  currentVideo: VideoMetadata | null
  currentTime: number
  duration: number
  isPlaying: boolean
  isLoading: boolean
  loadingVideoId: string | null
  error: string | null
  setCurrentVideo: (video: VideoMetadata | null) => void
  setPlayback: (currentTime: number, duration?: number) => void
  setIsPlaying: (isPlaying: boolean) => void
  startLoading: (videoId: string) => void
  finishLoading: () => void
  setError: (error: string | null) => void
}

export const useVideoStore = create<VideoState>((set) => ({
  currentVideo: null,
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  isLoading: false,
  loadingVideoId: null,
  error: null,
  setCurrentVideo: (currentVideo) =>
    set({
      currentVideo,
      currentTime: 0,
      duration: currentVideo?.duration ?? 0,
    }),
  setPlayback: (currentTime, duration) =>
    set((state) => {
      const nextDuration = duration ?? state.duration
      if (
        Math.abs(currentTime - state.currentTime) < 0.025 &&
        Math.abs(nextDuration - state.duration) < 0.025
      ) {
        return state
      }

      return { currentTime, duration: nextDuration }
    }),
  setIsPlaying: (isPlaying) =>
    set((state) => (state.isPlaying === isPlaying ? state : { isPlaying })),
  startLoading: (loadingVideoId) =>
    set({ isLoading: true, loadingVideoId, error: null }),
  finishLoading: () => set({ isLoading: false, loadingVideoId: null }),
  setError: (error) => set({ error, isLoading: false, loadingVideoId: null }),
}))
