import type {
  ApiResponse,
  DemoSessionPayload,
  HealthStatus,
  LanguageCode,
  MockUser,
  TranscriptPayload,
  TranslationResult,
  UsageLimits,
  VideoMetadata,
  VideoParseResult,
} from '@linguatube/shared'
import { getDeviceId } from './device'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(
  /\/$/,
  '',
)
const REQUEST_TIMEOUT_MS = 12_000

interface ApiIdentity {
  id: string
  plan: 'free' | 'pro'
}

interface AuthResult {
  user: MockUser
  authentication: string
  warning: string
}

let apiIdentity: ApiIdentity | null = null

export class ApiClientError extends Error {
  readonly code: string
  readonly status: number
  readonly details?: unknown

  constructor(
    message: string,
    code = 'NETWORK_ERROR',
    status = 0,
    details?: unknown,
  ) {
    super(message)
    this.name = 'ApiClientError'
    this.code = code
    this.status = status
    this.details = details
  }
}

export const configureApiIdentity = (user: MockUser | null) => {
  apiIdentity = user ? { id: user.id, plan: user.plan } : null
}

const request = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const controller = new AbortController()
  const timeout = window.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  )
  const identityHeaders: Record<string, string> = apiIdentity
    ? {
        'x-mock-user-id': apiIdentity.id,
        'x-mock-plan': apiIdentity.plan,
      }
    : { 'x-device-id': getDeviceId() }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...identityHeaders,
        ...options.headers,
      },
    })
    const payload = (await response.json()) as ApiResponse<T>

    if (!response.ok || !payload.success) {
      const error = payload.success ? null : payload.error
      throw new ApiClientError(
        error?.message ?? 'The server could not complete the request.',
        error?.code ?? 'REQUEST_FAILED',
        response.status,
        error?.details,
      )
    }

    return payload.data
  } catch (error) {
    if (error instanceof ApiClientError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiClientError(
        'The request took too long. Check that the API server is running.',
        'REQUEST_TIMEOUT',
      )
    }

    throw new ApiClientError(
      'Could not reach the LinguaTube API. Start the server and try again.',
    )
  } finally {
    window.clearTimeout(timeout)
  }
}

export const api = {
  health: () => request<HealthStatus>('/health'),
  demoSession: () => request<DemoSessionPayload>('/demo'),
  parseVideo: (url: string) =>
    request<VideoParseResult>('/video/parse', {
      method: 'POST',
      body: JSON.stringify({ url }),
    }),
  transcript: (videoId: string) =>
    request<TranscriptPayload>(`/transcript/${videoId}`),
  translate: (
    text: string,
    targetLang: LanguageCode,
    sourceLang: LanguageCode = 'en',
  ) =>
    request<TranslationResult>('/translate', {
      method: 'POST',
      body: JSON.stringify({ text, sourceLang, targetLang }),
    }),
  suggestions: () => request<{ videos: VideoMetadata[] }>('/suggestions'),
  limits: () => request<UsageLimits>('/user/limits'),
  login: (name: string, email: string) =>
    request<AuthResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ name, email }),
    }),
  loginWithCredentials: (username: string, password: string) =>
    request<AuthResult>('/auth/credentials', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  register: (input: {
    name: string
    email: string
    username: string
    password: string
    confirmPassword: string
  }) =>
    request<AuthResult>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  socialLogin: (provider: 'google' | 'x') =>
    request<AuthResult>('/auth/social', {
      method: 'POST',
      body: JSON.stringify({ provider }),
    }),
}
