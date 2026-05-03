import { Router } from 'express'
import { getExercises, postExercise, removeExercise } from '../controllers/exerciseController.js'

export const exerciseRouter = Router()

exerciseRouter.get('/exercises', getExercises)
exerciseRouter.post('/exercises', postExercise)
exerciseRouter.delete('/exercises/:id', removeExercise)