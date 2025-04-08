import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { AuthService } from '../api/services/auth/auth.service';
import { IUser, LoginCredentials } from '../types/auth/auth';

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials, remember?: boolean) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'token';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getToken = () =>
    localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY);

  const saveToken = (token: string, remember: boolean) => {
    remember
      ? localStorage.setItem(TOKEN_STORAGE_KEY, token)
      : sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  };

  const removeToken = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  const setupTokenAutoExpire = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp * 1000;
      const now = Date.now();
      const timeout = expiration - now;

      if (timeout > 0) {
        setTimeout(() => {
          logout();
        }, timeout);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Error al leer expiración del token', err);
    }
  };

  const verifyAuth = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      setupTokenAutoExpire(token);
    } catch (err) {
      removeToken();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  const login = async (
    credentials: LoginCredentials,
    remember: boolean = false
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { user: userData, token } = await AuthService.login(credentials);
      saveToken(token, remember);
      setUser(userData);
      setIsAuthenticated(true);
      setupTokenAutoExpire(token);
      return true;
    } catch (err) {
      removeToken();
      setUser(null);
      setIsAuthenticated(false);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const clearError = () => setError(null);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      loading,
      error,
      login,
      logout,
      clearError,
    }),
    [user, isAuthenticated, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}