import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { AuthService } from '../api/services/auth/auth.service'
import { IUser, LoginCredentials } from '../types/auth/auth'

interface AuthContextType {
  user: IUser | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({
    user: null as IUser | null,
    isAuthenticated: false,
    loading: true,
    error: null as string | null
  })

  const verifyAuth = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token')
      if (token) {
        const userData = await AuthService.getCurrentUser()
        setState(prev => ({ ...prev, user: userData, isAuthenticated: true }))
      }
    } catch (err) {
      sessionStorage.removeItem('token')
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [])

  useEffect(() => {
    verifyAuth()
  }, [verifyAuth])

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const { user: userData, token } = await AuthService.login(credentials)
      sessionStorage.setItem('token', token)
      setState({
        user: userData,
        isAuthenticated: true,
        loading: false,
        error: null
      })
      return true
    } catch (err) {
      sessionStorage.removeItem('token')
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Error desconocido'
      }))
      return false
    }
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    setState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null
    })
  }

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }))
  }

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}