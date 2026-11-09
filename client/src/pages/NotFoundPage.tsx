import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui'

export default function NotFoundPage() {
  return (
    <div className="grid min-h-[calc(100vh-4.25rem)] place-items-center px-4">
      <EmptyState
        icon={Compass}
        title="This learning path does not exist"
        description="The page may have moved, or the address may be incorrect."
        action={
          <Link
            to="/"
            className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Return home
          </Link>
        }
      />
    </div>
  )
}
