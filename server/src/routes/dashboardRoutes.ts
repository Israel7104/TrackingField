import { Router } from 'express'
import { getDashboard, getHealth } from '../controllers/dashboardController.js'

export const dashboardRouter = Router()

dashboardRouter.get('/health', getHealth)
dashboardRouter.get('/dashboard', getDashboard)