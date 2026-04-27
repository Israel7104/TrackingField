import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { FoodEntry, ExerciseEntry, Routine, Diet } from '../types'
import { foodTotals } from '../types'
import MetricCard from '../components/MetricCard'

type SessionUser = {
  name: string
  email: string
}

type Props = {
  foods: FoodEntry[]
  exercises: ExerciseEntry[]
  routines: Routine[]
  diets: Diet[]
  sessionUser: SessionUser | null
  onLogin: (email: string, password: string) => boolean
  onRegister: (name: string, email: string, password: string) => { ok: boolean; message?: string }
  onLogout: () => void
}

export default function UserPage({
  foods,
  exercises,
  routines,
  diets,
  sessionUser,
  onLogin,
  onRegister,
  onLogout,
}: Props) {
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' })
  const [authError, setAuthError] = useState('')

  const totals = foodTotals(foods)
  const avgKcal = Math.round(totals.calories / Math.max(foods.length, 1))

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const ok = onLogin(loginForm.email, loginForm.password)
    if (!ok) {
      setAuthError('Correo o contrasena incorrectos.')
      return
    }

    setAuthError('')
    setLoginForm({ email: '', password: '' })
  }

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = onRegister(registerForm.name, registerForm.email, registerForm.password)

    if (!result.ok) {
      setAuthError(result.message ?? 'No se pudo crear la cuenta.')
      return
    }

    setAuthError('')
    setRegisterForm({ name: '', email: '', password: '' })
  }

  if (!sessionUser) {
    return (
      <main className="page-shell">
        <h1 className="page-title">Usuario</h1>

        <section className="user-auth-shell">
          <article className="user-auth-card">
            <p className="eyebrow">Acceso</p>
            <h2>Inicia sesion para guardar tus datos</h2>
            <p>
              Tu sesion habilita las secciones de dieta y entrenamientos para mantener
              tus registros en este navegador.
            </p>

            <div className="auth-tabs" role="tablist" aria-label="Opciones de acceso">
              <button
                type="button"
                className={`auth-tab${authTab === 'login' ? ' auth-tab--active' : ''}`}
                onClick={() => {
                  setAuthTab('login')
                  setAuthError('')
                }}
              >
                Iniciar sesion
              </button>
              <button
                type="button"
                className={`auth-tab${authTab === 'register' ? ' auth-tab--active' : ''}`}
                onClick={() => {
                  setAuthTab('register')
                  setAuthError('')
                }}
              >
                Crear cuenta
              </button>
            </div>

            {authTab === 'login' ? (
              <form className="auth-form" onSubmit={handleLogin}>
                <label>
                  <span>Correo</span>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(event) =>
                      setLoginForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                    placeholder="tu@correo.com"
                    required
                  />
                </label>
                <label>
                  <span>Contrasena</span>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                    }
                    placeholder="********"
                    required
                  />
                </label>
                <button type="submit" className="form-action">
                  Entrar
                </button>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleRegister}>
                <label>
                  <span>Nombre</span>
                  <input
                    type="text"
                    value={registerForm.name}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                    placeholder="Nombre visible"
                    minLength={2}
                    required
                  />
                </label>
                <label>
                  <span>Correo</span>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                    placeholder="tu@correo.com"
                    required
                  />
                </label>
                <label>
                  <span>Contrasena</span>
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({ ...prev, password: event.target.value }))
                    }
                    placeholder="Minimo 6 caracteres"
                    minLength={6}
                    required
                  />
                </label>
                <button type="submit" className="form-action">
                  Crear cuenta y entrar
                </button>
              </form>
            )}

            {authError && <p className="auth-error">{authError}</p>}

            <p className="auth-demo-note">
              Demo rapido: demo@trackingfield.app / demo1234
            </p>
          </article>
        </section>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <h1 className="page-title">Usuario</h1>

      <div className="user-session-bar">
        <p>
          Sesion iniciada como <strong>{sessionUser.name}</strong> ({sessionUser.email})
        </p>
        <button type="button" className="plan-delete-btn" onClick={onLogout}>
          Cerrar sesion
        </button>
      </div>

      <section className="metrics-strip" aria-label="Metricas del usuario">
        <MetricCard value="72.4 kg" label="Peso actual" />
        <MetricCard value={`${avgKcal} kcal`} label="Media por alimento" />
        <MetricCard value={`${foods.length + exercises.length}`} label="Registros totales hoy" />
      </section>

      <div className="inner-columns">
        <section className="inner-column">
          <h2 className="inner-section-title">Perfil</h2>
          <article className="module-card user-card">
            <span className="module-tag">Usuario</span>
            <h3>Datos del perfil</h3>
            <div className="user-snapshot">
              <div><span>Peso</span><strong>72.4 kg</strong></div>
              <div><span>Objetivo</span><strong>Ganar masa muscular</strong></div>
              <div><span>Actividad</span><strong>Alta</strong></div>
              <div><span>Kcal objetivo</span><strong>2 800 kcal / dia</strong></div>
            </div>
          </article>
        </section>

        <section className="inner-column">
          <h2 className="inner-section-title">Resumen del dia</h2>

          <article className="plan-card">
            <div className="plan-card-header">
              <div className="plan-card-title">
                <strong>Nutricion</strong>
                <span>{foods.length} alimentos registrados</span>
              </div>
              <Link
                to="/nutricion"
                className="plan-toggle-btn"
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                →
              </Link>
            </div>
            <p className="plan-macro-bar">
              {totals.calories} kcal · P {totals.protein} g · C {totals.carbs} g · G {totals.fats} g
            </p>
          </article>

          <article className="plan-card">
            <div className="plan-card-header">
              <div className="plan-card-title">
                <strong>Entrenamientos</strong>
                <span>{exercises.length} ejercicios · {routines.length} rutinas</span>
              </div>
              <Link
                to="/entrenamientos"
                className="plan-toggle-btn"
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                →
              </Link>
            </div>
            {exercises.length > 0 && (
              <ul className="plan-items-list">
                {exercises.slice(0, 3).map((ex) => (
                  <li key={ex.id}>
                    <strong>{ex.name}</strong>
                    <span>{ex.sets}×{ex.reps} · {ex.intensity}% MR</span>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="plan-card">
            <div className="plan-card-header">
              <div className="plan-card-title">
                <strong>Planes guardados</strong>
                <span>{diets.length} dietas · {routines.length} rutinas</span>
              </div>
            </div>
            <p className="plan-macro-bar">
              Accede a cada seccion para gestionar tus planes.
            </p>
          </article>
        </section>
      </div>
    </main>
  )
}
