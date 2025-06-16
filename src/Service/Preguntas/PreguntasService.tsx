import { axiosInstanceBackend_AI_Ejercicios } from '../AxiosConfig';
import type { PreguntaCreate, PreguntaUpdate, PreguntaResponse } from '../types';

export class PreguntasService {

    // 1. Agregar una nueva pregunta a un tema
    async agregarPregunta(
        temaId: string,
        nivel: string, // Nivel como string, por ejemplo "facil", "medio", "dificil"
        preguntaData: PreguntaCreate
    ): Promise<PreguntaResponse> {
        try {
            const response = await axiosInstanceBackend_AI_Ejercicios.post(
                `/temas/${temaId}/niveles/${nivel}/preguntas`,
                preguntaData
            );
            return response.data;
        } catch (error) {
            console.error("Error al agregar la pregunta:", error);
            throw error;
        }
    }

    // 2. Eliminar una pregunta de un tema
    async eliminarPregunta(
        temaId: string,
        nivel: string,
        preguntaId: string
    ): Promise<{ mensaje: string; pregunta_id: string; tema_id: string; nivel: string }> {
        try {
            const response = await axiosInstanceBackend_AI_Ejercicios.delete(
                `/temas/${temaId}/niveles/${nivel}/preguntas/${preguntaId}`
            );
            return response.data;
        } catch (error) {
            console.error("Error al eliminar la pregunta:", error);
            throw error;
        }
    }

    // 3. Actualizar una pregunta de un tema
    async actualizarPregunta(
        temaId: string,
        nivel: string,
        preguntaId: string,
        preguntaData: PreguntaUpdate
    ): Promise<PreguntaResponse> {
        try {
            const response = await axiosInstanceBackend_AI_Ejercicios.put(
                `/temas/${temaId}/niveles/${nivel}/preguntas/${preguntaId}`,
                preguntaData
            );
            return response.data;
        } catch (error) {
            console.error("Error al actualizar la pregunta:", error);
            throw error;
        }
    }

    // 4. Obtener todas las preguntas de un tema y nivel
    async obtenerPreguntasNivel(
        temaId: string,
        nivel: string
    ): Promise<{ tema_id: string; tema_nombre: string; nivel: string; preguntas: any[]; total_preguntas: number }> {
        try {
            const response = await axiosInstanceBackend_AI_Ejercicios.get(
                `/temas/${temaId}/niveles/${nivel}/preguntas`
            );
            return response.data;
        } catch (error) {
            console.error("Error al obtener las preguntas:", error);
            throw error;
        }
    }

    // 5. Obtener una pregunta específica de un tema y nivel
    async obtenerPreguntaEspecifica(
        temaId: string,
        nivel: string,
        preguntaId: string
    ): Promise<{ tema_id: string; tema_nombre: string; nivel: string; pregunta: any }> {
        try {
            const response = await axiosInstanceBackend_AI_Ejercicios.get(
                `/temas/${temaId}/niveles/${nivel}/preguntas/${preguntaId}`
            );
            return response.data;
        } catch (error) {
            console.error("Error al obtener la pregunta específica:", error);
            throw error;
        }
    }
}

export const preguntasService = new PreguntasService();
