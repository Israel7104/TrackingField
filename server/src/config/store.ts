import { fileURLToPath } from 'node:url'
import path from 'node:path'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const sourceStorePath = path.resolve(currentDir, '../..', 'data', 'store.json')

export const storeSeedFilePath = sourceStorePath
export const storeFilePath = process.env.VERCEL ? '/tmp/trackingfield-store.json' : sourceStorePath