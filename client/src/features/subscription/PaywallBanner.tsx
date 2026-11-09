import { ArrowRight, Crown } from 'lucide-react'
import { Button } from '../../components/ui'
import { useAuthStore } from '../../store/authStore'
import { useSubscriptionStore } from '../../store/subscriptionStore'

export const PaywallBanner = () => {
  const plan = useAuthStore((state) => state.user?.plan ?? 'free')
  const openUpgrade = useSubscriptionStore((state) => state.openUpgrade)

  if (plan === 'pro') return null

  return (
    <section className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/14 via-surface to-accent/8 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
      <div className="absolute -left-8 -top-16 h-36 w-36 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-secondary">
          <Crown className="h-4.5 w-4.5" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            You are seeing the Free learning experience
          </h3>
          <p className="mt-1 max-w-xl text-xs leading-5 text-muted">
            The first five translations are included. Activate the Pro demo to unlock every line and unlimited daily videos.
          </p>
        </div>
      </div>
      <Button type="button" className="relative mt-4 w-full sm:mt-0 sm:w-auto" onClick={openUpgrade}>
        Explore Pro <ArrowRight className="h-4 w-4" />
      </Button>
    </section>
  )
}
