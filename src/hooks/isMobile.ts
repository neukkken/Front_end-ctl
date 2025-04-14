import { useEffect, useState } from "react"

export function useIsMobile(breakpoint: number = 768): boolean {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkWidth = () => {
            setIsMobile(window.innerWidth < breakpoint)
        }

        checkWidth() // Verifica en el primer render

        window.addEventListener("resize", checkWidth)
        return () => window.removeEventListener("resize", checkWidth)
    }, [breakpoint])

    return isMobile
}