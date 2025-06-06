import { axiosInstance } from '../AxiosConfig';
import type { UserLogin } from '../types'; // Importa el tipo de datos de login

export class AuthService {
    // Método para iniciar sesión
    async login(data: UserLogin) {
        try {
            return await axiosInstance.post('/auth/login', data);
        } catch (error) {
            console.error('Error durante el login:', error);
            throw error;
        }
    }

    // Método para verificar el token
    async verifyToken(token: string) {
        try {
            // Configuramos los headers con el Bearer Token
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Incluir el token en los headers
                    'Content-Type': 'application/json',  // Tipo de contenido, si es necesario
                }
            };

            // Hacemos la solicitud GET con el token en los headers
            const response = await axiosInstance.get('/auth/verify-token', config);

            // Devuelve la respuesta
            return response;
        } catch (error) {
            console.error('Error durante verificación del token:', error);
            throw error;
        }
    }
}

export const authService = new AuthService(); // Instancia de AuthService
