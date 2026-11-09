import { ArrowRight, Link2, PlayCircle } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Button, Input } from '../../components/ui'
import { cn } from '../../lib/cn'
import { parseYouTubeUrl } from '../../lib/youtube'
import { useVideoStore } from '../../store/videoStore'
import { useVideoLoader } from './useVideoLoader'

const exampleUrls = [
  {
    label: 'Everyday English',
    url: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
  },
  { label: 'Short talk', url: 'https://youtu.be/Ks-_Mh1QhMc' },
]

export const VideoUrlForm = ({
  compact = false,
  wide = false,
  navbar = false,
}: {
  compact?: boolean
  wide?: boolean
  navbar?: boolean
}) => {
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const loadVideo = useVideoLoader()
  const isLoading = useVideoStore((state) => state.isLoading)

  const submitUrl = async (candidate: string) => {
    if (!parseYouTubeUrl(candidate)) {
      const message = 'Use a YouTube watch, short, embed, or youtu.be URL.'
      setError(message)
      if (navbar) toast.error(message)
      return
    }

    setError(null)
    const loaded = await loadVideo(candidate)
    if (loaded) setUrl('')
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    void submitUrl(url)
  }

  return (
    <div className={wide || navbar ? 'w-full min-w-0' : 'w-full max-w-3xl'}>
      <form
        onSubmit={handleSubmit}
        className={cn(
          navbar
            ? 'flex min-w-0 items-center gap-1.5 rounded-xl border border-border bg-surface/75 p-1 shadow-sm transition focus-within:border-primary/45 focus-within:ring-2 focus-within:ring-primary/10'
            : compact
              ? 'flex flex-col gap-2 rounded-2xl border border-border-strong bg-surface/92 p-2 shadow-[var(--app-shadow-soft)] transition focus-within:border-primary/45 focus-within:ring-4 focus-within:ring-primary/8 sm:flex-row'
              : 'group flex flex-col gap-2 rounded-2xl border border-border-strong bg-surface/90 p-2 shadow-[0_20px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl transition focus-within:border-primary/45 focus-within:ring-4 focus-within:ring-primary/8 sm:flex-row',
          navbar && error && 'border-danger/60',
        )}
      >
        <Input
          aria-label="YouTube video URL"
          icon={<Link2 className="h-4.5 w-4.5" />}
          value={url}
          onChange={(event) => {
            setUrl(event.target.value)
            if (error) setError(null)
          }}
          placeholder={
            navbar
              ? 'Paste YouTube URL…'
              : compact
                ? 'Paste a YouTube URL to open a new lesson'
                : 'Paste a YouTube link to start learning'
          }
          error={navbar ? undefined : (error ?? undefined)}
          aria-invalid={Boolean(error)}
          className={
            navbar
              ? 'h-9 min-w-0 border-0 bg-transparent pl-9 text-xs focus:ring-0'
              : compact
                ? 'h-12 border-0 bg-transparent focus:ring-0'
                : 'h-13 border-0 bg-transparent focus:ring-0'
          }
          disabled={isLoading}
        />
        <Button
          type="submit"
          size={navbar ? 'sm' : compact ? 'md' : 'lg'}
          isLoading={isLoading}
          className={
            navbar
              ? 'h-9 min-w-21 rounded-lg px-3'
              : compact
                ? 'sm:min-w-36'
                : 'sm:min-w-37'
          }
        >
          {!isLoading && (
            <PlayCircle className={navbar ? 'h-4 w-4' : 'h-4.5 w-4.5'} />
          )}
          {navbar ? 'Load' : compact ? 'Open lesson' : 'Load video'}
        </Button>
      </form>
      {!compact && !navbar && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="mr-1">Or try:</span>
          {exampleUrls.map((example) => (
            <button
              key={example.url}
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-surface/55 px-2.5 py-1 transition hover:border-primary/40 hover:bg-primary/8 hover:text-secondary"
              onClick={() => void submitUrl(example.url)}
              disabled={isLoading}
            >
              {example.label} <ArrowRight className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
