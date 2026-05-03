/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { foodTotals } from '../types'
import type {
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

// ── localStorage keys ────────────────────────────────────────────────────────

const KEY_ACCOUNTS = 'tf_accounts'
const KEY_SESSION  = 'tf_session'
const KEY_FOODS    = 'tf_foods'
const KEY_EXERCISES = 'tf_exercises'
const KEY_DIETS    = 'tf_diets'
const KEY_ROUTINES = 'tf_routines'
const KEY_NEXT_ID  = 'tf_next_id'

// ── helpers ──────────────────────────────────────────────────────────────────

type StoredAccount = { name: string; email: string; password: string }

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

function nextId(): number {
  const id = load<number>(KEY_NEXT_ID, 1)
  save(KEY_NEXT_ID, id + 1)
  return id
}

function loadSession(): SessionUser | null {
  return load<SessionUser | null>(KEY_SESSION, null)
}

function saveSession(user: SessionUser | null) {
  if (user) {
    save(KEY_SESSION, user)
  } else {
    localStorage.removeItem(KEY_SESSION)
  }
}

// ── context type ─────────────────────────────────────────────────────────────

type AppContextValue = {
  foods: FoodEntry[]
  exercises: ExerciseEntry[]
  routines: Routine[]
  diets: Diet[]
  totals: ReturnType<typeof foodTotals>
  sessionUser: SessionUser | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<RegisterResult>
  logout: () => void
  addFood: (food: NewFoodEntry) => void
  addExercise: (exercise: NewExerciseEntry) => void
  createDiet: (diet: NewDiet) => void
  deleteDiet: (id: number) => void
  addFoodToDiet: (dietId: number, food: NewFoodEntry) => void
  createRoutine: (routine: NewRoutine) => void
  deleteRoutine: (id: number) => void
  addExerciseToRoutine: (routineId: number, exercise: NewExerciseEntry) => void
}

const AppContext = createContext<AppContextValue | null>(null)

// ── provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [foods, setFoods] = useState<FoodEntry[]>(() =>
    load<FoodEntry[]>(KEY_FOODS, []),
  )
  const [exercises, setExercises] = useState<ExerciseEntry[]>(() =>
    load<ExerciseEntry[]>(KEY_EXERCISES, []),
  )
  const [routines, setRoutines] = useState<Routine[]>(() =>
    load<Routine[]>(KEY_ROUTINES, []),
  )
  const [diets, setDiets] = useState<Diet[]>(() =>
    load<Diet[]>(KEY_DIETS, []),
  )
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(loadSession)

  // ── auth ────────────────────────────────────────────────────────────────

  const login = useCallback(async (email: string, password: string) => {
    const accounts = load<StoredAccount[]>(KEY_ACCOUNTS, [])
    const match = accounts.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password,
    )

    if (!match) return false

    const user: SessionUser = { name: match.name, email: match.email }
    saveSession(user)
    setSessionUser(user)
    return true
  }, [])

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<RegisterResult> => {
      const accounts = load<StoredAccount[]>(KEY_ACCOUNTS, [])
      const exists = accounts.some(
        (a) => a.email.toLowerCase() === email.trim().toLowerCase(),
      )

      if (exists) return { ok: false, message: 'Ese correo ya esta registrado.' }
      if (password.length < 6) return { ok: false, message: 'La contrasena debe tener al menos 6 caracteres.' }

      const normalizedName = name.trim() || email.trim().split('@')[0]
      save(KEY_ACCOUNTS, [...accounts, { name: normalizedName, email: email.trim(), password }])

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

  // ── foods ───────────────────────────────────────────────────────────────

  const addFood = useCallback((food: NewFoodEntry) => {
    const entry: FoodEntry = { ...food, id: nextId() }
    setFoods((prev) => {
      const next = [entry, ...prev]
      save(KEY_FOODS, next)
      return next
    })
  }, [])

  // ── exercises ───────────────────────────────────────────────────────────

  const addExercise = useCallback((exercise: NewExerciseEntry) => {
    const entry: ExerciseEntry = { ...exercise, id: nextId() }
    setExercises((prev) => {
      const next = [entry, ...prev]
      save(KEY_EXERCISES, next)
      return next
    })
  }, [])

  // ── diets ───────────────────────────────────────────────────────────────

  const createDiet = useCallback((diet: NewDiet) => {
    const entry: Diet = { ...diet, id: nextId(), foods: [] }
    setDiets((prev) => {
      const next = [entry, ...prev]
      save(KEY_DIETS, next)
      return next
    })
  }, [])

  const deleteDiet = useCallback((id: number) => {
    setDiets((prev) => {
      const next = prev.filter((d) => d.id !== id)
      save(KEY_DIETS, next)
      return next
    })
  }, [])

  const addFoodToDiet = useCallback((dietId: number, food: NewFoodEntry) => {
    const entry: FoodEntry = { ...food, id: nextId() }
    setDiets((prev) => {
      const next = prev.map((d) =>
        d.id === dietId ? { ...d, foods: [...d.foods, entry] } : d,
      )
      save(KEY_DIETS, next)
      return next
    })
  }, [])

  // ── routines ─────────────────────────────────────────────────────────────

  const createRoutine = useCallback((routine: NewRoutine) => {
    const entry: Routine = { ...routine, id: nextId(), exercises: [] }
    setRoutines((prev) => {
      const next = [entry, ...prev]
      save(KEY_ROUTINES, next)
      return next
    })
  }, [])

  const deleteRoutine = useCallback((id: number) => {
    setRoutines((prev) => {
      const next = prev.filter((r) => r.id !== id)
      save(KEY_ROUTINES, next)
      return next
    })
  }, [])

  const addExerciseToRoutine = useCallback((routineId: number, exercise: NewExerciseEntry) => {
    const entry: ExerciseEntry = { ...exercise, id: nextId() }
    setRoutines((prev) => {
      const next = prev.map((r) =>
        r.id === routineId ? { ...r, exercises: [...r.exercises, entry] } : r,
      )
      save(KEY_ROUTINES, next)
      return next
    })
  }, [])

  // ── value ────────────────────────────────────────────────────────────────

  const totals = useMemo(() => foodTotals(foods), [foods])

  const value = useMemo<AppContextValue>(
    () => ({
      foods,
      exercises,
      routines,
      diets,
      totals,
      sessionUser,
      login,
      register,
      logout,
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
      sessionUser,
      login,
      register,
      logout,
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
  if (!context) throw new Error('useAppContext debe usarse dentro de AppProvider')
  return context
}
