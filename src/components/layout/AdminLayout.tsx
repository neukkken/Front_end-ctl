import { ActivityIcon, Calendar1Icon, HandshakeIcon, MapIcon, MessageSquareWarningIcon, ShieldUser, TreesIcon, TruckIcon, UsersIcon } from "lucide-react";
import SideBar from "../ui/SideBar";
import { Outlet } from "react-router-dom";

let sideBarProps = [
    {
        title: "Contratistas", icon: <HandshakeIcon />, path: "/admin/contratistas"
    },
    {
        title: "Operadores", icon: <UsersIcon />, path: "/admin/operadores"
    },
    {
        title: "Zonas", icon: <MapIcon />, path: "/admin/zonas"
    },
    {
        title: "Equipo", icon: <TruckIcon />, path: "/admin/equipo"
    },
    {
        title: "Turnos", icon: <Calendar1Icon />, path: "/admin/turnos"
    },
    {
        title: "Especies", icon: <TreesIcon />, path: "/admin/especies"
    },
    {
        title: "Actividades", icon: <ActivityIcon />, path: "/admin/actividades"
    },
    {
        title: "Reportes", icon: <MessageSquareWarningIcon />, path: "/admin/reportes"
    }
]

const AdminLayout = ({}) => {

    return (
        <div className="h-screen flex flex-col">
            <header className="h-20 bg-white shadow-md px-6 flex items-center justify-baseline z-10">
                <ShieldUser size={60} />
                <h1>Administrador CTL</h1>
            </header>
            <div className="flex flex-1 overflow-hidden">
                {/* SIDEBAR */}
                <SideBar items={sideBarProps}/>

                {/* MAIN */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    <Outlet/>
                </main>
            </div>
        </div>
    )

}

export default AdminLayout;