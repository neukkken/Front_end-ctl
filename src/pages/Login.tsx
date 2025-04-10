import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const navigate = useNavigate()
    const { isAuthenticated, login, loading } = useAuth()

    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({ email: '', password: '', general: '' })

    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate('/admin/dashboard')
        }
    }, [loading, isAuthenticated, navigate])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCredentials(prev => ({ ...prev, [name]: value }))
        setErrors(prev => ({ ...prev, [name]: '', general: '' }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        let hasErrors = false
        const newErrors = { email: '', password: '', general: '' }

        if (!credentials.email) {
            newErrors.email = 'El email es requerido'
            hasErrors = true
        }

        if (!credentials.password) {
            newErrors.password = 'La contraseña es requerida'
            hasErrors = true
        }

        if (hasErrors) {
            setErrors(newErrors)
            return
        }

        try {
            const success = await login(credentials)
            if (success) navigate('/admin/contratistas')
            else setErrors({ email: '', password: '', general: 'El email y la contraseña no coinciden' })
        } catch (error: any) {
            setErrors(prev => ({ ...prev, general: error.message || 'Error al iniciar sesión' }))
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4 overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-3xl animate-slow-float"></div>
                <div className="absolute bottom-[15%] right-[10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-slow-float delay-[3000ms]"></div>
                <div className="absolute top-[10%] right-[30%] w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-2xl animate-slow-float delay-[6000ms]"></div>
            </div>

            <div className="w-full max-w-md space-y-6">
                <header className="text-center">
                    <h1 className="text-2xl font-bold text-white">Panel de Gestión CTL</h1>
                    <p className="text-sm text-cyan-400 mt-1">Ingrese sus credenciales para continuar</p>
                </header>

                <form onSubmit={handleSubmit} className="relative rounded-lg border border-cyan-500/20 bg-black/60 p-6 backdrop-blur-xl space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm text-gray-400 mb-1">EMAIL</label>
                        <div className={`flex items-center rounded-md border ${errors.email ? 'border-red-500' : 'border-cyan-500/20'} bg-black/60 px-3 py-2`}>
                            <Mail className="h-4 w-4 text-cyan-400 mr-2" />
                            <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="off"
                                value={credentials.email}
                                onChange={handleChange}
                                placeholder="correo@ejemplo.com"
                                className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500 flex items-center animate-fadeIn">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs text-gray-400 mb-1">CONTRASEÑA</label>
                        <div className={`flex items-center rounded-md border ${errors.password ? 'border-red-500' : 'border-cyan-500/20'} bg-black/60 px-3 py-2`}>
                            <Lock className="h-4 w-4 text-cyan-400 mr-2" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                id="password"
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="••••••••••••"
                                autoComplete='off'
                                className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-cyan-400 ml-2"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500 flex items-center animate-fadeIn">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {errors.general && (
                        <div className="text-sm text-red-500 bg-red-100/10 p-2 rounded flex items-center animate-fadeIn">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            {errors.general}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 py-2 text-sm font-medium text-white hover:from-cyan-400 hover:to-purple-500 transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Iniciando sesión...
                            </>
                        ) : (
                            <>Iniciar Sesión</>
                        )}
                    </button>
                </form>

                <footer className="text-center text-xs text-gray-500 mt-4">
                    © 2025 CTL · Todos los derechos reservados.
                </footer>
            </div>
        </div>
    )
}