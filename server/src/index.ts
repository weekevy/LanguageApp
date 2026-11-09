import { app } from './app.js'
import { env } from './config/env.js'
import { logger } from './lib/logger.js'

const server = app.listen(env.PORT, '127.0.0.1', () => {
  console.log(`✓ API  http://127.0.0.1:${env.PORT}`)
})

let isShuttingDown = false

const shutdown = (signal: string) => {
  if (isShuttingDown) return
  isShuttingDown = true
  logger.info({ signal }, 'Shutting down API server')
  server.close((error) => {
    if (error && 'code' in error && error.code !== 'ERR_SERVER_NOT_RUNNING') {
      logger.error({ error }, 'Failed to close API server cleanly')
      process.exitCode = 1
    }
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
