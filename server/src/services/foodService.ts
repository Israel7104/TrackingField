import type { FoodEntry, NewFoodEntry } from '../types.js'
import { readStore, writeStore } from './storeService.js'

export async function listFoods() {
  const store = await readStore()
  return store.foods
}

export async function createFood(payload: NewFoodEntry) {
  const store = await readStore()
  const nextFood: FoodEntry = { id: Date.now(), ...payload }
  store.foods = [nextFood, ...store.foods]
  await writeStore(store)
  return nextFood
}

export async function deleteFood(id: number) {
  const store = await readStore()
  const exists = store.foods.some((food) => food.id === id)

  if (!exists) {
    return false
  }

  store.foods = store.foods.filter((food) => food.id !== id)
  await writeStore(store)
  return true
}