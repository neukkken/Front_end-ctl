import {
    ActivityIcon,
    Calendar1Icon,
    HandshakeIcon,
    HomeIcon,
    MapIcon,
    MessageSquareWarningIcon,
    ShieldUser,
    TreesIcon,
    TruckIcon,
    UsersIcon
} from "lucide-react"
import SideBar from "../ui/SideBar"
import { Outlet } from "react-router-dom"

const sideBarProps = [
    { title: "Contratistas", icon: <HandshakeIcon />, path: "/admin/contratistas" },
    { title: "Operadores", icon: <UsersIcon />, path: "/admin/operadores" },
    { title: "Ubicaciones", icon: <MapIcon />, path: "/admin/ubicaciones" },
    { title: "Equipo", icon: <TruckIcon />, path: "/admin/equipos" },
    { title: "Turnos", icon: <Calendar1Icon />, path: "/admin/turnos" },
    { title: "Especies", icon: <TreesIcon />, path: "/admin/especies" },
    // { title: "Reportes", icon: <MessageSquareWarningIcon />, path: "/admin/reportes" }, // Proximamente
]

const AdminLayout = () => {
    return (
        <div className="h-screen flex flex-col bg-[#0f172a] text-white animate-scaleIn">
            {/* Header con fondo oscuro y glow sutil */}
            <header className="h-20 px-6 flex items-center gap-4 border-b border-white/10 bg-[#060911] shadow-[0_2px_10px_rgba(0,0,0,0.3)] z-10">
                <img src="/favicon-512x512.png" alt="" className="w-14 h-14"/>
                <h1 className="text-[1em] font-semibold text-white tracking-wide">Administrador CTL</h1>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <SideBar items={sideBarProps} />

                {/* Main con fondo consistente */}
                <main className="flex-1 overflow-y-auto bg-[#060911] p-6 border-l border-white/5">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
