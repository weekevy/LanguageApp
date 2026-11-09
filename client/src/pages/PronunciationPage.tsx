import { AudioLines } from 'lucide-react'
import { ComingSoonPage } from '../components/common/ComingSoonPage'

export default function PronunciationPage() {
  return (
    <ComingSoonPage
      icon={AudioLines}
      title="Pronunciation coach"
      description="Sound-level feedback and targeted pronunciation drills are on the roadmap and are not simulated in this MVP."
      accent="from-accent via-primary to-secondary"
    />
  )
}
