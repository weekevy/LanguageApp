import { PenLine } from 'lucide-react'
import { ComingSoonPage } from '../components/common/ComingSoonPage'

export default function WritingPage() {
  return (
    <ComingSoonPage
      icon={PenLine}
      title="Writing studio"
      description="Video-inspired prompts, corrections, and writing feedback will live here in a future version of LinguaTube."
      accent="from-accent via-secondary to-primary"
    />
  )
}
