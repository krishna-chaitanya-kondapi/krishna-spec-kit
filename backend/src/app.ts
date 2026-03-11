import express from 'express'
import apiRouter from './api'
import { env } from './config/env'
import { errorHandler, notFoundHandler } from './middleware/error-handler'
import { perfTimingMiddleware } from './middleware/perf-timing'
import { adminLoginRateLimiter } from './middleware/rateLimit'
import { securityMiddleware } from './middleware/security'
import { initCsvStorage } from './services/csv-init'

export const createApp = async () => {
  const app = express()

  app.disable('x-powered-by')
  app.use(express.json({ limit: '100kb' }))
  app.use(securityMiddleware())
  app.use(perfTimingMiddleware)
  app.use('/api/admin/login', adminLoginRateLimiter)

  await initCsvStorage(env.DATA_DIR)

  app.use('/api', apiRouter)
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
