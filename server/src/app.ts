import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { pinoHttp } from 'pino-http'
import { allowedOrigins, env } from './config/env.js'
import { logger } from './lib/logger.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { attachMockIdentity } from './middleware/mockIdentity.js'
import { apiRateLimiter } from './middleware/rateLimit.js'
import { apiRouter } from './routes/index.js'

export const createApp = () => {
  const app = express()

  app.disable('x-powered-by')
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
  app.use(
    cors({
      origin(origin, callback) {
        const isLocalDevelopmentOrigin =
          env.NODE_ENV !== 'production' &&
          /^http:\/\/(localhost|127\.0\.0\.1):5173$/.test(origin ?? '')

        if (
          !origin ||
          allowedOrigins.includes(origin) ||
          isLocalDevelopmentOrigin
        ) {
          callback(null, true)
          return
        }

        callback(new Error('Origin is not allowed by CORS.'))
      },
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'x-device-id',
        'x-mock-user-id',
        'x-mock-plan',
      ],
    }),
  )
  app.use(
    pinoHttp({
      logger,
      autoLogging: env.LOG_LEVEL === 'debug' || env.LOG_LEVEL === 'trace',
    }),
  )
  app.use(express.json({ limit: '32kb' }))
  app.use('/api/v1', apiRateLimiter, attachMockIdentity, apiRouter)
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}

export const app = createApp()
