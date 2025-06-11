import { axiosInstanceBackendUsuarios } from '../AxiosConfig';
import type { UserLogin } from '../types';

export class AuthService {
    async login(data: UserLogin) {
        try {
            return await axiosInstanceBackendUsuarios.post('/auth/login', data);
        } catch (error) {
            console.error('Error durante el login:', error);
            throw error;
        }
    }

    async verifyToken(token: string) {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            };

            const response = await axiosInstanceBackendUsuarios.get('/auth/verify-token', config);

            return response;
        } catch (error) {
            console.error('Error durante verificación del token:', error);
            throw error;
        }
    }
}

export const authService = new AuthService();
