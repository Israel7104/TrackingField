import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { dashboardRouter } from './routes/dashboardRoutes.js'
import { dietRouter } from './routes/dietRoutes.js'
import { exerciseRouter } from './routes/exerciseRoutes.js'
import { foodRouter } from './routes/foodRoutes.js'
import { profileRouter } from './routes/profileRoutes.js'
import { routineRouter } from './routes/routineRoutes.js'

function isVercelPreviewOrigin(origin: string) {
  try {
    const hostname = new URL(origin).hostname
    return hostname.endsWith('.vercel.app')
  } catch {
    return false
  }
}

export function createApp() {
  const app = express()

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true)
        return
      }

      if (env.allowedOrigins.includes('*') || env.allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      if (env.allowVercelPreviews && isVercelPreviewOrigin(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('Origin no permitido por CORS'))
    },
  }))
  app.use(express.json())

  app.use('/api/v1', dashboardRouter)
  app.use('/api/v1', foodRouter)
  app.use('/api/v1', exerciseRouter)
  app.use('/api/v1', dietRouter)
  app.use('/api/v1', profileRouter)
  app.use('/api/v1', routineRouter)

  app.use((_request, response) => {
    response.status(404).json({ message: 'Ruta no encontrada.' })
  })

  app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    const message = error instanceof Error ? error.message : 'Error interno del servidor.'
    response.status(500).json({ message })
  })

  return app
}