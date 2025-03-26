import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface SideBarItem {
    title: String,
    icon: ReactNode,
    path: string
}

interface SideBarProps {
    items: SideBarItem[];
}

export default function SideBar({items}: SideBarProps) {
    const navigate = useNavigate();

    return (
        <aside className="flex flex-col border-r-2 p-4 border-[#00000017] h-screen gap-2 bg-white">
            {
                items.map((prop, index) => (
                    <div key={index} className="w-56 flex gap-5 px-3 py-2 rounded-lg hover:bg-[#2e2e2e11] cursor-pointer" onClick={() => { navigate(prop.path) }}>
                        {prop.icon}
                        <p className="font-semibold">{prop.title}</p>
                    </div>
                ))
            }
        </aside>
    )
}