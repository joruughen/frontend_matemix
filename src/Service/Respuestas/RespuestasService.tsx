import { axiosInstanceBackend_AI_Ejercicios } from '../AxiosConfig';  // Asegúrate de que axios esté correctamente configurado
import type { Respuesta } from '../types'; // Define el tipo adecuado en 'types'

export class RespuestasService {

    // **POST**: Guardar una respuesta
    async guardarRespuesta(
        alumno_id: string,
        tema_id: string,
        pregunta_id: string,
        respuesta: string,
        token: string
    ): Promise<Respuesta> {
        try {
            const response = await axiosInstanceBackend_AI_Ejercicios.post(
                '/respuestas/guardar_respuesta',
                { alumno_id, tema_id, pregunta_id, respuesta, token }
            );
            return response.data; // Retorna la respuesta del backend
        } catch (error) {
            console.error('Error al guardar la respuesta:', error);
            throw error;
        }
    }

    // **GET**: Obtener una respuesta específica de un alumno
    async obtenerRespuesta(alumno_id: string, pregunta_id: string, token: string): Promise<Respuesta> {
        try {
            const response = await axiosInstanceBackend_AI_Ejercicios.get('/respuestas/respuesta', {
                params: { alumno_id, pregunta_id, token },
            });
            return response.data; // Devuelve la respuesta del backend
        } catch (error) {
            console.error('Error al obtener la respuesta:', error);
            throw error;
        }
    }

    // **PUT**: Actualizar una respuesta existente
    async actualizarRespuesta(
        alumno_id: string,
        pregunta_id: string,
        nueva_respuesta: string,
        token: string
    ): Promise<Respuesta> {
        try {
            const response = await axiosInstanceBackend_AI_Ejercicios.put(
                '/respuestas/actualizar_respuesta',
                { alumno_id, pregunta_id, nueva_respuesta, token }
            );
            return response.data; // Retorna la respuesta del backend
        } catch (error) {
            console.error('Error al actualizar la respuesta:', error);
            throw error;
        }
    }

    // **DELETE**: Eliminar una respuesta existente
    async eliminarRespuesta(alumno_id: string, pregunta_id: string, token: string) {
        try {
            const response = await axiosInstanceBackend_AI_Ejercicios.delete(
                '/respuestas/eliminar_respuesta',
                {
                    data: { alumno_id, pregunta_id, token }
                }
            );
            return response.data; // Devuelve el mensaje de éxito
        } catch (error) {
            console.error('Error al eliminar la respuesta:', error);
            throw error;
        }
    }

// **GET**: Obtener todas las respuestas correctas de un tema o nivel
    async obtenerRespuestasCorrectas(tema_id: string, nivel?: string): Promise<Respuesta[]> {
        try {
            // Definir el objeto params explícitamente, sin usar 'any'
            const params: { tema_id: string; nivel?: string } = { tema_id };

            if (nivel) {
                params.nivel = nivel;  // Añadir 'nivel' solo si se proporciona
            }

            // Realizamos la solicitud GET para obtener las respuestas correctas
            const response = await axiosInstanceBackend_AI_Ejercicios.get('/respuestas/respuestas_correctas', {
                params: params // Enviamos los parámetros de manera correcta
            });

            return response.data; // Retorna las respuestas correctas del backend
        } catch (error) {
            console.error('Error al obtener las respuestas correctas:', error);
            throw error;  // Lanza el error para que el componente que lo llama pueda manejarlo
        }
    }
}

export const respuestasService = new RespuestasService();  // Instancia del servicio de respuestas
