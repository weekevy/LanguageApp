import { createHash } from 'node:crypto'
import type {
  CredentialsLoginInput,
  MockLoginInput,
  MockUser,
  RegisterInput,
  SocialAuthInput,
  SubscriptionPlan,
} from '@linguatube/shared'
import { AppError } from '../lib/errors.js'

const createUserId = (email: string) =>
  `mock_${createHash('sha256').update(email.toLocaleLowerCase()).digest('hex').slice(0, 14)}`

interface LocalAccount {
  username: string
  password: string
  user: MockUser
}

const localAccounts = new Map<string, LocalAccount>([
  [
    'admin',
    {
      username: 'admin',
      password: 'admin',
      user: {
        id: createUserId('admin@linguatube.local'),
        name: 'Admin',
        email: 'admin@linguatube.local',
        plan: 'free',
      },
    },
  ],
])

export const loginMockUser = (input: MockLoginInput): MockUser => ({
  id: createUserId(input.email),
  name: input.name,
  email: input.email.toLocaleLowerCase(),
  plan: input.email.toLocaleLowerCase().endsWith('@pro.demo') ? 'pro' : 'free',
})

export const loginWithCredentials = (
  input: CredentialsLoginInput,
): MockUser => {
  const account = localAccounts.get(input.username.toLocaleLowerCase())
  if (!account || account.password !== input.password) {
    throw new AppError(
      401,
      'INVALID_CREDENTIALS',
      'The username or password is incorrect.',
    )
  }
  return account.user
}

export const registerLocalUser = (input: RegisterInput): MockUser => {
  const username = input.username.toLocaleLowerCase()
  const email = input.email.toLocaleLowerCase()

  if (localAccounts.has(username)) {
    throw new AppError(
      409,
      'USERNAME_TAKEN',
      'That username is already in use.',
    )
  }
  if (
    [...localAccounts.values()].some((account) => account.user.email === email)
  ) {
    throw new AppError(
      409,
      'EMAIL_TAKEN',
      'An account already uses that email address.',
    )
  }

  const user: MockUser = {
    id: createUserId(email),
    name: input.name,
    email,
    plan: 'free',
  }
  localAccounts.set(username, { username, password: input.password, user })
  return user
}

export const loginWithSocialProvider = ({
  provider,
}: SocialAuthInput): MockUser => {
  const providerName = provider === 'google' ? 'Google' : 'X'
  const email = `${provider}@oauth.linguatube.local`
  return {
    id: createUserId(email),
    name: `${providerName} Learner`,
    email,
    plan: 'free',
  }
}

export const changeMockPlan = (
  user: Pick<MockUser, 'id' | 'name' | 'email'>,
  plan: SubscriptionPlan,
): MockUser => ({ ...user, plan })
