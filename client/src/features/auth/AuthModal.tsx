import {
  ArrowRight,
  KeyRound,
  LogIn,
  Mail,
  UserPlus,
  UserRound,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Button, Input, Modal } from '../../components/ui'
import { cn } from '../../lib/cn'
import { useAuthStore } from '../../store/authStore'
import { useUiStore } from '../../store/uiStore'

type AuthMode = 'login' | 'register'

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4.5 w-4.5">
    <path
      fill="#4285F4"
      d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-1.99 3.02v2.54h3.23c1.89-1.74 2.98-4.31 2.98-7.41Z"
    />
    <path
      fill="#34A853"
      d="M12 22c2.7 0 4.96-.9 6.62-2.36l-3.23-2.54c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H3.08v2.62A10 10 0 0 0 12 22Z"
    />
    <path
      fill="#FBBC05"
      d="M6.41 13.94A6.02 6.02 0 0 1 6.1 12c0-.67.11-1.32.31-1.94V7.44H3.08A10 10 0 0 0 2 12c0 1.61.39 3.14 1.08 4.56l3.33-2.62Z"
    />
    <path
      fill="#EA4335"
      d="M12 5.94c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.92 5.44l3.33 2.62C7.2 7.7 9.4 5.94 12 5.94Z"
    />
  </svg>
)

const XLogo = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
    <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.26-8.3L2.98 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.84h1.73L8.44 4.05H6.59L17.8 19.84Z" />
  </svg>
)

export const AuthModal = () => {
  const isOpen = useUiStore((state) => state.isAuthOpen)
  const close = useUiStore((state) => state.closeAuth)
  const login = useAuthStore((state) => state.login)
  const register = useAuthStore((state) => state.register)
  const socialLogin = useAuthStore((state) => state.socialLogin)
  const isAuthenticating = useAuthStore((state) => state.isAuthenticating)
  const [mode, setMode] = useState<AuthMode>('login')
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const finishAuth = (name: string, message: string) => {
    toast.success(`${message}, ${name}!`)
    setError(null)
    close()
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!acceptedPrivacy) {
      setError('Please agree to the privacy policy and terms to continue.')
      return
    }

    try {
      if (mode === 'login') {
        const user = await login(username, password)
        finishAuth(user.name, 'Welcome back')
        return
      }

      const user = await register({
        name,
        email,
        username,
        password,
        confirmPassword,
      })
      finishAuth(user.name, 'Account created')
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Authentication could not be completed.',
      )
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'x') => {
    setError(null)
    if (!acceptedPrivacy) {
      setError('Please agree to the privacy policy and terms to continue.')
      return
    }
    try {
      const user = await socialLogin(provider)
      finishAuth(
        user.name,
        `Connected with ${provider === 'google' ? 'Google' : 'X'}`,
      )
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Social sign-in could not be completed.',
      )
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={close}
      title={mode === 'login' ? 'Welcome back' : 'Create your account'}
      description={
        mode === 'login'
          ? 'Continue your learning flow and saved preferences.'
          : 'Create a local LinguaTube profile in a few seconds.'
      }
      size="md"
    >
      <div className="p-6">
        <div className="mb-5 grid grid-cols-2 rounded-xl border border-border bg-elevated p-1">
          {(['login', 'register'] as AuthMode[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setMode(option)
                setError(null)
                if (option === 'register' && username === 'admin') {
                  setUsername('')
                  setPassword('')
                }
              }}
              className={cn(
                'h-9 rounded-lg text-xs font-semibold text-muted transition',
                mode === option && 'bg-surface text-foreground shadow-sm',
              )}
            >
              {option === 'login' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="mb-2 block text-xs font-semibold text-muted">
                  Full name
                </span>
                <Input
                  icon={<UserRound className="h-4 w-4" />}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Alex Morgan"
                  autoComplete="name"
                  minLength={2}
                  required
                />
              </label>
              <label>
                <span className="mb-2 block text-xs font-semibold text-muted">
                  Email
                </span>
                <Input
                  icon={<Mail className="h-4 w-4" />}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="alex@example.com"
                  autoComplete="email"
                  required
                />
              </label>
            </div>
          )}

          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-muted">
              Username
            </span>
            <Input
              icon={<UserRound className="h-4 w-4" />}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Choose a username"
              autoComplete="username"
              minLength={3}
              required
            />
          </label>

          <div
            className={cn(
              'grid gap-4',
              mode === 'register' && 'sm:grid-cols-2',
            )}
          >
            <label>
              <span className="mb-2 block text-xs font-semibold text-muted">
                Password
              </span>
              <Input
                icon={<KeyRound className="h-4 w-4" />}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                minLength={mode === 'login' ? 4 : 6}
                required
              />
            </label>
            {mode === 'register' && (
              <label>
                <span className="mb-2 block text-xs font-semibold text-muted">
                  Confirm password
                </span>
                <Input
                  icon={<KeyRound className="h-4 w-4" />}
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </label>
            )}
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-elevated/55 p-3">
            <input
              type="checkbox"
              checked={acceptedPrivacy}
              onChange={(event) => {
                setAcceptedPrivacy(event.target.checked)
                if (error) setError(null)
              }}
              className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
              required
            />
            <span className="text-[11px] leading-5 text-muted">
              I agree to the{' '}
              <strong className="font-semibold text-foreground">
                Privacy Policy
              </strong>{' '}
              and{' '}
              <strong className="font-semibold text-foreground">
                Terms of Service
              </strong>
              .
            </span>
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-danger/20 bg-danger/10 px-3 py-2.5 text-xs text-danger"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            isLoading={isAuthenticating}
          >
            {mode === 'login' ? (
              <LogIn className="h-4 w-4" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            {mode === 'login' ? 'Sign in to LinguaTube' : 'Create free account'}
            {!isAuthenticating && <ArrowRight className="ml-auto h-4 w-4" />}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.14em] text-muted">
          <span className="h-px flex-1 bg-border" /> or continue with{' '}
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-3">
          <button
            type="button"
            disabled={isAuthenticating}
            onClick={() => void handleSocialLogin('google')}
            className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/35 bg-transparent px-4 text-sm font-semibold text-foreground transition hover:border-white/60 hover:bg-white/8 disabled:opacity-50"
          >
            <GoogleLogo />
            Continue with Google
          </button>
          <button
            type="button"
            disabled={isAuthenticating}
            onClick={() => void handleSocialLogin('x')}
            className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/35 bg-transparent px-4 text-sm font-semibold text-foreground transition hover:border-white/60 hover:bg-white/8 disabled:opacity-50"
          >
            <XLogo />
            Continue with X
          </button>
        </div>
      </div>
    </Modal>
  )
}
