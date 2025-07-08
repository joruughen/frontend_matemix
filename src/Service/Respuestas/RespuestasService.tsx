import { axiosInstanceBackend_AI_Ejercicios } from '../AxiosConfig';
import type { Respuesta } from '../types';

export class RespuestasService {

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
            return response.data;
        } catch (error) {
            console.error('Error al guardar la respuesta:', error);
            throw error;
        }
    }

    async obtenerRespuesta(alumno_id: string, pregunta_id: string, token: string): Promise<Respuesta> {
        try {
            const response = await axiosInstanceBackend_AI_Ejercicios.get('/respuestas/respuesta', {
                params: { alumno_id, pregunta_id, token },
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener la respuesta:', error);
            throw error;
        }
    }

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
            return response.data;
        } catch (error) {
            console.error('Error al actualizar la respuesta:', error);
            throw error;
        }
    }

    async eliminarRespuesta(alumno_id: string, pregunta_id: string, token: string) {
        try {
            const response = await axiosInstanceBackend_AI_Ejercicios.delete(
                '/respuestas/eliminar_respuesta',
                {
                    data: { alumno_id, pregunta_id, token }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error al eliminar la respuesta:', error);
            throw error;
        }
    }

    async obtenerRespuestasCorrectas(tema_id: string, nivel?: string): Promise<Respuesta[]> {
        try {
            const params: { tema_id: string; nivel?: string } = { tema_id };

            if (nivel) {
                params.nivel = nivel;
            }

            const response = await axiosInstanceBackend_AI_Ejercicios.get('/respuestas/respuestas_correctas', {
                params: params
            });

            return response.data;
        } catch (error) {
            console.error('Error al obtener las respuestas correctas:', error);
            throw error;
        }
    }
}

export const respuestasService = new RespuestasService();
