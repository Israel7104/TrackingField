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
import { usePersistentState } from '../hooks/usePersistentState'
import { foodTotals } from '../types'
import type {
  ApiFeedbackState,
  AuthAccount,
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
  login: (email: string, password: string) => boolean
  register: (name: string, email: string, password: string) => RegisterResult
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

const AUTH_USERS_KEY = 'trackingfield.auth.accounts'
const AUTH_SESSION_KEY = 'trackingfield.auth.session'

const defaultAccounts: AuthAccount[] = [
  {
    id: 1,
    name: 'Demo TrackingField',
    email: 'demo@trackingfield.app',
    password: 'demo1234',
  },
]

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
  const [accounts, setAccounts] = usePersistentState<AuthAccount[]>(AUTH_USERS_KEY, defaultAccounts)
  const [sessionUser, setSessionUser] = usePersistentState<SessionUser | null>(AUTH_SESSION_KEY, null)

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
    (email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase()
      const account = accounts.find(
        (candidate) =>
          candidate.email.toLowerCase() === normalizedEmail && candidate.password === password,
      )

      if (!account) {
        return false
      }

      setSessionUser({ name: account.name, email: account.email })
      return true
    },
    [accounts, setSessionUser],
  )

  const register = useCallback(
    (name: string, email: string, password: string): RegisterResult => {
      const normalizedEmail = email.trim().toLowerCase()
      const duplicated = accounts.some(
        (candidate) => candidate.email.toLowerCase() === normalizedEmail,
      )

      if (duplicated) {
        return { ok: false, message: 'Ese correo ya esta registrado.' }
      }

      const nextAccount: AuthAccount = {
        id: Date.now(),
        name: name.trim(),
        email: normalizedEmail,
        password,
      }

      setAccounts((prev) => [nextAccount, ...prev])
      setSessionUser({ name: nextAccount.name, email: nextAccount.email })
      return { ok: true }
    },
    [accounts, setAccounts, setSessionUser],
  )

  const logout = useCallback(() => {
    setSessionUser(null)
  }, [setSessionUser])

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