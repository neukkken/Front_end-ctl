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
        <button disabled={disabled} className={`font-semibold cursor-pointer ${styles} hover:bg-black transition-all hover:text-white`} onClick={onClick} type="submit">
            {icon} {text}
        </button>
    )
}