import { ReactNode, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"

interface SideBarItem {
    title: string
    icon: ReactNode
    path: string
}

interface SideBarProps {
    items: SideBarItem[]
}

export default function SideBar({ items }: SideBarProps) {
    const navigate = useNavigate()
    const location = useLocation()

    // ✅ Aquí está la referencia bien declarada
    const sidebarRef = useRef<HTMLDivElement>(null)
    const glowRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const sidebar = sidebarRef.current
        const glow = glowRef.current
        if (!sidebar || !glow) return

        const handleMouseMove = (e: MouseEvent) => {
            const rect = sidebar.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            // ✅ Actualiza solo el estilo, sin re-render
            glow.style.transform = `translate(${x - 80}px, ${y - 80}px)`
        }

        sidebar.addEventListener("mousemove", handleMouseMove)
        return () => sidebar.removeEventListener("mousemove", handleMouseMove)
    }, [])

    return (
        <aside
            ref={sidebarRef}
            className="relative w-80 h-screen bg-[#060911] border-r border-white/10 flex flex-col justify-between p-4 text-white overflow-hidden"
        >
            {/* Efecto glow optimizado */}
            <div
                ref={glowRef}
                className="pointer-events-none absolute z-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-2xl transition-transform duration-100"
                style={{ transform: "translate(-9999px, -9999px)" }}
            />

            {/* Contenido visible */}
            <div className="relative z-10">
                <nav className="flex flex-col gap-1">
                    {items.map((item, index) => {
                        const isActive = location.pathname === item.path
                        return (
                            <div
                                key={index}
                                onClick={() => navigate(item.path)}
                                className={`relative flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition-all duration-300 group
                                    ${isActive
                                        ? "bg-[#1e293b] text-cyan-400 shadow-[inset_4px_0_0_#06b6d4]"
                                        : "hover:bg-gradient-to-r from-cyan-700/10 to-transparent text-gray-400 hover:text-white"
                                    }`}
                            >
                                <div className={`${isActive ? "text-cyan-400" : "text-gray-500 group-hover:text-cyan-300"} transition-all`}>
                                    {item.icon}
                                </div>
                                <span className="text-sm font-medium">{item.title}</span>
                            </div>
                        )
                    })}
                </nav>
            </div>
        </aside>
    )
}
