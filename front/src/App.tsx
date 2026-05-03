import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

import Layout from './components/Layout'
import { AppProvider, useAppContext } from './context/AppContext'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import NutritionPage from './pages/NutritionPage'
import TrainingPage from './pages/TrainingPage'
import UserPage from './pages/UserPage'
import { appRoutes } from './utils/routes'

function AppRoutes() {
  const { isBootstrapping, sessionUser, logout } = useAppContext()

  if (isBootstrapping) {
    return (
      <main className="page-shell">
        <section className="module-card user-card">
          <p className="eyebrow">Preparando datos</p>
          <h2>Cargando el dashboard desde la API</h2>
          <p>El frontend espera la respuesta inicial del backend para hidratar el estado global.</p>
        </section>
      </main>
    )
  }

  return (
    <Routes>
      <Route element={<Layout sessionUser={sessionUser} onLogout={logout} />}>
        <Route path={appRoutes.home} element={<HomePage />} />
        <Route
          path={appRoutes.nutrition}
          element={sessionUser ? <NutritionPage /> : <Navigate to={appRoutes.user} replace />}
        />
        <Route
          path={appRoutes.training}
          element={sessionUser ? <TrainingPage /> : <Navigate to={appRoutes.user} replace />}
        />
        <Route path={appRoutes.user} element={<UserPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  )
}
