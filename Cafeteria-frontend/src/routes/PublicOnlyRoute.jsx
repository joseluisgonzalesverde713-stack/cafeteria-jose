import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.js'
import { ROUTES } from '../config/routes.js'

function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return <Outlet />
}

export default PublicOnlyRoute
