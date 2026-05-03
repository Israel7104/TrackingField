import { Link } from 'react-router-dom'
import MetricCard from '../components/MetricCard'
import { useAppContext } from '../context/AppContext'

export default function HomePage() {
  const { foods, exercises, routines, diets, totals } = useAppContext()

  return (
    <main className="page-shell">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Nutricion, entrenamiento y progreso en un solo sitio</p>
          <h1>TrackingField convierte tus datos diarios en decisiones utiles.</h1>
          <p className="hero-text">
            Una interfaz pensada para registrar lo que comes, planificar rutinas
            con criterio y entender tu evolucion semanal sin saltar entre apps.
          </p>
          <div className="hero-actions">
            <a href="#sections" className="primary-action">
              Empezar
            </a>
          </div>
        </div>

        <div className="hero-panel" aria-label="Resumen de la aplicacion">
          <div className="panel-card panel-summary">
            <span className="panel-kicker">Dashboard de hoy</span>
            <strong>Calorias registradas</strong>
            <b>{totals.calories} kcal</b>
            <p>
              Proteina {totals.protein} g · Carbs {totals.carbs} g · Grasas {totals.fats} g
            </p>
          </div>
          <div className="panel-grid">
            <article className="panel-card accent-card">
              <span className="panel-kicker">Entreno actual</span>
              <strong>{exercises[0]?.name ?? 'Sin ejercicios todavia'}</strong>
              <p>{exercises.length} ejercicios en la sesion.</p>
            </article>
            <article className="panel-card muted-card">
              <span className="panel-kicker">Planificacion</span>
              <strong>{routines.length} rutinas · {diets.length} dietas</strong>
              <p>Accede a cada seccion para gestionar tus planes.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Metrics ──────────────────────────────────── */}
      <section className="metrics-strip" aria-label="Metricas del usuario">
        <MetricCard value={`${foods.length} alimentos`} label="Registrados hoy" />
        <MetricCard value={`${totals.calories} kcal`} label="Calorias acumuladas" />
        <MetricCard value={`${exercises.length} ejercicios`} label="Sesion actual" />
      </section>

      {/* ── Section selector ─────────────────────────── */}
      <section id="sections" className="home-sections">
        <div className="section-heading">
          <p className="eyebrow">Donde quieres ir</p>
          <h2>Elige una seccion para empezar a trabajar.</h2>
        </div>

        <div className="home-nav-grid">
          <Link to="/nutricion" className="home-nav-card nutrition-nav">
            <div className="home-nav-icon">🥗</div>
            <div className="home-nav-body">
              <strong>Dieta</strong>
              <p>Registra alimentos del dia y gestiona tus planes de alimentacion.</p>
              <span className="home-nav-stat">
                {foods.length} alimentos · {diets.length} dietas
              </span>
            </div>
            <span className="home-nav-arrow">→</span>
          </Link>

          <Link to="/entrenamientos" className="home-nav-card training-nav">
            <div className="home-nav-icon">🏋️</div>
            <div className="home-nav-body">
              <strong>Entrenamientos</strong>
              <p>Anota tu sesion de hoy y crea rutinas reutilizables.</p>
              <span className="home-nav-stat">
                {exercises.length} ejercicios · {routines.length} rutinas
              </span>
            </div>
            <span className="home-nav-arrow">→</span>
          </Link>

          <Link to="/usuario" className="home-nav-card user-nav">
            <div className="home-nav-icon">👤</div>
            <div className="home-nav-body">
              <strong>Usuario</strong>
              <p>Revisa tu progreso acumulado y los datos del perfil.</p>
              <span className="home-nav-stat">
                72.4 kg · {Math.round(totals.calories / Math.max(foods.length, 1))} kcal media
              </span>
            </div>
            <span className="home-nav-arrow">→</span>
          </Link>
        </div>
      </section>


    </main>
  )
}
