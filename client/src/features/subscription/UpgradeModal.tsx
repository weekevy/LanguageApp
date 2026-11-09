import { Check, Sparkles, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { Badge, Button, Modal } from '../../components/ui'
import { useAuthStore } from '../../store/authStore'
import { useSubscriptionStore } from '../../store/subscriptionStore'
import { useUiStore } from '../../store/uiStore'

const proFeatures = [
  'Unlimited video loads',
  'Translations for every transcript line',
  'All transcript themes and typography controls',
  'Priority access to new learning modes',
]

export const UpgradeModal = () => {
  const open = useSubscriptionStore((state) => state.isUpgradeOpen)
  const close = useSubscriptionStore((state) => state.closeUpgrade)
  const user = useAuthStore((state) => state.user)
  const setPlan = useAuthStore((state) => state.setPlan)
  const openAuth = useUiStore((state) => state.openAuth)

  const activateDemo = () => {
    if (!user) {
      close()
      openAuth()
      toast('Create a mock profile before activating the Pro demo.')
      return
    }

    setPlan('pro')
    close()
    toast.success('Pro demo activated—enjoy unlimited learning!')
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Unlock your full learning flow"
      description="Explore the Pro experience in mock mode. No payment information is collected."
      size="md"
    >
      <div className="p-6">
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 via-elevated to-accent/10 p-5">
          <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
          <div className="relative">
            <Badge variant="primary">
              <Sparkles className="mr-1 h-3 w-3" /> Pro demo
            </Badge>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-4xl font-bold tracking-tight text-foreground">$9</span>
              <span className="pb-1 text-sm text-muted">/ month at launch</span>
            </div>
            <ul className="mt-5 space-y-3">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-success/15 text-success">
                    <Check className="h-3 w-3" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Button type="button" className="mt-5 w-full" size="lg" onClick={activateDemo}>
          <Zap className="h-4 w-4" />
          Activate Pro demo
        </Button>
        <p className="mt-3 text-center text-[11px] text-muted">
          Stripe is intentionally not connected in this MVP.
        </p>
      </div>
    </Modal>
  )
}
