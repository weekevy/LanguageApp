export const supportedLanguages = [
  'en',
  'fr',
  'ar',
  'es',
  'de',
  'it',
  'pt',
  'ja',
  'zh',
] as const

export type LanguageCode = (typeof supportedLanguages)[number]

export const languageNames: Record<LanguageCode, string> = {
  en: 'English',
  fr: 'French',
  ar: 'Arabic',
  es: 'Spanish',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ja: 'Japanese',
  zh: 'Chinese',
}

export type SubscriptionPlan = 'free' | 'pro'
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

export interface ApiErrorShape {
  code: string
  message: string
  details?: unknown
}

export interface ApiSuccess<T> {
  success: true
  data: T
  error: null
}

export interface ApiFailure {
  success: false
  data: null
  error: ApiErrorShape
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure

export interface MockUser {
  id: string
  name: string
  email: string
  plan: SubscriptionPlan
  avatarUrl?: string
}

export interface VideoMetadata {
  videoId: string
  title: string
  channel: string
  thumbnailUrl: string
  language: LanguageCode
  difficulty: Difficulty
  duration: number
}

export interface TranscriptWord {
  id: string
  start: number
  end: number
  text: string
}

export interface TranscriptLine {
  id: string
  start: number
  end: number
  text: string
  language: LanguageCode
  translatedText?: string
  isTranslated: boolean
  speaker?: string
  words?: TranscriptWord[]
}

export interface TranscriptPayload {
  videoId: string
  language: LanguageCode
  isMock: boolean
  notice: string
  lines: TranscriptLine[]
}

export interface DemoSessionPayload {
  metadata: VideoMetadata
  transcript: TranscriptPayload
}

export interface TranslationResult {
  translated: string
  sourceLang: LanguageCode
  targetLang: LanguageCode
  isMock: boolean
  cached: boolean
}

export interface UsageLimits {
  plan: SubscriptionPlan
  used: number
  limit: number | null
  remaining: number | null
  resetsAt: string
}

export interface HealthStatus {
  status: 'ok'
  service: string
  timestamp: string
  providers: {
    transcript: string
    translation: string
  }
}

export interface VideoParseResult {
  videoId: string
  metadata: VideoMetadata
  limits: UsageLimits
}
