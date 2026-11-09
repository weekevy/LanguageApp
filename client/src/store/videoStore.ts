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
    set({ currentVideo, currentTime: 0, duration: currentVideo?.duration ?? 0 }),
  setPlayback: (currentTime, duration) =>
    set((state) => ({
      currentTime,
      duration: duration ?? state.duration,
    })),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  startLoading: (loadingVideoId) =>
    set({ isLoading: true, loadingVideoId, error: null }),
  finishLoading: () => set({ isLoading: false, loadingVideoId: null }),
  setError: (error) => set({ error, isLoading: false, loadingVideoId: null }),
}))
