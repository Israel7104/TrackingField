import type {
  DashboardData,
  Diet,
  ExerciseEntry,
  FoodEntry,
  NewDiet,
  NewExerciseEntry,
  NewFoodEntry,
  NewRoutine,
  Routine,
} from '../types'

export type UserProfile = {
  weight: number
  objective: string
  activity: 'Baja' | 'Media' | 'Alta'
  targetCalories: number
}

const rawApiBaseUrl = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:4000/api/v1' : '')
const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, '')

type RequestInitWithBody = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInitWithBody) {
  if (!API_BASE_URL) {
    throw new ApiError('Falta configurar VITE_API_URL en este entorno.', 500)
  }

  const headers = new Headers(init?.headers)

  if (init?.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
    })
  } catch {
    throw new ApiError('No se pudo conectar con la API. Revisa VITE_API_URL y la configuracion CORS.', 0)
  }

  if (!response.ok) {
    let message = 'No se pudo completar la peticion.'

    try {
      const payload = (await response.json()) as { message?: string }
      message = payload.message ?? message
    } catch {
      message = response.statusText || message
    }

    throw new ApiError(message, response.status)
  }

  return (await response.json()) as T
}

export const apiClient = {
  getDashboard() {
    return request<DashboardData>('/dashboard')
  },
  getProfile(email: string) {
    return request<UserProfile>(`/profile?email=${encodeURIComponent(email)}`)
  },
  setProfile(email: string, profile: UserProfile) {
    return request<UserProfile>(`/profile?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      body: profile,
    })
  },
  createFood(food: NewFoodEntry) {
    return request<FoodEntry>('/foods', { method: 'POST', body: food })
  },
  createExercise(exercise: NewExerciseEntry) {
    return request<ExerciseEntry>('/exercises', { method: 'POST', body: exercise })
  },
  createDiet(diet: NewDiet) {
    return request<Diet>('/diets', { method: 'POST', body: diet })
  },
  deleteDiet(id: number) {
    return request<{ ok: true }>(`/diets/${id}`, { method: 'DELETE' })
  },
  addFoodToDiet(id: number, food: NewFoodEntry) {
    return request<Diet>(`/diets/${id}/foods`, { method: 'POST', body: food })
  },
  createRoutine(routine: NewRoutine) {
    return request<Routine>('/routines', { method: 'POST', body: routine })
  },
  deleteRoutine(id: number) {
    return request<{ ok: true }>(`/routines/${id}`, { method: 'DELETE' })
  },
  addExerciseToRoutine(id: number, exercise: NewExerciseEntry) {
    return request<Routine>(`/routines/${id}/exercises`, { method: 'POST', body: exercise })
  },
}