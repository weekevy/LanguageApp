import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { mobileNavigationItems } from './navigation'

export const MobileNavigation = () => (
  <nav
    aria-label="Mobile navigation"
    className="fixed inset-x-3 bottom-3 z-40 grid h-18 grid-cols-5 rounded-[1.35rem] border border-border-strong bg-surface/88 p-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-2xl lg:hidden"
  >
    {mobileNavigationItems.map(({ label, path, icon: Icon }, index) => (
      <NavLink
        key={`${path}-${label}-${index}`}
        to={path}
        end={path === '/' && label === 'Home'}
        className="relative flex min-w-0 items-stretch rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        {({ isActive }) => (
          <span
            className={cn(
              'relative z-10 flex w-full min-w-0 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-semibold text-muted transition-colors duration-300',
              isActive && 'text-secondary',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="mobile-navigation-active"
                className="absolute inset-0 -z-10 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/18 to-primary/7 shadow-[0_8px_24px_rgba(109,94,252,0.16)]"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <motion.span
              animate={{ y: isActive ? -2 : 0, scale: isActive ? 1.12 : 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            >
              <Icon className="h-5.5 w-5.5" />
            </motion.span>
            <span className="max-w-full truncate">{label}</span>
          </span>
        )}
      </NavLink>
    ))}
  </nav>
)
