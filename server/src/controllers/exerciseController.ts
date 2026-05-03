import type { Request, Response } from 'express'
import { createExercise, deleteExercise, listExercises } from '../services/exerciseService.js'
import { parseId, validateExercisePayload } from '../utils/validators.js'

export async function getExercises(_request: Request, response: Response) {
  response.status(200).json(await listExercises())
}

export async function postExercise(request: Request, response: Response) {
  const validation = validateExercisePayload(request.body)

  if (!validation.ok) {
    response.status(400).json({ message: validation.message })
    return
  }

  response.status(201).json(await createExercise(validation.data))
}

export async function removeExercise(request: Request, response: Response) {
  const id = parseId(request.params.id)

  if (!id) {
    response.status(400).json({ message: 'El id del ejercicio no es valido.' })
    return
  }

  const deleted = await deleteExercise(id)

  if (!deleted) {
    response.status(404).json({ message: 'No se ha encontrado el ejercicio.' })
    return
  }

  response.status(200).json({ ok: true })
}