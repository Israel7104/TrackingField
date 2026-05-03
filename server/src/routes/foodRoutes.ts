import { Router } from 'express'
import { getFoods, postFood, removeFood } from '../controllers/foodController.js'

export const foodRouter = Router()

foodRouter.get('/foods', getFoods)
foodRouter.post('/foods', postFood)
foodRouter.delete('/foods/:id', removeFood)