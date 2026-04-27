import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

import type { FoodEntry, ExerciseEntry, Routine, Diet } from './types'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import NutritionPage from './pages/NutritionPage'
import TrainingPage from './pages/TrainingPage'
import UserPage from './pages/UserPage'

type AuthAccount = {
  id: number
  name: string
  email: string
  password: string
}

type AuthSessionUser = {
  name: string
  email: string
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

const initialFoods: FoodEntry[] = [
  { id: 1, name: 'Yogur proteico', calories: 154, protein: 20, carbs: 9, fats: 3 },
  { id: 2, name: 'Arroz con pollo', calories: 620, protein: 43, carbs: 74, fats: 15 },
]

const initialExercises: ExerciseEntry[] = [
  { id: 1, name: 'Sentadilla trasera', sets: 5, reps: 5, intensity: 82 },
  { id: 2, name: 'Press banca', sets: 4, reps: 6, intensity: 78 },
]

const initialRoutines: Routine[] = [
  {
    id: 1,
    name: 'Fuerza base',
    exercises: [
      { id: 11, name: 'Sentadilla', sets: 5, reps: 5, intensity: 80 },
      { id: 12, name: 'Peso muerto', sets: 3, reps: 5, intensity: 85 },
    ],
  },
]

const initialDiets: Diet[] = [
  {
    id: 1,
    name: 'Volumen limpio',
    targetCalories: 2800,
    foods: [
      { id: 21, name: 'Avena con platano', calories: 380, protein: 12, carbs: 68, fats: 8 },
      { id: 22, name: 'Pollo con arroz', calories: 620, protein: 48, carbs: 72, fats: 14 },
    ],
  },
]

export default function App() {
  const [foods, setFoods] = useState<FoodEntry[]>(initialFoods)
  const [exercises, setExercises] = useState<ExerciseEntry[]>(initialExercises)
  const [routines, setRoutines] = useState<Routine[]>(initialRoutines)
  const [diets, setDiets] = useState<Diet[]>(initialDiets)
  const [accounts, setAccounts] = useState<AuthAccount[]>(() => {
    const raw = localStorage.getItem(AUTH_USERS_KEY)
    if (!raw) {
      return defaultAccounts
    }

    try {
      const parsed = JSON.parse(raw) as AuthAccount[]
      return parsed.length > 0 ? parsed : defaultAccounts
    } catch {
      return defaultAccounts
    }
  })
  const [sessionUser, setSessionUser] = useState<AuthSessionUser | null>(() => {
    const raw = localStorage.getItem(AUTH_SESSION_KEY)
    if (!raw) {
      return null
    }

    try {
      return JSON.parse(raw) as AuthSessionUser
    } catch {
      return null
    }
  })

  useEffect(() => {
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(accounts))
  }, [accounts])

  useEffect(() => {
    if (!sessionUser) {
      localStorage.removeItem(AUTH_SESSION_KEY)
      return
    }

    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionUser))
  }, [sessionUser])

  function handleLogin(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase()
    const account = accounts.find(
      (candidate) => candidate.email.toLowerCase() === normalizedEmail && candidate.password === password,
    )

    if (!account) {
      return false
    }

    setSessionUser({ name: account.name, email: account.email })
    return true
  }

  function handleRegister(name: string, email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase()
    const duplicated = accounts.some((candidate) => candidate.email.toLowerCase() === normalizedEmail)

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
  }

  function handleLogout() {
    setSessionUser(null)
  }

  const shared = { foods, exercises, routines, diets }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout sessionUser={sessionUser} onLogout={handleLogout} />}>
          <Route path="/" element={<HomePage {...shared} />} />
          <Route
            path="/nutricion"
            element={
              sessionUser ? (
                <NutritionPage foods={foods} setFoods={setFoods} diets={diets} setDiets={setDiets} />
              ) : (
                <Navigate to="/usuario" replace />
              )
            }
          />
          <Route
            path="/entrenamientos"
            element={
              sessionUser ? (
                <TrainingPage
                  exercises={exercises}
                  setExercises={setExercises}
                  routines={routines}
                  setRoutines={setRoutines}
                />
              ) : (
                <Navigate to="/usuario" replace />
              )
            }
          />
          <Route
            path="/usuario"
            element={
              <UserPage
                {...shared}
                sessionUser={sessionUser}
                onLogin={handleLogin}
                onRegister={handleRegister}
                onLogout={handleLogout}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
