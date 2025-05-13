import {
    Calendar1Icon,
    HandshakeIcon,
    MapIcon,
    TruckIcon,
    TreesIcon,
    UsersIcon,
} from "lucide-react"
import SideBar from "../ui/SideBar"
import { Outlet } from "react-router-dom"
import logo from "../../assets/favicon-512x512.png";

const sideBarProps = [
    { title: "Contratistas", icon: <HandshakeIcon />, path: "/admin/contratistas" },
    { title: "Equipo", icon: <TruckIcon />, path: "/admin/equipos" },
    { title: "Operadores", icon: <UsersIcon />, path: "/admin/operadores" },
    { title: "Turnos", icon: <Calendar1Icon />, path: "/admin/turnos" },
    { title: "Ubicaciones", icon: <MapIcon />, path: "/admin/ubicaciones" },
    { title: "Especies", icon: <TreesIcon />, path: "/admin/especies" },
]

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white relative overflow-hidden">
            {/* ✅ Sidebar (una sola vez) */}
            <div className="hidden md:block fixed top-20 left-0 h-[calc(100vh-5rem)] w-80">
                <SideBar items={sideBarProps} />
            </div>

            {/* ✅ Header */}
            <header className="h-20 px-6 flex items-center gap-4 border-b border-white/10 bg-[#060911] shadow-[0_2px_10px_rgba(0,0,0,0.3)] relative">
                <img src={logo} alt="Logo" className="w-14 h-14" />
                <h1 className="text-[1em] font-semibold text-white tracking-wide">Administrador CTL</h1>
            </header>

            {/* ✅ Main content */}
            <main
                className="
                    min-h-[calc(100vh-5rem)]
                    pt-4
                    px-6
                    md:ml-80
                    pb-24
                    bg-[#060911]
                    z-0
                    relative
                    overflow-y-auto
                "
            >
                <Outlet />
            </main>

            {/* ✅ SideBar inferior móvil (solo se muestra en móvil) */}
            <div className="md:hidden">
                <SideBar items={sideBarProps} />
            </div>
        </div>
    )
}

export default AdminLayout
