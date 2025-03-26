import { ReactNode } from "react"

interface ButtonProps {
    text: string,
    styles: string
    onClick: any,
    icon: ReactNode,
    disabled?: boolean
}

export function PrimaryButton({ text, styles, onClick, icon, disabled }: ButtonProps) {
    return (
        <button disabled={disabled} className={`bg-black text-white font-semibold cursor-pointer ${styles} hover:bg-[#000000b0] transition-all`} onClick={onClick} type="submit">
            {icon} {text}
        </button>
    )
}