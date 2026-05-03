import type { ExerciseEntry, NewExerciseEntry, NewRoutine, Routine } from '../types.js'
import { readStore, writeStore } from './storeService.js'

export async function listRoutines() {
  const store = await readStore()
  return store.routines
}

export async function createRoutine(payload: NewRoutine) {
  const store = await readStore()
  const nextRoutine: Routine = { id: Date.now(), exercises: [], ...payload }
  store.routines = [nextRoutine, ...store.routines]
  await writeStore(store)
  return nextRoutine
}

export async function updateRoutine(id: number, payload: Partial<NewRoutine>) {
  const store = await readStore()
  const currentRoutine = store.routines.find((routine) => routine.id === id)

  if (!currentRoutine) {
    return null
  }

  const updatedRoutine: Routine = {
    ...currentRoutine,
    ...payload,
  }

  store.routines = store.routines.map((routine) => (routine.id === id ? updatedRoutine : routine))
  await writeStore(store)
  return updatedRoutine
}

export async function addExerciseToRoutine(id: number, payload: NewExerciseEntry) {
  const store = await readStore()
  const currentRoutine = store.routines.find((routine) => routine.id === id)

  if (!currentRoutine) {
    return null
  }

  const nextExercise: ExerciseEntry = { id: Date.now(), ...payload }
  const updatedRoutine: Routine = {
    ...currentRoutine,
    exercises: [...currentRoutine.exercises, nextExercise],
  }

  store.routines = store.routines.map((routine) => (routine.id === id ? updatedRoutine : routine))
  await writeStore(store)
  return updatedRoutine
}

export async function deleteRoutine(id: number) {
  const store = await readStore()
  const exists = store.routines.some((routine) => routine.id === id)

  if (!exists) {
    return false
  }

  store.routines = store.routines.filter((routine) => routine.id !== id)
  await writeStore(store)
  return true
}