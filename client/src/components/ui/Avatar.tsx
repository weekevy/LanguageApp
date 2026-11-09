import { cn } from '../../lib/cn'

interface AvatarProps {
  name: string
  src?: string
  className?: string
}

export const Avatar = ({ name, src, className }: AvatarProps) => {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return (
    <span
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white',
        className,
      )}
      aria-label={name}
    >
      {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : initials}
    </span>
  )
}
