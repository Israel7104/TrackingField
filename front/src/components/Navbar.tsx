import { Link, useLocation } from 'react-router-dom'
import { appRoutes } from '../utils/routes'
import { useEffect, useState } from 'react'

type SessionUser = {
  name: string
  email: string
}

type Props = {
  sessionUser: SessionUser | null
  onLogout: () => void
}

const links = [
  { to: appRoutes.home, label: 'Inicio' },
  { to: appRoutes.nutrition, label: 'Dieta' },
  { to: appRoutes.training, label: 'Entrenamientos' },
  { to: appRoutes.user, label: 'Usuario' },
]

export default function Navbar({ sessionUser, onLogout }: Props) {
  const { pathname } = useLocation()
  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    document.body.classList.toggle('dark', dark)
  }, [dark])

  return (
    <nav className="app-navbar">
      <Link to="/" className="navbar-brand">
        TrackingField
      </Link>
      <div className="navbar-links">
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`navbar-link${pathname === to ? ' navbar-link--active' : ''}`}
          >
            {label}
          </Link>
        ))}

        <button
          type="button"
          aria-label={dark ? 'Modo claro' : 'Modo oscuro'}
          title={dark ? 'Modo claro' : 'Modo oscuro'}
          onClick={() => setDark((d) => !d)}
          className="navbar-logout-btn"
        >
          {dark ? '☀️' : '🌙'}
        </button>

        {sessionUser ? (
          <>
            <span className="navbar-user-pill" title={sessionUser.email}>
              {sessionUser.name}
            </span>
            <button type="button" className="navbar-logout-btn" onClick={onLogout}>
              Cerrar sesion
            </button>
          </>
        ) : (
          <Link
            to={appRoutes.user}
            className={`navbar-link${pathname === appRoutes.user ? ' navbar-link--active' : ''}`}
          >
            Iniciar sesion
          </Link>
        )}
      </div>
    </nav>
  )
}
