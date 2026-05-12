import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../api/client'
import MetricCard from '../components/MetricCard'
import { useAppContext } from '../context/AppContext'

type ActivityLevel = 'Baja' | 'Media' | 'Alta'

type UserProfile = {
  weight: number
  objective: string
  activity: ActivityLevel
  targetCalories: number
}

const DEFAULT_PROFILE: UserProfile = {
  weight: 72.4,
  objective: 'Ganar masa muscular',
  activity: 'Alta',
  targetCalories: 2800,
}

function UserProfileEditor({ email }: { email: string }) {
  const [profileForm, setProfileForm] = useState<UserProfile>(DEFAULT_PROFILE)
  const [profileMessage, setProfileMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true)
        const profile = await apiClient.getProfile(email)
        setProfileForm(profile)
      } catch (error) {
        console.error('Error cargando perfil:', error)
        setProfileForm(DEFAULT_PROFILE)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [email])

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextProfile = {
      ...profileForm,
      objective: profileForm.objective.trim(),
      weight: Number(profileForm.weight),
      targetCalories: Number(profileForm.targetCalories),
    }

    if (!nextProfile.objective) {
      setProfileMessage('El objetivo no puede estar vacio.')
      return
    }

    if (nextProfile.weight <= 0 || nextProfile.targetCalories <= 0) {
      setProfileMessage('Peso y kcal objetivo deben ser mayores que 0.')
      return
    }

    try {
      setIsLoading(true)
      await apiClient.setProfile(email, nextProfile)
      setProfileForm(nextProfile)
      setProfileMessage('Perfil actualizado correctamente.')
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error al guardar perfil.'
      setProfileMessage(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <article className="module-card user-card">
        <span className="module-tag">Usuario</span>
        <h3>Datos del perfil</h3>
        <p className="auth-demo-note">Cargando perfil...</p>
      </article>
    )
  }

  return (
    <article className="module-card user-card">
      <span className="module-tag">Usuario</span>
      <h3>Datos del perfil</h3>

      <form className="entry-form" onSubmit={handleProfileSubmit}>
        <div className="input-row">
          <label>
            <span>Peso (kg)</span>
            <input
              type="number"
              min={1}
              step="0.1"
              value={profileForm.weight}
              onChange={(event) => setProfileForm((prev) => ({
                ...prev,
                weight: Number(event.target.value),
              }))}
              required
            />
          </label>

          <label>
            <span>Kcal objetivo</span>
            <input
              type="number"
              min={1}
              step="1"
              value={profileForm.targetCalories}
              onChange={(event) => setProfileForm((prev) => ({
                ...prev,
                targetCalories: Number(event.target.value),
              }))}
              required
            />
          </label>
        </div>

        <label>
          <span>Objetivo</span>
          <input
            type="text"
            value={profileForm.objective}
            onChange={(event) => setProfileForm((prev) => ({
              ...prev,
              objective: event.target.value,
            }))}
            placeholder="Ejemplo: Ganar masa muscular"
            minLength={3}
            required
          />
        </label>

        <label>
          <span>Actividad</span>
          <select
            className="entry-select"
            value={profileForm.activity}
            onChange={(event) => setProfileForm((prev) => ({
              ...prev,
              activity: event.target.value as ActivityLevel,
            }))}
          >
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
        </label>

        <button type="submit" className="form-action" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar perfil'}
        </button>
      </form>

      {profileMessage && <p className="auth-demo-note">{profileMessage}</p>}

      <div className="user-snapshot">
        <div><span>Peso</span><strong>{profileForm.weight.toFixed(1)} kg</strong></div>
        <div><span>Objetivo</span><strong>{profileForm.objective}</strong></div>
        <div><span>Actividad</span><strong>{profileForm.activity}</strong></div>
        <div><span>Kcal objetivo</span><strong>{profileForm.targetCalories.toLocaleString('es-ES')} kcal / dia</strong></div>
      </div>
    </article>
  )
}

export default function UserPage() {
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' })
  const [authError, setAuthError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
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
  } = useAppContext()

  const avgKcal = Math.round(totals.calories / Math.max(foods.length, 1))

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    const result = await login(loginForm.email, loginForm.password)

    if (!result.ok) {
      setAuthError(result.message ?? 'No se pudo iniciar sesion.')
      setIsSubmitting(false)
      return
    }

    setAuthError('')
    setLoginForm({ email: '', password: '' })
    setIsSubmitting(false)
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    const result = await register(registerForm.name, registerForm.email, registerForm.password)

    if (!result.ok) {
      setAuthError(result.message ?? 'No se pudo crear la cuenta.')
      setIsSubmitting(false)
      return
    }

    setAuthError('')
    setRegisterForm({ name: '', email: '', password: '' })
    setIsSubmitting(false)
  }

  async function handleGoogleAuth() {
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    const result = await loginWithGoogle()

    if (!result.ok) {
      setAuthError(result.message ?? 'No se pudo continuar con Google.')
      setIsSubmitting(false)
      return
    }

    setAuthError('')
    setIsSubmitting(false)
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
                  {isSubmitting ? 'Entrando...' : 'Entrar'}
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
                  {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta y entrar'}
                </button>
              </form>
            )}

            <div className="auth-google-wrap">
              <p className="auth-google-separator">o continuar con</p>
              <button
                type="button"
                className="google-auth-btn"
                onClick={handleGoogleAuth}
                disabled={isSubmitting}
                aria-label="Continuar con Google"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-1.4 3.6-5.5 3.6-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.7C16.8 2.5 14.6 1.6 12 1.6 6.8 1.6 2.6 5.9 2.6 11.2S6.8 20.8 12 20.8c6.9 0 9.1-4.9 9.1-7.4 0-.5 0-.8-.1-1.2H12z"/>
                  <path fill="#34A853" d="M3.7 7.3l3.2 2.3C7.7 7.7 9.7 6.3 12 6.3c1.9 0 3.2.8 3.9 1.5l2.7-2.7C16.8 2.5 14.6 1.6 12 1.6c-3.7 0-7 2.1-8.3 5.2z"/>
                  <path fill="#FBBC05" d="M12 20.8c2.5 0 4.7-.8 6.2-2.2l-2.9-2.4c-.8.6-1.8 1-3.3 1-2.5 0-4.7-1.7-5.4-4l-3.2 2.5c1.3 3 4.4 5.1 8.6 5.1z"/>
                  <path fill="#4285F4" d="M21.1 12.2H12v3.9h5.5c-.3 1.5-1.3 2.5-2.2 3.1l2.9 2.4c1.7-1.6 2.9-4.1 2.9-7 0-.5 0-.9-.1-1.4z"/>
                </svg>
                <span>{isSubmitting ? 'Procesando...' : 'Continuar con Google'}</span>
              </button>
            </div>

            {authError && <p className="auth-error">{authError}</p>}

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
        <button type="button" className="plan-delete-btn" onClick={logout}>
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
          <UserProfileEditor key={sessionUser.email} email={sessionUser.email} />
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
