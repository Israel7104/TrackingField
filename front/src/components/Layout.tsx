import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

type SessionUser = {
  name: string
  email: string
}

type Props = {
  sessionUser: SessionUser | null
  onLogout: () => void
}

export default function Layout({ sessionUser, onLogout }: Props) {
  return (
    <>
      <Navbar sessionUser={sessionUser} onLogout={onLogout} />
      <Outlet />
    </>
  )
}
