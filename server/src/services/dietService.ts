import type { Diet, FoodEntry, NewDiet, NewFoodEntry } from '../types.js'
import { readStore, writeStore } from './storeService.js'

export async function listDiets() {
  const store = await readStore()
  return store.diets
}

export async function createDiet(payload: NewDiet) {
  const store = await readStore()
  const nextDiet: Diet = { id: Date.now(), foods: [], ...payload }
  store.diets = [nextDiet, ...store.diets]
  await writeStore(store)
  return nextDiet
}

export async function updateDiet(id: number, payload: Partial<NewDiet>) {
  const store = await readStore()
  const currentDiet = store.diets.find((diet) => diet.id === id)

  if (!currentDiet) {
    return null
  }

  const updatedDiet: Diet = {
    ...currentDiet,
    ...payload,
  }

  store.diets = store.diets.map((diet) => (diet.id === id ? updatedDiet : diet))
  await writeStore(store)
  return updatedDiet
}

export async function addFoodToDiet(id: number, payload: NewFoodEntry) {
  const store = await readStore()
  const currentDiet = store.diets.find((diet) => diet.id === id)

  if (!currentDiet) {
    return null
  }

  const nextFood: FoodEntry = { id: Date.now(), ...payload }
  const updatedDiet: Diet = {
    ...currentDiet,
    foods: [...currentDiet.foods, nextFood],
  }

  store.diets = store.diets.map((diet) => (diet.id === id ? updatedDiet : diet))
  await writeStore(store)
  return updatedDiet
}

export async function deleteDiet(id: number) {
  const store = await readStore()
  const exists = store.diets.some((diet) => diet.id === id)

  if (!exists) {
    return false
  }

  store.diets = store.diets.filter((diet) => diet.id !== id)
  await writeStore(store)
  return true
}