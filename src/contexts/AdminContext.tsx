import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface Admin {
  id: string
  name: string
  email: string
  role: string
  token: string
}

interface AdminContextType {
  admin: Admin | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  initializeAdmin: () => Promise<boolean>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Check for existing token on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem('admin-token')
      const adminData = localStorage.getItem('admin-data')
      
      if (token && adminData) {
        try {
          const parsedAdmin = JSON.parse(adminData)
          setAdmin({ ...parsedAdmin, token })
        } catch (error) {
          console.error('Error parsing admin data:', error)
          localStorage.removeItem('admin-token')
          localStorage.removeItem('admin-data')
        }
      }
    } catch (error) {
      // Ignore localStorage errors (might not be available in some environments)
      console.warn('localStorage not available:', error)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check credentials
      const validEmail = 'baaghinitesh@gmail.com'
      const validPassword = 'nitesh@123'
      
      if (email === validEmail && password === validPassword) {
        const adminData = {
          id: '1',
          name: 'Admin User',
          email: 'baaghinitesh@gmail.com',
          role: 'admin',
          token: 'admin-token-' + Date.now()
        }
        
        // Store token and admin data
        localStorage.setItem('admin-token', adminData.token)
        localStorage.setItem('admin-data', JSON.stringify(adminData))
        
        setAdmin(adminData)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem('admin-token')
      localStorage.removeItem('admin-data')
    } catch (error) {
      console.warn('localStorage not available:', error)
    }
    setAdmin(null)
  }

  const initializeAdmin = async (): Promise<boolean> => {
    try {
      // Simulate initialization - always return true for demo
      await new Promise(resolve => setTimeout(resolve, 500))
      return true
    } catch (error) {
      console.error('Admin initialization error:', error)
      return false
    }
  }

  const value: AdminContextType = {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    login,
    logout,
    initializeAdmin,
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}