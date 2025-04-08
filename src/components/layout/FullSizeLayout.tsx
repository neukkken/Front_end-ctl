import { FC, ReactNode } from "react";

interface FullSizeLayoutProps {
    children: ReactNode,
    styles?: String
}

const FullSizeLayout: FC<FullSizeLayoutProps> = ({ children, styles }) => {
    return (
        <div className={`w-full h-screen ${styles}`}>
            {children}
        </div>
    )
}

export default FullSizeLayout;