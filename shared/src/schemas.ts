import { z } from 'zod'
import { supportedLanguages } from './types.js'

export const youtubeVideoIdSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]{11}$/, 'Invalid YouTube video ID')

export const parseVideoSchema = z.object({
  url: z.string().trim().min(1, 'A YouTube URL is required').max(500),
})

export const translateSchema = z.object({
  text: z.string().trim().min(1, 'Text is required').max(5_000),
  targetLang: z.enum(supportedLanguages),
  sourceLang: z.enum(supportedLanguages).default('en'),
})

export const mockLoginSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must contain at least 2 characters')
    .max(80),
  email: z.string().trim().email('Enter a valid email address').max(200),
})

export const credentialsLoginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must contain at least 3 characters')
    .max(40),
  password: z
    .string()
    .min(4, 'Password must contain at least 4 characters')
    .max(100),
})

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must contain at least 2 characters')
      .max(80),
    email: z.string().trim().email('Enter a valid email address').max(200),
    username: z
      .string()
      .trim()
      .min(3, 'Username must contain at least 3 characters')
      .max(40)
      .regex(/^[a-zA-Z0-9._-]+$/, 'Username contains unsupported characters'),
    password: z
      .string()
      .min(6, 'Password must contain at least 6 characters')
      .max(100),
    confirmPassword: z.string().min(6).max(100),
  })
  .refine((input) => input.password === input.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export const socialAuthSchema = z.object({
  provider: z.enum(['google', 'x']),
})

export const mockPlanSchema = z.object({
  plan: z.enum(['free', 'pro']),
})

export type ParseVideoInput = z.infer<typeof parseVideoSchema>
export type TranslateInput = z.infer<typeof translateSchema>
export type MockLoginInput = z.infer<typeof mockLoginSchema>
export type CredentialsLoginInput = z.infer<typeof credentialsLoginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type SocialAuthInput = z.infer<typeof socialAuthSchema>
export type MockPlanInput = z.infer<typeof mockPlanSchema>
