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
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { apiClient } from '../api/client'
import { auth } from '../firebase/config'
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

type AppContextValue = {
  foods: FoodEntry[]
  exercises: ExerciseEntry[]
  routines: Routine[]
  diets: Diet[]
  totals: ReturnType<typeof foodTotals>
  isBootstrapping: boolean
  isAuthBootstrapping: boolean
  isFirebaseConfigured: boolean
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

function resolveSessionName(displayName: string | null, email: string | null) {
  const normalizedDisplayName = displayName?.trim()

  if (normalizedDisplayName) {
    return normalizedDisplayName
  }

  if (email) {
    return email.split('@')[0]
  }

  return 'Usuario'
}

function mapAuthErrorToMessage(error: unknown) {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return 'No se pudo completar la autenticacion.'
  }

  const code = String(error.code)

  switch (code) {
    case 'auth/email-already-in-use':
      return 'Ese correo ya esta registrado.'
    case 'auth/invalid-email':
      return 'El correo no es valido.'
    case 'auth/weak-password':
      return 'La contrasena debe tener al menos 6 caracteres.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Correo o contrasena incorrectos.'
    default:
      return 'No se pudo completar la autenticacion.'
  }
}

function withNewestFirst<T extends { id: number }>(items: T[]) {
  return [...items].sort((left, right) => right.id - left.id)
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [foods, setFoods] = useState<FoodEntry[]>([])
  const [exercises, setExercises] = useState<ExerciseEntry[]>([])
  const [routines, setRoutines] = useState<Routine[]>([])
  const [diets, setDiets] = useState<Diet[]>([])
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const isFirebaseConfigured = Boolean(auth)
  const [isAuthBootstrapping, setIsAuthBootstrapping] = useState(Boolean(auth))
  const [networkState, setNetworkState] = useState<ApiFeedbackState>('idle')
  const [networkMessage, setNetworkMessage] = useState('')
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null)

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
    if (!auth) {
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || !user.email) {
        setSessionUser(null)
        setIsAuthBootstrapping(false)
        return
      }

      setSessionUser({
        name: resolveSessionName(user.displayName, user.email),
        email: user.email,
      })
      setIsAuthBootstrapping(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

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
      if (!auth) {
        return false
      }

      try {
        const credentials = await signInWithEmailAndPassword(auth, email.trim(), password)
        setSessionUser({
          name: resolveSessionName(credentials.user.displayName, credentials.user.email),
          email: credentials.user.email ?? email.trim(),
        })
        return true
      } catch {
        return false
      }
    },
    [],
  )

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<RegisterResult> => {
      if (!auth) {
        return { ok: false, message: 'Firebase no esta configurado en este entorno.' }
      }

      try {
        const normalizedName = name.trim()
        const credentials = await createUserWithEmailAndPassword(auth, email.trim(), password)

        if (normalizedName) {
          await updateProfile(credentials.user, { displayName: normalizedName })
        }

        setSessionUser({
          name: resolveSessionName(normalizedName, credentials.user.email),
          email: credentials.user.email ?? email.trim(),
        })
        return { ok: true }
      } catch (error) {
        return { ok: false, message: mapAuthErrorToMessage(error) }
      }
    },
    [],
  )

  const logout = useCallback(() => {
    if (auth) {
      void signOut(auth)
    }

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
      isAuthBootstrapping,
      isFirebaseConfigured,
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
      isAuthBootstrapping,
      isFirebaseConfigured,
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