import { Router } from 'express'
import { profileController } from '../controllers/profileController.js'

export const profileRouter = Router()

profileRouter.get('/profile', profileController.getProfile)
profileRouter.post('/profile', profileController.setProfile)
