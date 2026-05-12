import { readStore, writeStore } from './storeService.js'
import type { UserProfile } from '../types.js'

const DEFAULT_PROFILE: UserProfile = {
  weight: 72.4,
  objective: 'Ganar masa muscular',
  activity: 'Alta',
  targetCalories: 2800,
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function validateProfile(profile: unknown): profile is UserProfile {
  if (!profile || typeof profile !== 'object') return false

  const candidate = profile as Partial<UserProfile>

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

export async function getProfile(email: string): Promise<UserProfile> {
  const normalized = normalizeEmail(email)
  const store = await readStore()

  if (!store.profiles || !store.profiles[normalized]) {
    return DEFAULT_PROFILE
  }

  const stored = store.profiles[normalized]
  return validateProfile(stored) ? stored : DEFAULT_PROFILE
}

export async function setProfile(email: string, profile: UserProfile): Promise<UserProfile> {
  const normalized = normalizeEmail(email)
  const store = await readStore()

  if (!store.profiles) {
    store.profiles = {}
  }

  if (!validateProfile(profile)) {
    throw new Error('Datos del perfil inválidos.')
  }

  store.profiles[normalized] = profile
  await writeStore(store)

  return profile
}
