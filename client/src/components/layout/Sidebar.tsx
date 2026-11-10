import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { useAuthStore } from '../../store/authStore'
import { useUiStore } from '../../store/uiStore'
import { navigationItems, type NavigationItem } from './navigation'

const SidebarLink = ({
  item: { label, path, icon: Icon },
  collapsed,
  soon = false,
  premium = false,
}: {
  item: NavigationItem
  collapsed: boolean
  soon?: boolean
  premium?: boolean
}) => (
  <NavLink
    to={path}
    end={path === '/'}
    title={collapsed ? label : undefined}
    className={({ isActive }) =>
      cn(
        'group relative flex h-11 items-center rounded-xl text-sm font-medium text-muted transition-all duration-200 hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
        collapsed ? 'justify-center px-0' : 'gap-3 px-3',
        isActive &&
          'bg-primary/12 text-secondary shadow-[inset_0_0_0_1px_rgba(109,94,252,0.18),0_8px_24px_rgba(109,94,252,0.08)]',
      )
    }
  >
    <Icon className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
    <span className={cn(collapsed && 'sr-only')}>{label}</span>
    {soon && !collapsed && (
      <span className="ml-auto rounded-full border border-border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-muted/70">
        Soon
      </span>
    )}
    {premium && !collapsed && (
      <Sparkles className="ml-auto h-3.5 w-3.5 text-warning" />
    )}
  </NavLink>
)

export const Sidebar = () => {
  const plan = useAuthStore((state) => state.user?.plan ?? 'free')
  const collapsed = useUiStore((state) => state.isSidebarCollapsed)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-border bg-surface py-4 shadow-[8px_0_24px_rgba(0,0,0,0.035)] lg:flex',
        collapsed ? 'w-20 px-3' : 'w-62 px-4',
      )}
    >
      <button
        type="button"
        onClick={toggleSidebar}
        title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-elevated/70 px-0 text-muted transition-all duration-200 hover:border-primary/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
          collapsed ? 'mx-auto' : 'ml-auto',
        )}
      >
        {collapsed ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </button>

      <nav aria-label="Main navigation" className="mt-5 flex-1">
        <p
          className={cn(
            'mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-muted/60',
            collapsed && 'sr-only',
          )}
        >
          Explore
        </p>
        <SidebarLink item={navigationItems[0]!} collapsed={collapsed} />

        <p
          className={cn(
            'mb-2 mt-6 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-muted/60',
            collapsed && 'sr-only',
          )}
        >
          Practice
        </p>
        <div className="space-y-1">
          {navigationItems.slice(1, 5).map((item) => (
            <SidebarLink
              key={item.path}
              item={item}
              collapsed={collapsed}
              soon
            />
          ))}
        </div>

        <p
          className={cn(
            'mb-2 mt-6 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-muted/60',
            collapsed && 'sr-only',
          )}
        >
          Plan
        </p>
        <SidebarLink
          item={navigationItems[5]!}
          collapsed={collapsed}
          premium={plan === 'free'}
        />
      </nav>

      <nav
        aria-label="Support navigation"
        className="space-y-1 border-t border-border pt-3"
      >
        {navigationItems.slice(6, 8).map((item) => (
          <SidebarLink key={item.path} item={item} collapsed={collapsed} />
        ))}
      </nav>
    </aside>
  )
}
