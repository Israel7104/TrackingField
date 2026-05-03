import type { Request, Response } from 'express'
import {
  addExerciseToRoutine,
  createRoutine,
  deleteRoutine,
  listRoutines,
  updateRoutine,
} from '../services/routineService.js'
import { parseId, validateExercisePayload, validateRoutinePayload } from '../utils/validators.js'

export async function getRoutines(_request: Request, response: Response) {
  response.status(200).json(await listRoutines())
}

export async function postRoutine(request: Request, response: Response) {
  const validation = validateRoutinePayload(request.body)

  if (!validation.ok) {
    response.status(400).json({ message: validation.message })
    return
  }

  response.status(201).json(await createRoutine(validation.data))
}

export async function patchRoutine(request: Request, response: Response) {
  const id = parseId(request.params.id)

  if (!id) {
    response.status(400).json({ message: 'El id de la rutina no es valido.' })
    return
  }

  const validation = validateRoutinePayload(request.body)

  if (!validation.ok) {
    response.status(400).json({ message: validation.message })
    return
  }

  const updated = await updateRoutine(id, validation.data)

  if (!updated) {
    response.status(404).json({ message: 'No se ha encontrado la rutina.' })
    return
  }

  response.status(200).json(updated)
}

export async function postRoutineExercise(request: Request, response: Response) {
  const id = parseId(request.params.id)

  if (!id) {
    response.status(400).json({ message: 'El id de la rutina no es valido.' })
    return
  }

  const validation = validateExercisePayload(request.body)

  if (!validation.ok) {
    response.status(400).json({ message: validation.message })
    return
  }

  const updated = await addExerciseToRoutine(id, validation.data)

  if (!updated) {
    response.status(404).json({ message: 'No se ha encontrado la rutina.' })
    return
  }

  response.status(201).json(updated)
}

export async function removeRoutine(request: Request, response: Response) {
  const id = parseId(request.params.id)

  if (!id) {
    response.status(400).json({ message: 'El id de la rutina no es valido.' })
    return
  }

  const deleted = await deleteRoutine(id)

  if (!deleted) {
    response.status(404).json({ message: 'No se ha encontrado la rutina.' })
    return
  }

  response.status(200).json({ ok: true })
}