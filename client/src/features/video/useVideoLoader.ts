import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { ApiClientError, api } from '../../lib/api'
import { parseYouTubeUrl } from '../../lib/youtube'
import { useSubscriptionStore } from '../../store/subscriptionStore'
import { useTranscriptStore } from '../../store/transcriptStore'
import { useVideoStore } from '../../store/videoStore'

export const useVideoLoader = () => {
  const currentVideo = useVideoStore((state) => state.currentVideo)
  const loadingVideoId = useVideoStore((state) => state.loadingVideoId)
  const startLoading = useVideoStore((state) => state.startLoading)
  const finishLoading = useVideoStore((state) => state.finishLoading)
  const setCurrentVideo = useVideoStore((state) => state.setCurrentVideo)
  const setVideoError = useVideoStore((state) => state.setError)
  const startTranscriptLoading = useTranscriptStore((state) => state.startLoading)
  const setTranscript = useTranscriptStore((state) => state.setTranscript)
  const setTranscriptError = useTranscriptStore((state) => state.setError)
  const setLimits = useSubscriptionStore((state) => state.setLimits)
  const openUpgrade = useSubscriptionStore((state) => state.openUpgrade)

  return useCallback(
    async (url: string) => {
      const candidateId = parseYouTubeUrl(url)

      if (!candidateId) {
        const message = 'Enter a valid youtube.com or youtu.be video URL.'
        setVideoError(message)
        toast.error(message)
        return false
      }

      if (candidateId === loadingVideoId) return false

      if (candidateId === currentVideo?.videoId) {
        toast('That video is already loaded.')
        return false
      }

      startLoading(candidateId)
      startTranscriptLoading()

      try {
        const parsedVideo = await api.parseVideo(url)
        setLimits(parsedVideo.limits)
        setCurrentVideo(parsedVideo.metadata)

        try {
          const transcript = await api.transcript(parsedVideo.videoId)
          setTranscript(transcript)
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'The transcript could not be loaded.'
          setTranscriptError(message)
          toast.error(message)
        }

        toast.success('Video learning session ready')
        return true
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'The video could not be loaded.'
        setVideoError(message)
        setTranscriptError(message)

        if (error instanceof ApiClientError && error.code === 'DAILY_LIMIT_REACHED') {
          openUpgrade()
        } else {
          toast.error(message)
        }
        return false
      } finally {
        finishLoading()
      }
    },
    [
      currentVideo?.videoId,
      finishLoading,
      loadingVideoId,
      openUpgrade,
      setCurrentVideo,
      setLimits,
      setTranscript,
      setTranscriptError,
      setVideoError,
      startLoading,
      startTranscriptLoading,
    ],
  )
}
