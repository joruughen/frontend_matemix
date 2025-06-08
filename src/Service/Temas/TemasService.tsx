import { axiosInstanceBackend_AI_Ejercicios } from '../AxiosConfig';  // Asegúrate de que axios esté correctamente configurado
import type { TemaCreate, TemaUpdate, TemaResponse, EnrollResponse, UnenrollResponse } from '../types'; // Los tipos de datos de los temas

export class TemasService {
    // **Método POST** para crear un tema
    async crearTema(data: TemaCreate, token: string): Promise<TemaResponse> {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Incluir el token en los headers
                    'Content-Type': 'application/json',  // Tipo de contenido
                }
            };

            // Realizamos la solicitud POST para crear un nuevo tema
            const response = await axiosInstanceBackend_AI_Ejercicios.post('/temas', data, config);

            return response.data;  // Devuelve la respuesta del backend
        } catch (error) {
            console.error('Error al crear tema:', error);
            throw error;
        }
    }

    // **Método GET** para obtener todos los temas
    async obtenerTemas(skip: number = 0, limit: number = 100, token: string): Promise<TemaResponse[]> {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            };

            // Realizamos la solicitud GET para obtener todos los temas con paginación
            const response = await axiosInstanceBackend_AI_Ejercicios.get(`/temas?skip=${skip}&limit=${limit}`, config);

            return response.data;  // Devuelve la respuesta del backend
        } catch (error) {
            console.error('Error al obtener los temas:', error);
            throw error;
        }
    }

    // **Método GET** para obtener un tema por ID
    async obtenerTemaPorId(tema_id: string, token: string): Promise<TemaResponse> {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            };

            // Realizamos la solicitud GET para obtener un tema específico
            const response = await axiosInstanceBackend_AI_Ejercicios.get(`/temas/${tema_id}`, config);

            return response.data;  // Devuelve la respuesta del backend
        } catch (error) {
            console.error('Error al obtener el tema por ID:', error);
            throw error;
        }
    }

    // **Método PUT** para actualizar un tema
    async actualizarTema(tema_id: string, data: TemaUpdate, token: string): Promise<TemaResponse> {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            };

            // Realizamos la solicitud PUT para actualizar un tema
            const response = await axiosInstanceBackend_AI_Ejercicios.put(`/temas/${tema_id}`, data, config);

            return response.data;  // Devuelve la respuesta del backend
        } catch (error) {
            console.error('Error al actualizar el tema:', error);
            throw error;
        }
    }

    // **Método DELETE** para eliminar un tema
    async eliminarTema(tema_id: string, token: string): Promise<{ mensaje: string, tema_id: string, tema_nombre: string }> {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            };

            // Realizamos la solicitud DELETE para eliminar un tema
            const response = await axiosInstanceBackend_AI_Ejercicios.delete(`/temas/${tema_id}`, config);

            return response.data;  // Devuelve la respuesta del backend
        } catch (error) {
            console.error('Error al eliminar el tema:', error);
            throw error;
        }
    }






    async enrollAlumnoEnTema(tema_id: string, alumno_id: string, token: string): Promise<EnrollResponse> {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Incluir el token en los headers
                    'Content-Type': 'application/json',  // Tipo de contenido
                }
            };

            // Realizamos la solicitud POST para inscribir a un alumno en un tema
            const response = await axiosInstanceBackend_AI_Ejercicios.post('/alumnos/enroll_alumno_tema',
                { tema_id, alumno_id }, config);

            return response.data;  // Devuelve la respuesta del backend
        } catch (error) {
            console.error('Error al inscribir al alumno en el tema:', error);
            throw error;
        }
    }

    // **Método POST** para desinscribir a un alumno de un tema
    async unenrollAlumnoDeTema(tema_id: string, alumno_id: string, token: string): Promise<UnenrollResponse> {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`, // Incluir el token en los headers
                    'Content-Type': 'application/json',  // Tipo de contenido
                }
            };

            // Realizamos la solicitud POST para desinscribir al alumno de un tema
            const response = await axiosInstanceBackend_AI_Ejercicios.post('/alumnos/unenroll_alumno_tema',
                { tema_id, alumno_id }, config);

            return response.data;  // Devuelve la respuesta del backend
        } catch (error) {
            console.error('Error al desinscribir al alumno del tema:', error);
            throw error;
        }
    }

    // **Método GET** para obtener la información de un usuario por su ID
    async obtenerUsuarioPorId(usuario_id: string, token: string) {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`, // Incluir el token en los headers
                    'Content-Type': 'application/json',  // Tipo de contenido
                }
            };

            // Realizamos la solicitud GET para obtener un usuario específico por su ID
            const response = await axiosInstanceBackend_AI_Ejercicios.get(`/alumnos/${usuario_id}`, config);

            return response.data;  // Devuelve la respuesta del backend
        } catch (error) {
            console.error('Error al obtener el usuario por ID:', error);
            throw error;
        }
    }




}

export const temasService = new TemasService();  // Instancia de temasService
