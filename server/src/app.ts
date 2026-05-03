import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { dashboardRouter } from './routes/dashboardRoutes.js'
import { dietRouter } from './routes/dietRoutes.js'
import { exerciseRouter } from './routes/exerciseRoutes.js'
import { foodRouter } from './routes/foodRoutes.js'
import { routineRouter } from './routes/routineRoutes.js'

export function createApp() {
  const app = express()

  app.use(cors({ origin: env.allowedOrigin }))
  app.use(express.json())

  app.use('/api/v1', dashboardRouter)
  app.use('/api/v1', foodRouter)
  app.use('/api/v1', exerciseRouter)
  app.use('/api/v1', dietRouter)
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