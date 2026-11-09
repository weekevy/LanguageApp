import 'dotenv/config'
import { z } from 'zod'

const emptyToUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().min(1).max(65_535).default(4_000),
  CLIENT_URL: z.string().default('http://127.0.0.1:5173'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('warn'),
  TRANSCRIPT_PROVIDER: z.enum(['mock', 'real']).default('mock'),
  TRANSLATION_PROVIDER: z.enum(['mock', 'real']).default('mock'),
  FREE_DAILY_VIDEO_LIMIT: z.coerce.number().int().positive().default(3),
  YOUTUBE_API_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  DEEPL_API_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  DATABASE_URL: z.preprocess(emptyToUndefined, z.string().optional()),
  REDIS_URL: z.preprocess(emptyToUndefined, z.string().optional()),
  JWT_SECRET: z.string().min(12).default('development-only-secret'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('\n')
  throw new Error(`Invalid environment configuration:\n${issues}`)
}

export const env = parsed.data
export type AppEnv = typeof env

export const allowedOrigins = env.CLIENT_URL.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
