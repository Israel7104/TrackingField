import { readStore } from './storeService.js'

export async function getDashboardData() {
  return readStore()
}