import { LockKeyholeIcon, MailIcon } from "lucide-react";
import FullSizeLayout from "../components/layout/FullSizeLayout";
import { PrimaryButton } from "../components/ui/buttons/Button";
import { useNavigate } from "react-router-dom";

export default function Login() {
    let navigate = useNavigate();

    return (
        <FullSizeLayout styles={"flex justify-center items-center flex-col gap-6"}>
            <header className="text-center w-[25%]">
                <h1>
                    ¡Hola, bienvenido a tu Panel de Gestión CTL!
                </h1>
                <p className="text-[#0000004d]">Ingresa tus credenciales para acceder a tu cuenta</p>
            </header>
            <form action="" className="flex flex-col w-[30%] gap-1">
                <label htmlFor="">
                    Email
                </label>
                <div className="flex border border-gray-300 bg-white placeholder-gray-500 rounded-lg items-center">
                    <span className="inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MailIcon className="h-5 w-5 text-gray-400"/>
                    </span>
                    <input type="email" name="" id="" placeholder="correo@ejemplo.com" />
                </div>
                <label htmlFor="">
                    Contraseña
                </label>
                <div className="flex border border-gray-300 bg-white placeholder-gray-500 rounded-lg items-center">
                    <span className="inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <LockKeyholeIcon className="h-5 w-5 text-gray-400"/>
                    </span>
                    <input type="password" name="" id="" placeholder="················" />
                </div>
                <PrimaryButton disabled={false} text={"Iniciar Sesión"} styles={"mt-3 h-10 rounded-[5px]"} onClick={() => { navigate('/admin') }} icon={""} />
            </form>
        </FullSizeLayout>
    )
}