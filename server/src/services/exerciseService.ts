import type { ExerciseEntry, NewExerciseEntry } from '../types.js'
import { readStore, writeStore } from './storeService.js'

export async function listExercises() {
  const store = await readStore()
  return store.exercises
}

export async function createExercise(payload: NewExerciseEntry) {
  const store = await readStore()
  const nextExercise: ExerciseEntry = { id: Date.now(), ...payload }
  store.exercises = [nextExercise, ...store.exercises]
  await writeStore(store)
  return nextExercise
}

export async function deleteExercise(id: number) {
  const store = await readStore()
  const exists = store.exercises.some((exercise) => exercise.id === id)

  if (!exists) {
    return false
  }

  store.exercises = store.exercises.filter((exercise) => exercise.id !== id)
  await writeStore(store)
  return true
}