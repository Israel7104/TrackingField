import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import StatusBanner from './StatusBanner'
import { useAppContext } from '../context/AppContext'

type SessionUser = {
  name: string
  email: string
}

type Props = {
  sessionUser: SessionUser | null
  onLogout: () => void
}

export default function Layout({ sessionUser, onLogout }: Props) {
  const { networkMessage, networkState, refreshData } = useAppContext()

  return (
    <>
      <Navbar sessionUser={sessionUser} onLogout={onLogout} />
      {networkState !== 'idle' && networkMessage ? (
        <StatusBanner
          status={networkState}
          message={networkMessage}
          onRetry={networkState === 'error' ? () => void refreshData() : undefined}
        />
      ) : null}
      <Outlet />
    </>
  )
}
