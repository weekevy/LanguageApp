import { useEffect, useState } from 'react'

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' || typeof window.matchMedia !== 'function'
      ? false
      : window.matchMedia(query).matches,
  )

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return

    const mediaQuery = window.matchMedia(query)
    const updateMatches = () => setMatches(mediaQuery.matches)

    updateMatches()
    mediaQuery.addEventListener('change', updateMatches)
    return () => mediaQuery.removeEventListener('change', updateMatches)
  }, [query])

  return matches
}
