import { axiosInstanceBackend_AI_Ejercicios } from "../AxiosConfig";
import type { CreateSubtema, subtemaResponse, ListYoutubeTemasCreation,subtemaIdeas, videoResponse } from "./types";

const BASE_URL = "/subtopics";

export class SubtemaService {
   async createSubtema(data: CreateSubtema, token: string) : Promise<subtemaResponse> {
    try {
      const res = await axiosInstanceBackend_AI_Ejercicios.post(`${BASE_URL}/`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
        console.error("Error al crear subtemas:", error);

      throw error;
    }
  }
  async generateSubtemasByTemaId(tema_id: string, token: string): Promise<subtemaIdeas[]> {
    try {
      const res = await axiosInstanceBackend_AI_Ejercicios.get(`${BASE_URL}/generate/${tema_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
        console.error("Error al generar subtemas:", error);

      throw error;
    }
  }

    async getSubtemasByTemaId(tema_id: string, token: string) {
        try {
        const res = await axiosInstanceBackend_AI_Ejercicios.get(`${BASE_URL}/topic/subtemas/${tema_id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
        } catch (error) {
            console.error("Error al crear subtemas:", error);

        throw error;
        }
    }

   async generateVideosBySubTemaId(subtema_id: string, token: string):Promise<videoResponse[]> {
    try {
        const res = await axiosInstanceBackend_AI_Ejercicios.get(`${BASE_URL}/generate/video/${subtema_id}`, {
        headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Respuesta de generación de videos:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error al crear subtemas:", error);

        throw error
    }
    }
    async guardarVideos(subtema_id: string, videos: ListYoutubeTemasCreation[], token: string) {
        console.log("Guardando videos:", videos);
        console.log("Subtema ID:", subtema_id);
        try {
            // Envía { videos: [...] } en vez de solo el array
            const res = await axiosInstanceBackend_AI_Ejercicios.post(
                `${BASE_URL}/videos/save/${subtema_id}`,
                { videos }, // <-- aquí el cambio
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            console.log("Respuesta al guardar videos:", res.data);
            return res.data;
        } catch (error) {
            console.error("Error al guardar videos:", error);
            throw error;
        }
    }

   async getSubtemaById(subtema_id: string, token: string) {
        console.log("Obteniendo subtema por ID:", subtema_id);    
    try {
        const res = await axiosInstanceBackend_AI_Ejercicios.get(`${BASE_URL}/${subtema_id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
        } catch (error) {
        console.error("Error al obtener subtema por ID:", error);
        throw error;
        }
    }

  
}

export const subtemaService = new SubtemaService();