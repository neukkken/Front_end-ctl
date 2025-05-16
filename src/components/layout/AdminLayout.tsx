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
        <div className="h-screen flex flex-col bg-[#0f172a] text-white overflow-hidden">
            {/* ✅ Header sticky */}
            <header className="h-20 px-6 flex items-center gap-4 border-b border-white/10 bg-[#060911] shadow-[0_2px_10px_rgba(0,0,0,0.3)] z-50">
                <img src={logo} alt="Logo" className="w-14 h-14" />
                <h1 className="text-[1em] font-semibold text-white tracking-wide">Administrador CTL</h1>
            </header>

            {/* ✅ Layout principal con Sidebar + Main */}
            <div className="flex flex-1 overflow-hidden">
                <div className="hidden md:flex w-80 bg-[#0f172a] border-r border-white/10 overflow-hidden">
                    <div className="flex flex-col h-[calc(100vh-5rem)] w-full">
                        <SideBar items={sideBarProps} />
                    </div>
                </div>

                {/* Main scrolleable */}
                <main
                    className="
                        flex-1
                        overflow-y-auto
                        px-6
                        pt-4
                        pb-24
                        bg-[#060911]
                    "
                >
                    <Outlet />
                </main>
            </div>

            {/* Sidebar móvil al final */}
            <div className="md:hidden">
                <SideBar items={sideBarProps} />
            </div>
        </div>
    );
};

export default AdminLayout