import { Mic2 } from 'lucide-react'
import { ComingSoonPage } from '../components/common/ComingSoonPage'

export default function SpeakingPage() {
  return (
    <ComingSoonPage
      icon={Mic2}
      title="Speaking practice"
      description="Guided conversations and AI-assisted speaking sessions are planned for a future release. The MVP keeps this area intentionally focused and honest."
      accent="from-primary via-secondary to-accent"
    />
  )
}
