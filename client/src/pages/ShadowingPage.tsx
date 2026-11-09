import { Waves } from 'lucide-react'
import { ComingSoonPage } from '../components/common/ComingSoonPage'

export default function ShadowingPage() {
  return (
    <ComingSoonPage
      icon={Waves}
      title="Shadowing sessions"
      description="Repeat short clips, compare timing, and train natural rhythm. This dedicated mode is coming after the core transcript experience."
      accent="from-secondary via-primary to-accent"
    />
  )
}
