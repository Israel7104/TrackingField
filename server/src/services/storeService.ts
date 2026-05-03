import { readFile, writeFile } from 'node:fs/promises'
import { storeFilePath } from '../config/store.js'
import type { DashboardData } from '../types.js'

let writeQueue = Promise.resolve()

export async function readStore() {
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