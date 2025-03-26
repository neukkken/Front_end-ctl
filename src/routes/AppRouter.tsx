import Login from "../pages/Login";
import { createBrowserRouter, Navigate } from "react-router-dom";
import NotFound from "../pages/NotFound";
import AdminLayout from "../components/layout/AdminLayout";
import Contratista from "../pages/Admin/Contratistas/Contratistas";
import Operadores from "../pages/Admin/Operadores/Operadores";

export const Routes = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to={"/login"}/>
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/*",
        element: <NotFound/>
    },
    {
        path: "/admin",
        element: <AdminLayout/>,
        children: [
            { path: "contratistas", element: <Contratista/>},
            { path: "operadores", element: <Operadores/>}
        ]
    }
])