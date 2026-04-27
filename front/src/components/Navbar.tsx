import { Link, useLocation } from 'react-router-dom'

type SessionUser = {
  name: string
  email: string
}

type Props = {
  sessionUser: SessionUser | null
  onLogout: () => void
}

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/nutricion', label: 'Dieta' },
  { to: '/entrenamientos', label: 'Entrenamientos' },
  { to: '/usuario', label: 'Usuario' },
]

export default function Navbar({ sessionUser, onLogout }: Props) {
  const { pathname } = useLocation()

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
            to="/usuario"
            className={`navbar-link${pathname === '/usuario' ? ' navbar-link--active' : ''}`}
          >
            Iniciar sesion
          </Link>
        )}
      </div>
    </nav>
  )
}
