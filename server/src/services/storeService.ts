import { access, copyFile, readFile, writeFile } from 'node:fs/promises'
import { storeFilePath, storeSeedFilePath } from '../config/store.js'
import type { DashboardData } from '../types.js'

let writeQueue = Promise.resolve()

async function ensureStoreFile() {
  try {
    await access(storeFilePath)
  } catch {
    if (storeFilePath !== storeSeedFilePath) {
      await copyFile(storeSeedFilePath, storeFilePath)
      return
    }

    const initialStore: DashboardData = {
      foods: [],
      exercises: [],
      routines: [],
      diets: [],
      profiles: {},
    }

    await writeFile(storeFilePath, `${JSON.stringify(initialStore, null, 2)}\n`, 'utf-8')
  }
}

export async function readStore() {
  await ensureStoreFile()
  const raw = await readFile(storeFilePath, 'utf-8')
  return JSON.parse(raw) as DashboardData
}

export async function writeStore(nextStore: DashboardData) {
  writeQueue = writeQueue.then(() =>
    writeFile(storeFilePath, `${JSON.stringify(nextStore, null, 2)}\n`, 'utf-8'),
  )

  await writeQueue
  return nextStore
}