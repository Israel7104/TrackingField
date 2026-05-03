import type { Request, Response } from 'express'
import { createFood, deleteFood, listFoods } from '../services/foodService.js'
import { parseId, validateFoodPayload } from '../utils/validators.js'

export async function getFoods(_request: Request, response: Response) {
  response.status(200).json(await listFoods())
}

export async function postFood(request: Request, response: Response) {
  const validation = validateFoodPayload(request.body)

  if (!validation.ok) {
    response.status(400).json({ message: validation.message })
    return
  }

  response.status(201).json(await createFood(validation.data))
}

export async function removeFood(request: Request, response: Response) {
  const id = parseId(request.params.id)

  if (!id) {
    response.status(400).json({ message: 'El id del alimento no es valido.' })
    return
  }

  const deleted = await deleteFood(id)

  if (!deleted) {
    response.status(404).json({ message: 'No se ha encontrado el alimento.' })
    return
  }

  response.status(200).json({ ok: true })
}