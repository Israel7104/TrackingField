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

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1').replace(/\/$/, '')

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
  const headers = new Headers(init?.headers)

  if (init?.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
  })

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