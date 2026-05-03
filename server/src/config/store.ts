import { fileURLToPath } from 'node:url'
import path from 'node:path'

const currentDir = path.dirname(fileURLToPath(import.meta.url))

export const storeFilePath = path.resolve(currentDir, '../..', 'data', 'store.json')