import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import AdminLayout from '../components/layout/AdminLayout';
// import Dashboard from '../pages/Admin/Dashboard';
import Contratista from '../pages/Admin/Contratistas/Contratistas';
import Operadores from '../pages/Admin/Operadores/Operadores';
import Ubicaciones from '../pages/Admin/Ubicaciones/Ubicaciones';
import { useAuth } from '../context/AuthContext';
import { JSX } from 'react';
import Loader from '../components/ui/Loader';
import FullSizeLayout from '../components/layout/FullSizeLayout';
import Equipos from '../pages/Admin/Equipo/Equipo';
import Especies from '../pages/Admin/Especies/Especies';
import Turnos from '../pages/Admin/Turnos/Turnos';

function AuthCheck({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <FullSizeLayout styles={"flex items-center justify-center bg-[#000]"}><Loader /></FullSizeLayout>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/admin',
    element: (
      <AuthCheck>
        <AdminLayout />
      </AuthCheck>
    ),
    children: [
      // { path: 'dashboard', element: <Dashboard /> },
      { path: 'contratistas', element: <Contratista /> },
      { path: 'operadores', element: <Operadores /> },
      { path: 'ubicaciones', element: <Ubicaciones /> },
      { path: 'equipos', element: <Equipos/> },
      { path: 'especies', element: <Especies/>},
      { path: 'turnos', element: <Turnos/>}
    ]
  },
  {
    path: '/*',
    element: <NotFound />
  }
]);