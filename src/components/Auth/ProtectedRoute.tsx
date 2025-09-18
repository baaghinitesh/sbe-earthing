import { type ReactNode, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAdmin } from '../../contexts/AdminContext'
import LoadingSpinner from '../UI/LoadingSpinner'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, initializeAdmin } = useAdmin()
  const location = useLocation()

  useEffect(() => {
    initializeAdmin().catch(console.error)
  }, [initializeAdmin])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}