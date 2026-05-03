import { Router } from 'express'
import { getDiets, patchDiet, postDiet, postDietFood, removeDiet } from '../controllers/dietController.js'

export const dietRouter = Router()

dietRouter.get('/diets', getDiets)
dietRouter.post('/diets', postDiet)
dietRouter.patch('/diets/:id', patchDiet)
dietRouter.post('/diets/:id/foods', postDietFood)
dietRouter.delete('/diets/:id', removeDiet)