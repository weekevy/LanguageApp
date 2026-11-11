import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { mobileNavigationItems } from './navigation'

export const MobileNavigation = () => {
  const location = useLocation()
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const activeIndex = Math.max(
    0,
    mobileNavigationItems.findIndex(({ path }) =>
      path === '/' ? location.pathname === '/' : location.pathname === path,
    ),
  )

  useEffect(() => {
    lastScrollY.current = window.scrollY

    const handleScroll = (event: Event) => {
      const target = event.target
      const currentScrollY = Math.max(
        0,
        target instanceof HTMLElement ? target.scrollTop : window.scrollY,
      )
      const difference = currentScrollY - lastScrollY.current

      if (currentScrollY < 48) {
        setHidden(false)
      } else if (Math.abs(difference) >= 6) {
        setHidden(difference > 0)
        lastScrollY.current = currentScrollY
      }
    }

    document.addEventListener('scroll', handleScroll, {
      capture: true,
      passive: true,
    })
    return () => document.removeEventListener('scroll', handleScroll, true)
  }, [])

  return (
    <nav
      aria-label="Mobile navigation"
      className={cn(
        'mobile-navigation fixed inset-x-5 bottom-3 z-40 grid h-16 grid-cols-5 rounded-full border border-border-strong bg-surface p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.2)] lg:hidden',
        hidden && 'mobile-navigation--hidden',
      )}
    >
      <span
        aria-hidden="true"
        className="mobile-nav-glider"
        style={{ '--mobile-nav-index': activeIndex } as CSSProperties}
      />
      {mobileNavigationItems.map(({ label, path, icon: Icon }, index) => (
        <NavLink
          key={`${path}-${label}-${index}`}
          to={path}
          state={{
            pageDirection: index < activeIndex ? 'backward' : 'forward',
          }}
          end={path === '/' && label === 'Home'}
          aria-label={label}
          onClick={() => setHidden(false)}
          className="relative flex min-w-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          {({ isActive }) => (
            <span
              className={cn(
                'mobile-nav-item relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-muted',
                isActive && 'is-active text-secondary',
              )}
            >
              <span
                aria-hidden={!isActive}
                className={cn(
                  'mobile-nav-label absolute bottom-[calc(100%+0.6rem)] left-1/2 whitespace-nowrap rounded-full border border-primary/25 bg-elevated px-2.5 py-1 text-[10px] font-bold text-secondary shadow-[0_8px_22px_rgba(0,0,0,0.22)]',
                  isActive && 'is-visible',
                )}
              >
                {label}
              </span>
              <Icon className="mobile-nav-icon h-5.5 w-5.5" />
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
