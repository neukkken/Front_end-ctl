import axios from '../../axios';
import { LoginCredentials, LoginResponse, IUser } from '../../../types/auth/auth';

export const AuthService = {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            const { data } = await axios.post<LoginResponse>('/auth/users/login', credentials);
            return data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
        }
    },

    logout(): void {
        sessionStorage.removeItem('token');
    },

    async getCurrentUser(): Promise<IUser> {
        try {
            const { data } = await axios.post<IUser>('/auth/users/verify');
            return data;
        } catch (error: any) {
            throw new Error('No se pudo obtener el usuario actual');
        }
    },
};