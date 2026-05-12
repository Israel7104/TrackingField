import { readStore, writeStore } from './storeService.js'
import type { UserProfile, WeightHistoryPoint } from '../types.js'

const MAX_HISTORY_POINTS = 30

function nowTimestamp(): string {
  return new Date().toISOString()
}

function createDefaultProfile(): UserProfile {
  return {
    weight: 72.4,
    objective: 'Ganar masa muscular',
    activity: 'Alta',
    targetCalories: 2800,
    weightHistory: [{ date: nowTimestamp(), weight: 72.4 }],
  }
}

function isValidWeightHistoryPoint(point: unknown): point is WeightHistoryPoint {
  if (!point || typeof point !== 'object') return false

  const candidate = point as Partial<WeightHistoryPoint>
  return (
    typeof candidate.date === 'string' &&
    candidate.date.trim().length > 0 &&
    typeof candidate.weight === 'number' &&
    candidate.weight > 0
  )
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function isValidBaseProfile(profile: unknown): profile is Omit<UserProfile, 'weightHistory'> {
  if (!profile || typeof profile !== 'object') return false

  const candidate = profile as Partial<Omit<UserProfile, 'weightHistory'>>

  return (
    typeof candidate.weight === 'number' &&
    candidate.weight > 0 &&
    typeof candidate.objective === 'string' &&
    candidate.objective.trim().length > 0 &&
    (candidate.activity === 'Baja' || candidate.activity === 'Media' || candidate.activity === 'Alta') &&
    typeof candidate.targetCalories === 'number' &&
    candidate.targetCalories > 0
  )
}

function normalizeHistory(history: unknown, currentWeight: number): WeightHistoryPoint[] {
  const points = Array.isArray(history) ? history.filter(isValidWeightHistoryPoint) : []
  const sorted = points
    .map((point) => ({
      date: point.date,
      weight: Number(point.weight.toFixed(1)),
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const compact = sorted.reduce<WeightHistoryPoint[]>((acc, point) => {
    const last = acc[acc.length - 1]
    if (last && last.date === point.date) {
      acc[acc.length - 1] = point
      return acc
    }

    acc.push(point)
    return acc
  }, [])

  const last = compact[compact.length - 1]
  const now = nowTimestamp()
  const normalizedWeight = Number(currentWeight.toFixed(1))

  if (!last) {
    return [{ date: now, weight: normalizedWeight }]
  }

  if (Math.abs(last.weight - normalizedWeight) < 0.01) {
    return compact.slice(-MAX_HISTORY_POINTS)
  }

  return [...compact, { date: now, weight: normalizedWeight }].slice(-MAX_HISTORY_POINTS)
}

function normalizeProfile(profile: unknown): UserProfile | null {
  if (!isValidBaseProfile(profile)) {
    return null
  }

  const candidate = profile as Partial<UserProfile>

  return {
    weight: Number(candidate.weight!.toFixed(1)),
    objective: candidate.objective!.trim(),
    activity: candidate.activity!,
    targetCalories: Math.round(candidate.targetCalories!),
    weightHistory: normalizeHistory(candidate.weightHistory, candidate.weight!),
  }
}

export async function getProfile(email: string): Promise<UserProfile> {
  const normalized = normalizeEmail(email)
  const store = await readStore()

  if (!store.profiles || !store.profiles[normalized]) {
    return createDefaultProfile()
  }

  const stored = store.profiles[normalized]
  const normalizedProfile = normalizeProfile(stored)
  return normalizedProfile ?? createDefaultProfile()
}

export async function setProfile(email: string, profile: UserProfile): Promise<UserProfile> {
  const normalized = normalizeEmail(email)
  const store = await readStore()

  if (!store.profiles) {
    store.profiles = {}
  }

  const normalizedProfile = normalizeProfile(profile)

  if (!normalizedProfile) {
    throw new Error('Datos del perfil inválidos.')
  }

  store.profiles[normalized] = normalizedProfile
  await writeStore(store)

  return normalizedProfile
}
