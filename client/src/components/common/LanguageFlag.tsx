import { Globe2 } from 'lucide-react'
import { cn } from '../../lib/cn'

export type LanguageFlagCode =
  'system' | 'gb' | 'fr' | 'sa' | 'es' | 'de' | 'it' | 'pt' | 'jp' | 'cn'

interface LanguageFlagProps {
  code: LanguageFlagCode
  label: string
  className?: string
}

const FlagArtwork = ({
  code,
}: {
  code: Exclude<LanguageFlagCode, 'system'>
}) => {
  switch (code) {
    case 'gb':
      return (
        <svg viewBox="0 0 36 24" className="h-full w-full" aria-hidden="true">
          <rect width="36" height="24" fill="#012169" />
          <path d="M0 0 36 24M36 0 0 24" stroke="#fff" strokeWidth="6" />
          <path d="M0 0 36 24M36 0 0 24" stroke="#c8102e" strokeWidth="2.8" />
          <path d="M18 0v24M0 12h36" stroke="#fff" strokeWidth="8" />
          <path d="M18 0v24M0 12h36" stroke="#c8102e" strokeWidth="4" />
        </svg>
      )
    case 'fr':
      return (
        <svg viewBox="0 0 36 24" className="h-full w-full" aria-hidden="true">
          <path fill="#0055a4" d="M0 0h12v24H0z" />
          <path fill="#fff" d="M12 0h12v24H12z" />
          <path fill="#ef4135" d="M24 0h12v24H24z" />
        </svg>
      )
    case 'sa':
      return (
        <svg viewBox="0 0 36 24" className="h-full w-full" aria-hidden="true">
          <rect width="36" height="24" fill="#006c35" />
          <text
            x="18"
            y="11"
            fill="#fff"
            fontSize="4.2"
            fontWeight="700"
            textAnchor="middle"
            direction="rtl"
          >
            لا إله إلا الله
          </text>
          <path d="M10 16.5h16l-1.8 1.4H11.5z" fill="#fff" />
          <path d="M25.5 15.7h2.3v.9h-2.3z" fill="#fff" />
        </svg>
      )
    case 'es':
      return (
        <svg viewBox="0 0 36 24" className="h-full w-full" aria-hidden="true">
          <path fill="#aa151b" d="M0 0h36v6H0zM0 18h36v6H0z" />
          <path fill="#f1bf00" d="M0 6h36v12H0z" />
          <circle cx="12" cy="12" r="2.2" fill="#aa151b" />
          <path d="M11.2 9.2h1.6v5.6h-1.6z" fill="#fff" opacity=".9" />
        </svg>
      )
    case 'de':
      return (
        <svg viewBox="0 0 36 24" className="h-full w-full" aria-hidden="true">
          <path fill="#151515" d="M0 0h36v8H0z" />
          <path fill="#dd0000" d="M0 8h36v8H0z" />
          <path fill="#ffce00" d="M0 16h36v8H0z" />
        </svg>
      )
    case 'it':
      return (
        <svg viewBox="0 0 36 24" className="h-full w-full" aria-hidden="true">
          <path fill="#009246" d="M0 0h12v24H0z" />
          <path fill="#fff" d="M12 0h12v24H12z" />
          <path fill="#ce2b37" d="M24 0h12v24H24z" />
        </svg>
      )
    case 'pt':
      return (
        <svg viewBox="0 0 36 24" className="h-full w-full" aria-hidden="true">
          <path fill="#046a38" d="M0 0h14v24H0z" />
          <path fill="#da291c" d="M14 0h22v24H14z" />
          <circle cx="14" cy="12" r="4" fill="#ffcd00" />
          <circle cx="14" cy="12" r="2.6" fill="#fff" />
          <path d="m14 9.6 1.8 1.2-.7 2.4h-2.2l-.7-2.4z" fill="#da291c" />
        </svg>
      )
    case 'jp':
      return (
        <svg viewBox="0 0 36 24" className="h-full w-full" aria-hidden="true">
          <rect width="36" height="24" fill="#fff" />
          <circle cx="18" cy="12" r="6" fill="#bc002d" />
        </svg>
      )
    case 'cn':
      return (
        <svg viewBox="0 0 36 24" className="h-full w-full" aria-hidden="true">
          <rect width="36" height="24" fill="#de2910" />
          <path
            d="m7 3.2 1.1 2.3 2.5.3-1.8 1.8.5 2.5L7 8.9l-2.3 1.2.5-2.5-1.8-1.8 2.5-.3z"
            fill="#ffde00"
          />
          <circle cx="13" cy="4" r="1" fill="#ffde00" />
          <circle cx="15.5" cy="7" r="1" fill="#ffde00" />
          <circle cx="15" cy="11" r="1" fill="#ffde00" />
          <circle cx="12.5" cy="13.5" r="1" fill="#ffde00" />
        </svg>
      )
  }
}

export const LanguageFlag = ({ code, label, className }: LanguageFlagProps) => (
  <span
    role="img"
    aria-label={`${label} flag`}
    className={cn(
      'inline-flex aspect-[3/2] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm ring-1 ring-white/10',
      className,
    )}
  >
    {code === 'system' ? (
      <span className="grid h-full w-full place-items-center bg-elevated text-secondary">
        <Globe2 className="h-[46%] w-[46%]" />
      </span>
    ) : (
      <FlagArtwork code={code} />
    )}
  </span>
)
