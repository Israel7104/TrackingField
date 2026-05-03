import { Link } from 'react-router-dom'
import { appRoutes } from '../utils/routes'

export default function NotFoundPage() {
  return (
    <main className="page-shell">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-5 rounded-[30px] border border-white/70 bg-white/85 p-8 text-left shadow-[0_20px_60px_rgba(76,46,31,0.08)] backdrop-blur sm:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[var(--accent)]">404</p>
        <h1 className="text-5xl font-black text-[var(--text-h)] sm:text-7xl">Ruta no encontrada</h1>
        <p className="max-w-2xl text-base text-[var(--text)] sm:text-lg">
          La vista que intentabas abrir no existe o todavia no forma parte del flujo principal de TrackingField.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to={appRoutes.home}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--accent)] px-6 font-extrabold text-[#fffaf2] no-underline"
          >
            Volver al inicio
          </Link>
          <Link
            to={appRoutes.user}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(181,71,48,0.18)] bg-white px-6 font-bold text-[var(--text-h)] no-underline"
          >
            Ir al acceso
          </Link>
        </div>
      </section>
    </main>
  )
}