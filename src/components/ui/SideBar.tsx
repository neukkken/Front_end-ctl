import { ReactNode, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useIsMobile } from "../../hooks/isMobile"

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
    const isMobile = useIsMobile()

    const sidebarRef = useRef<HTMLDivElement>(null)
    const glowRef = useRef<HTMLDivElement>(null)
    const bottomGlowRef = useRef<HTMLDivElement>(null)

    // Efecto glow para desktop
    useEffect(() => {
        const sidebar = sidebarRef.current
        const glow = glowRef.current
        if (!sidebar || !glow) return

        const handleMouseMove = (e: MouseEvent) => {
            const rect = sidebar.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            glow.style.transform = `translate(${x - 80}px, ${y - 80}px)`
        }

        sidebar.addEventListener("mousemove", handleMouseMove)
        return () => sidebar.removeEventListener("mousemove", handleMouseMove)
    }, [])

    // Efecto glow para mobile navbar
    useEffect(() => {
        const bottom = document.getElementById("bottom-navbar")
        const glow = bottomGlowRef.current
        if (!bottom || !glow) return

        const handleMouseMove = (e: MouseEvent) => {
            const rect = bottom.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            glow.style.transform = `translate(${x - 60}px, ${y - 60}px)`
        }

        bottom.addEventListener("mousemove", handleMouseMove)
        return () => bottom.removeEventListener("mousemove", handleMouseMove)
    }, [isMobile])

    // Render desktop sidebar
    if (!isMobile) {
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

    // Render mobile bottom navbar
    return (
        <nav
            id="bottom-navbar"
            className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#060911] to-transparent backdrop-blur-md border-t border-white/10 flex justify-around items-center py-3"
        >
            {/* Glow animado */}
            <div
                ref={bottomGlowRef}
                className="pointer-events-none absolute z-0 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl transition-transform duration-300 ease-out"
                style={{ transform: "translate(-9999px, -9999px)" }}
            />

            {/* Íconos sin texto, animados */}
            {items.map((item, index) => {
                const isActive = location.pathname === item.path
                return (
                    <button
                        key={index}
                        onClick={() => navigate(item.path)}
                        className={`relative z-10 flex flex-col items-center justify-center gap-1 transition-all duration-300 ease-out
                  ${isActive
                                ? "text-cyan-400 scale-110"
                                : "text-gray-400 hover:text-cyan-300 hover:scale-105"
                            }`}
                    >
                        <div
                            className={`p-2 rounded-full transition-all duration-300 ease-out
                    ${isActive ? "bg-cyan-500/10 shadow-[0_0_10px_#22d3ee]" : "hover:bg-white/5"}
                  `}
                        >
                            <div className={`transition-transform duration-200 ease-in-out ${isActive ? "scale-110" : ""}`}>
                                {item.icon}
                            </div>
                        </div>
                    </button>
                )
            })}
        </nav>
    )

}
