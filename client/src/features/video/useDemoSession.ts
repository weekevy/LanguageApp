import { useCallback } from 'react'
import { api } from '../../lib/api'
import { useTranscriptStore } from '../../store/transcriptStore'
import { useVideoStore } from '../../store/videoStore'

export const DEFAULT_DEMO_VIDEO_ID = 'jNQXAC9IVRw'

export const useDemoSession = () => {
  const startLoading = useVideoStore((state) => state.startLoading)
  const finishLoading = useVideoStore((state) => state.finishLoading)
  const setCurrentVideo = useVideoStore((state) => state.setCurrentVideo)
  const setVideoError = useVideoStore((state) => state.setError)
  const startTranscriptLoading = useTranscriptStore(
    (state) => state.startLoading,
  )
  const setTranscript = useTranscriptStore((state) => state.setTranscript)
  const setTranscriptError = useTranscriptStore((state) => state.setError)

  return useCallback(async () => {
    startLoading(DEFAULT_DEMO_VIDEO_ID)
    startTranscriptLoading()

    try {
      const session = await api.demoSession()
      setCurrentVideo(session.metadata)
      setTranscript(session.transcript)
      return true
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'The interactive demo could not be loaded.'
      setVideoError(message)
      setTranscriptError(message)
      return false
    } finally {
      finishLoading()
    }
  }, [
    finishLoading,
    setCurrentVideo,
    setTranscript,
    setTranscriptError,
    setVideoError,
    startLoading,
    startTranscriptLoading,
  ])
}
