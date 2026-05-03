/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { apiClient } from '../api/client'
import { foodTotals } from '../types'
import type {
  ApiFeedbackState,
  DashboardData,
  Diet,
  ExerciseEntry,
  FoodEntry,
  NewDiet,
  NewExerciseEntry,
  NewFoodEntry,
  NewRoutine,
  RegisterResult,
  Routine,
  SessionUser,
} from '../types'

const STORAGE_ACCOUNTS = 'tf_accounts'
const STORAGE_SESSION = 'tf_session'

type StoredAccount = { name: string; email: string; password: string }

function loadAccounts(): StoredAccount[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_ACCOUNTS) ?? '[]') as StoredAccount[]
  } catch {
    return []
  }
}

function saveAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(STORAGE_ACCOUNTS, JSON.stringify(accounts))
}

function loadSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION)
    return raw ? (JSON.parse(raw) as SessionUser) : null
  } catch {
    return null
  }
}

function saveSession(user: SessionUser | null) {
  if (user) {
    localStorage.setItem(STORAGE_SESSION, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_SESSION)
  }
}

type AppContextValue = {
  foods: FoodEntry[]
  exercises: ExerciseEntry[]
  routines: Routine[]
  diets: Diet[]
  totals: ReturnType<typeof foodTotals>
  isBootstrapping: boolean
  networkState: ApiFeedbackState
  networkMessage: string
  sessionUser: SessionUser | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<RegisterResult>
  logout: () => void
  refreshData: () => Promise<void>
  addFood: (food: NewFoodEntry) => Promise<void>
  addExercise: (exercise: NewExerciseEntry) => Promise<void>
  createDiet: (diet: NewDiet) => Promise<void>
  deleteDiet: (id: number) => Promise<void>
  addFoodToDiet: (dietId: number, food: NewFoodEntry) => Promise<void>
  createRoutine: (routine: NewRoutine) => Promise<void>
  deleteRoutine: (id: number) => Promise<void>
  addExerciseToRoutine: (routineId: number, exercise: NewExerciseEntry) => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

function withNewestFirst<T extends { id: number }>(items: T[]) {
  return [...items].sort((left, right) => right.id - left.id)
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [foods, setFoods] = useState<FoodEntry[]>([])
  const [exercises, setExercises] = useState<ExerciseEntry[]>([])
  const [routines, setRoutines] = useState<Routine[]>([])
  const [diets, setDiets] = useState<Diet[]>([])
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [networkState, setNetworkState] = useState<ApiFeedbackState>('idle')
  const [networkMessage, setNetworkMessage] = useState('')
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(loadSession)

  const applyDashboardData = useCallback((payload: DashboardData) => {
    setFoods(withNewestFirst(payload.foods))
    setExercises(withNewestFirst(payload.exercises))
    setRoutines(withNewestFirst(payload.routines))
    setDiets(withNewestFirst(payload.diets))
  }, [])

  const runRequest = useCallback(async <T,>(request: () => Promise<T>, successMessage: string) => {
    setNetworkState('loading')
    setNetworkMessage('Sincronizando con la API...')

    try {
      const result = await request()
      setNetworkState('success')
      setNetworkMessage(successMessage)
      return result
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ha ocurrido un error inesperado.'
      setNetworkState('error')
      setNetworkMessage(message)
      throw error
    }
  }, [])

  const refreshData = useCallback(async () => {
    const payload = await runRequest(() => apiClient.getDashboard(), 'Datos cargados desde la API.')
    applyDashboardData(payload)
  }, [applyDashboardData, runRequest])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      try {
        const payload = await apiClient.getDashboard()

        if (cancelled) {
          return
        }

        applyDashboardData(payload)
        setNetworkState('success')
        setNetworkMessage('Datos cargados desde la API.')
      } catch (error) {
        if (cancelled) {
          return
        }

        const message = error instanceof Error ? error.message : 'Ha ocurrido un error inesperado.'
        setNetworkState('error')
        setNetworkMessage(message)
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false)
        }
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
  }, [applyDashboardData])

  const login = useCallback(
    async (email: string, password: string) => {
      const accounts = loadAccounts()
      const match = accounts.find(
        (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password,
      )

      if (!match) {
        return false
      }

      const user: SessionUser = { name: match.name, email: match.email }
      saveSession(user)
      setSessionUser(user)
      return true
    },
    [],
  )

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<RegisterResult> => {
      const accounts = loadAccounts()
      const exists = accounts.some(
        (a) => a.email.toLowerCase() === email.trim().toLowerCase(),
      )

      if (exists) {
        return { ok: false, message: 'Ese correo ya esta registrado.' }
      }

      if (password.length < 6) {
        return { ok: false, message: 'La contrasena debe tener al menos 6 caracteres.' }
      }

      const normalizedName = name.trim() || email.trim().split('@')[0]
      const newAccount: StoredAccount = { name: normalizedName, email: email.trim(), password }
      saveAccounts([...accounts, newAccount])

      const user: SessionUser = { name: normalizedName, email: email.trim() }
      saveSession(user)
      setSessionUser(user)
      return { ok: true }
    },
    [],
  )

  const logout = useCallback(() => {
    saveSession(null)
    setSessionUser(null)
  }, [])

  const addFood = useCallback(
    async (food: NewFoodEntry) => {
      const nextFood = await runRequest(
        () => apiClient.createFood(food),
        'Alimento guardado en el servidor.',
      )
      setFoods((prev) => [nextFood, ...prev])
    },
    [runRequest],
  )

  const addExercise = useCallback(
    async (exercise: NewExerciseEntry) => {
      const nextExercise = await runRequest(
        () => apiClient.createExercise(exercise),
        'Ejercicio guardado en el servidor.',
      )
      setExercises((prev) => [nextExercise, ...prev])
    },
    [runRequest],
  )

  const createDiet = useCallback(
    async (diet: NewDiet) => {
      const nextDiet = await runRequest(
        () => apiClient.createDiet(diet),
        'Dieta creada correctamente.',
      )
      setDiets((prev) => [nextDiet, ...prev])
    },
    [runRequest],
  )

  const deleteDiet = useCallback(
    async (id: number) => {
      await runRequest(() => apiClient.deleteDiet(id), 'Dieta eliminada correctamente.')
      setDiets((prev) => prev.filter((diet) => diet.id !== id))
    },
    [runRequest],
  )

  const addFoodToDiet = useCallback(
    async (dietId: number, food: NewFoodEntry) => {
      const updatedDiet = await runRequest(
        () => apiClient.addFoodToDiet(dietId, food),
        'Alimento agregado a la dieta.',
      )
      setDiets((prev) => prev.map((diet) => (diet.id === dietId ? updatedDiet : diet)))
    },
    [runRequest],
  )

  const createRoutine = useCallback(
    async (routine: NewRoutine) => {
      const nextRoutine = await runRequest(
        () => apiClient.createRoutine(routine),
        'Rutina creada correctamente.',
      )
      setRoutines((prev) => [nextRoutine, ...prev])
    },
    [runRequest],
  )

  const deleteRoutine = useCallback(
    async (id: number) => {
      await runRequest(() => apiClient.deleteRoutine(id), 'Rutina eliminada correctamente.')
      setRoutines((prev) => prev.filter((routine) => routine.id !== id))
    },
    [runRequest],
  )

  const addExerciseToRoutine = useCallback(
    async (routineId: number, exercise: NewExerciseEntry) => {
      const updatedRoutine = await runRequest(
        () => apiClient.addExerciseToRoutine(routineId, exercise),
        'Ejercicio agregado a la rutina.',
      )
      setRoutines((prev) =>
        prev.map((routine) => (routine.id === routineId ? updatedRoutine : routine)),
      )
    },
    [runRequest],
  )

  const totals = useMemo(() => foodTotals(foods), [foods])

  const value = useMemo<AppContextValue>(
    () => ({
      foods,
      exercises,
      routines,
      diets,
      totals,
      isBootstrapping,
      networkState,
      networkMessage,
      sessionUser,
      login,
      register,
      logout,
      refreshData,
      addFood,
      addExercise,
      createDiet,
      deleteDiet,
      addFoodToDiet,
      createRoutine,
      deleteRoutine,
      addExerciseToRoutine,
    }),
    [
      foods,
      exercises,
      routines,
      diets,
      totals,
      isBootstrapping,
      networkState,
      networkMessage,
      sessionUser,
      login,
      register,
      logout,
      refreshData,
      addFood,
      addExercise,
      createDiet,
      deleteDiet,
      addFoodToDiet,
      createRoutine,
      deleteRoutine,
      addExerciseToRoutine,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext debe usarse dentro de AppProvider')
  }

  return context
}
