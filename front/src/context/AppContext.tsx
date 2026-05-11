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
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { auth } from '../firebase/config'
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

const KEY_FOODS    = 'tf_foods'
const KEY_EXERCISES = 'tf_exercises'
const KEY_DIETS    = 'tf_diets'
const KEY_ROUTINES = 'tf_routines'
const KEY_NEXT_ID  = 'tf_next_id'

// ── helpers ──────────────────────────────────────────────────────────────────

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

// ── Firebase User to SessionUser ─────────────────────────────────────────────

function firebaseUserToSessionUser(firebaseUser: User | null): SessionUser | null {
  if (!firebaseUser) return null
  return {
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
    email: firebaseUser.email || '',
  }
}

function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return 'Error inesperado de autenticacion. Intenta de nuevo.'
  }

  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Ese correo ya esta registrado.'
    case 'auth/invalid-email':
      return 'El correo no es valido.'
    case 'auth/weak-password':
      return 'La contrasena debe tener al menos 6 caracteres.'
    case 'auth/operation-not-allowed':
      return 'Debes habilitar Email/Password en Firebase Authentication > Sign-in method.'
    case 'auth/network-request-failed':
      return 'No hay conexion con Firebase. Revisa internet e intenta de nuevo.'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Correo o contrasena incorrectos.'
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Espera un momento y vuelve a intentar.'
    default:
      return `Error de Firebase: ${error.code}`
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
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>
  loginWithGoogle: () => Promise<{ ok: boolean; message?: string }>
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
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // ── Firebase Auth state listener ────────────────────────────────────────

  useEffect(() => {
    if (!auth) {
      setIsLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setSessionUser(firebaseUserToSessionUser(firebaseUser))
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // ── auth ────────────────────────────────────────────────────────────────

  const login = useCallback(async (email: string, password: string): Promise<{ ok: boolean; message?: string }> => {
    if (!auth) return { ok: false, message: 'Firebase no esta configurado.' }

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      return { ok: true }
    } catch (error) {
      return { ok: false, message: getAuthErrorMessage(error) }
    }
  }, [])

  const loginWithGoogle = useCallback(async (): Promise<{ ok: boolean; message?: string }> => {
    if (!auth) return { ok: false, message: 'Firebase no esta configurado.' }

    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      await signInWithPopup(auth, provider)
      return { ok: true }
    } catch (error) {
      return { ok: false, message: getAuthErrorMessage(error) }
    }
  }, [])

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<RegisterResult> => {
      if (!auth) return { ok: false, message: 'Firebase no está configurado.' }

      try {
        if (password.length < 6) {
          return { ok: false, message: 'La contrasena debe tener al menos 6 caracteres.' }
        }

        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)
        const normalizedName = name.trim()

        if (normalizedName) {
          await updateProfile(credential.user, { displayName: normalizedName })
        }

        return { ok: true }
      } catch (error: unknown) {
        return { ok: false, message: getAuthErrorMessage(error) }
      }
    },
    [],
  )

  const logout = useCallback(async () => {
    if (!auth) return

    try {
      await signOut(auth)
      setSessionUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
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
      loginWithGoogle,
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
      loginWithGoogle,
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

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Cargando...</p>
      </div>
    )
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext debe usarse dentro de AppProvider')
  return context
}
