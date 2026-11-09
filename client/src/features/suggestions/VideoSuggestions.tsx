import { ArrowUpRight, Clock3, Play, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { VideoMetadata } from '@linguatube/shared'
import { Badge, Button, Card, Skeleton } from '../../components/ui'
import { api } from '../../lib/api'
import { formatTimestamp } from '../../lib/format'
import { toYouTubeUrl } from '../../lib/youtube'
import { useVideoStore } from '../../store/videoStore'
import { useVideoLoader } from '../video/useVideoLoader'

const SuggestionCard = ({ video }: { video: VideoMetadata }) => {
  const [imageFailed, setImageFailed] = useState(false)
  const loadVideo = useVideoLoader()
  const loadingVideoId = useVideoStore((state) => state.loadingVideoId)

  return (
    <Card className="group overflow-hidden shadow-none transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-panel">
      <div className="relative aspect-video overflow-hidden bg-elevated">
        {!imageFailed ? (
          <img
            src={video.thumbnailUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-primary/20 to-accent/10">
            <Sparkles className="h-8 w-8 text-secondary" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/75 px-1.5 py-1 font-mono text-[10px] text-white">
          <Clock3 className="h-2.5 w-2.5" /> {formatTimestamp(video.duration)}
        </span>
        <button
          type="button"
          aria-label={`Load ${video.title}`}
          className="absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100"
          onClick={() => void loadVideo(toYouTubeUrl(video.videoId))}
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-primary shadow-xl">
            <Play className="h-4.5 w-4.5 fill-current" />
          </span>
        </button>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="outline">{video.language.toUpperCase()}</Badge>
          <Badge
            variant={video.difficulty === 'Beginner' ? 'success' : 'default'}
          >
            {video.difficulty}
          </Badge>
        </div>
        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-foreground">
          {video.title}
        </h3>
        <p className="mt-2 text-xs text-muted">{video.channel}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-3 w-full justify-between"
          isLoading={loadingVideoId === video.videoId}
          onClick={() => void loadVideo(toYouTubeUrl(video.videoId))}
        >
          Start learning <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  )
}

export const VideoSuggestions = () => {
  const [videos, setVideos] = useState<VideoMetadata[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void api
      .suggestions()
      .then(({ videos: suggestions }) => {
        if (!cancelled) setVideos(suggestions)
      })
      .catch((caughtError: unknown) => {
        if (!cancelled) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : 'Suggestions are unavailable.',
          )
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section aria-labelledby="suggestions-heading">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
            Curated for practice
          </p>
          <h2 id="suggestions-heading" className="mt-2 text-xl font-bold text-foreground">
            Keep exploring
          </h2>
        </div>
        <span className="hidden text-xs text-muted sm:block">Fresh demo sessions</span>
      </div>

      {error && (
        <p className="rounded-xl border border-danger/20 bg-danger/8 p-4 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }, (_, index) => (
              <Card key={index} className="overflow-hidden p-0 shadow-none">
                <Skeleton className="aspect-video rounded-none" />
                <div className="space-y-3 p-4">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </Card>
            ))
          : videos.map((video) => <SuggestionCard key={video.videoId} video={video} />)}
      </div>
    </section>
  )
}
