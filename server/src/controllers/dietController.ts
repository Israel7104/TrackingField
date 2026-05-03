import type { Request, Response } from 'express'
import { addFoodToDiet, createDiet, deleteDiet, listDiets, updateDiet } from '../services/dietService.js'
import { parseId, validateDietPayload, validateFoodPayload } from '../utils/validators.js'

export async function getDiets(_request: Request, response: Response) {
  response.status(200).json(await listDiets())
}

export async function postDiet(request: Request, response: Response) {
  const validation = validateDietPayload(request.body)

  if (!validation.ok) {
    response.status(400).json({ message: validation.message })
    return
  }

  response.status(201).json(await createDiet(validation.data))
}

export async function patchDiet(request: Request, response: Response) {
  const id = parseId(request.params.id)

  if (!id) {
    response.status(400).json({ message: 'El id de la dieta no es valido.' })
    return
  }

  const validation = validateDietPayload(request.body)

  if (!validation.ok) {
    response.status(400).json({ message: validation.message })
    return
  }

  const updated = await updateDiet(id, validation.data)

  if (!updated) {
    response.status(404).json({ message: 'No se ha encontrado la dieta.' })
    return
  }

  response.status(200).json(updated)
}

export async function postDietFood(request: Request, response: Response) {
  const id = parseId(request.params.id)

  if (!id) {
    response.status(400).json({ message: 'El id de la dieta no es valido.' })
    return
  }

  const validation = validateFoodPayload(request.body)

  if (!validation.ok) {
    response.status(400).json({ message: validation.message })
    return
  }

  const updated = await addFoodToDiet(id, validation.data)

  if (!updated) {
    response.status(404).json({ message: 'No se ha encontrado la dieta.' })
    return
  }

  response.status(201).json(updated)
}

export async function removeDiet(request: Request, response: Response) {
  const id = parseId(request.params.id)

  if (!id) {
    response.status(400).json({ message: 'El id de la dieta no es valido.' })
    return
  }

  const deleted = await deleteDiet(id)

  if (!deleted) {
    response.status(404).json({ message: 'No se ha encontrado la dieta.' })
    return
  }

  response.status(200).json({ ok: true })
}