import { axiosInstanceBackend_AI_Ejercicios } from '../AxiosConfig';
import type {
    TemaCreate,
    TemaUpdate,
    TemaResponse,
    EnrollResponse,
    UnenrollResponse,
    UsuarioResponse,
    UsuarioTemaUpdate
} from '../types';

export class TemasService {
    async crearTema(data: TemaCreate, token: string): Promise<TemaResponse> {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            };

            const response = await axiosInstanceBackend_AI_Ejercicios.post('/temas', data, config);

            return response.data; 
        } catch (error) {
            console.error('Error al crear tema:', error);
            throw error;
        }
    }

    async obtenerTemas(skip: number = 0, limit: number = 100, token: string): Promise<TemaResponse[]> {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            };

            const response = await axiosInstanceBackend_AI_Ejercicios.get(`/temas?skip=${skip}&limit=${limit}`, config);

            return response.data;
        } catch (error) {
            console.error('Error al obtener los temas:', error);
            throw error;
        }
    }

    async obtenerTemaPorId(tema_id: string, token: string): Promise<TemaResponse> {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            };

            const response = await axiosInstanceBackend_AI_Ejercicios.get(`/temas/${tema_id}`, config);

            return response.data;
        } catch (error) {
            console.error('Error al obtener el tema por ID:', error);
            throw error;
        }
    }

    async actualizarTema(tema_id: string, data: TemaUpdate, token: string): Promise<TemaResponse> {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            };

            const response = await axiosInstanceBackend_AI_Ejercicios.put(`/temas/${tema_id}`, data, config);

            return response.data;
        } catch (error) {
            console.error('Error al actualizar el tema:', error);
            throw error;
        }
    }

    async eliminarTema(tema_id: string, token: string): Promise<{ mensaje: string, tema_id: string, tema_nombre: string }> {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            };

            const response = await axiosInstanceBackend_AI_Ejercicios.delete(`/temas/${tema_id}`, config);

            return response.data;
        } catch (error) {
            console.error('Error al eliminar el tema:', error);
            throw error;
        }
    }






    async enrollAlumnoEnTema(tema_id: string, alumno_id: string, token: string): Promise<EnrollResponse> {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            };

            const response = await axiosInstanceBackend_AI_Ejercicios.post('/alumnos/enroll_alumno_tema',
                { tema_id, alumno_id }, config);

            return response.data;
        } catch (error) {
            console.error('Error al inscribir al alumno en el tema:', error);
            throw error;
        }
    }

    async unenrollAlumnoDeTema(tema_id: string, alumno_id: string, token: string): Promise<UnenrollResponse> {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            };

            const response = await axiosInstanceBackend_AI_Ejercicios.post('/alumnos/unenroll_alumno_tema',
                { tema_id, alumno_id }, config);

            return response.data;
        } catch (error) {
            console.error('Error al desinscribir al alumno del tema:', error);
            throw error;
        }
    }

    async obtenerUsuarioPorId(usuario_id: string, token: string) {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            };

            const response = await axiosInstanceBackend_AI_Ejercicios.get(`/alumnos/${usuario_id}`, config);

            return response.data;
        } catch (error) {
            console.error('Error al obtener el usuario por ID:', error);
            throw error;
        }
    }


    async actualizarTemaDeUsuario(
        usuario_id: string,
        tema_id: string,
        data: UsuarioTemaUpdate,
        token: string
    ): Promise<UsuarioResponse> {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            };
            const response = await axiosInstanceBackend_AI_Ejercicios.put(
                `/alumnos/${usuario_id}/temas/${tema_id}`,
                data,
                config
            );
            return response.data;
        } catch (error) {
            console.error('Error al actualizar el tema del usuario:', error);
            throw error;
        }
    }




}

export const temasService = new TemasService();
