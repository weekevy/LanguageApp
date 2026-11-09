import { ArrowRight, Check, Crown, Minus, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { Badge, Button, Card } from '../components/ui'
import { useAuthStore } from '../store/authStore'
import { useSubscriptionStore } from '../store/subscriptionStore'

const comparison = [
  ['Daily video loads', '3', 'Unlimited'],
  ['Original transcript', 'Full', 'Full'],
  ['Translation lines', 'First 5', 'Unlimited'],
  ['Transcript themes', 'Basic', 'All themes'],
  ['Advanced typography', '—', 'Included'],
  ['Priority features', '—', 'Included'],
]

export default function PricingPage() {
  const user = useAuthStore((state) => state.user)
  const setPlan = useAuthStore((state) => state.setPlan)
  const openUpgrade = useSubscriptionStore((state) => state.openUpgrade)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="hero-grid relative overflow-hidden rounded-3xl border border-border bg-surface px-5 py-10 text-center shadow-[var(--app-shadow-soft)] sm:px-8 sm:py-14">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative mx-auto max-w-2xl">
          <Badge variant="primary">
            <Sparkles className="mr-1 h-3 w-3" /> Simple pricing
          </Badge>
          <h1 className="mt-5 text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
            Start free. Go deeper with Pro.
          </h1>
          <p className="mt-5 text-base leading-7 text-muted">
            Learn for free, then unlock every transcript and customization
            control when you are ready to go deeper.
          </p>
          <p className="mt-4 text-xs text-muted">
            No card needed for the Pro demo · Cancel anytime at launch
          </p>
        </div>
      </div>

      <div className="mt-7 grid items-stretch gap-5 md:grid-cols-2">
        <Card className="flex flex-col p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <Badge variant="outline">Free</Badge>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
              Get started
            </span>
          </div>
          <div className="mt-5 flex items-end gap-2">
            <span className="text-4xl font-bold text-foreground">$0</span>
            <span className="pb-1 text-sm text-muted">forever</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">
            A generous way to turn a few favorite videos into daily practice.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              '3 video loads per day',
              'Full original transcript',
              '5 translated lines',
              'Basic display controls',
            ].map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <Check className="h-4 w-4 text-success" /> {feature}
              </li>
            ))}
          </ul>
          <Button
            type="button"
            variant="secondary"
            className="mt-auto w-full pt-0"
            disabled={!user || user.plan === 'free'}
            onClick={() => {
              setPlan('free')
              toast.success('Switched to the Free demo plan')
            }}
          >
            {!user || user.plan === 'free' ? 'Current plan' : 'Switch to Free'}
          </Button>
        </Card>

        <Card className="relative overflow-hidden border-primary/35 bg-gradient-to-br from-primary/16 via-surface to-accent/8 p-6 sm:p-8">
          <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between">
              <Badge variant="primary">
                <Crown className="mr-1 h-3 w-3" /> Pro
              </Badge>
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                Most immersive
              </span>
            </div>
            <div className="mt-5 flex items-end gap-2">
              <span className="text-4xl font-bold text-foreground">$9</span>
              <span className="pb-1 text-sm text-muted">/ month at launch</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">
              Remove limits and customize the transcript around the way you
              learn best.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Unlimited video loads',
                'Every translation unlocked',
                'All transcript themes',
                'Advanced reading controls',
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <Check className="h-4 w-4 text-success" /> {feature}
                </li>
              ))}
            </ul>
            <Button
              type="button"
              className="mt-auto w-full"
              disabled={user?.plan === 'pro'}
              onClick={openUpgrade}
            >
              {user?.plan === 'pro' ? 'Pro demo active' : 'Activate Pro demo'}
              {user?.plan !== 'pro' && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </Card>
      </div>

      <Card className="mt-8 overflow-x-auto shadow-none">
        <div className="min-w-150">
          <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr] border-b border-border bg-elevated px-4 py-3 text-xs font-bold text-muted sm:px-6">
            <span>Feature</span>
            <span>Free</span>
            <span>Pro</span>
          </div>
          {comparison.map(([feature, free, pro]) => (
            <div
              key={feature}
              className="grid grid-cols-[1.4fr_0.8fr_0.8fr] items-center border-b border-border px-4 py-4 text-xs last:border-0 sm:px-6 sm:text-sm"
            >
              <span className="font-medium text-foreground">{feature}</span>
              <span className="text-muted">
                {free === '—' ? <Minus className="h-4 w-4" /> : free}
              </span>
              <span className="font-medium text-secondary">{pro}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
