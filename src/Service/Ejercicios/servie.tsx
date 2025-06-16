import { axiosInstanceBackend_AI_Ejercicios } from "../AxiosConfig";
import type {  ejercicio, ejercicioCreate, EjerciciosSubtemaResponse } from "./types";

const BASE_URL = "/exercises";

export class EjercicioService {
  
  async generateEjerciciosBySubtemaId(subtema_id: string, token: string): Promise<EjerciciosSubtemaResponse> {
    try{
        const res = await axiosInstanceBackend_AI_Ejercicios.get(`${BASE_URL}/generar/${subtema_id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;    
    }
    catch (error) {
        console.error("Error al generar ejercicios:", error);
        throw error;
        }
    }

    async getEjerciciosBySubtemaId(subtema_id: string, token: string): Promise<EjerciciosSubtemaResponse> {
        try {
            const res = await axiosInstanceBackend_AI_Ejercicios.get(`${BASE_URL}/${subtema_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Ejercicios obtenidos:", res.data);
            return res.data;
        } catch (error) {
            console.error("Error al obtener ejercicios por subtema:", error);
            throw error;
        }
    }

    async updateEjercicio(ejercicioId: string, data: ejercicioCreate, token: string): Promise<ejercicio> {
        try {
            const res = await axiosInstanceBackend_AI_Ejercicios.put(`${BASE_URL}/update/${ejercicioId}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return res.data;
        } catch (error) {
            console.error("Error al actualizar el ejercicio:", error);
            throw error;
        }
    }
    async deleteEjercicio(ejercicioId: string, token: string): Promise<void> {
        try {
            await axiosInstanceBackend_AI_Ejercicios.delete(`${BASE_URL}/delete/${ejercicioId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Error al eliminar el ejercicio:", error);
            throw error;
        }
    }

    async createEjericioManual(data: ejercicioCreate, token: string): Promise<ejercicio> {
        try {
            const res = await axiosInstanceBackend_AI_Ejercicios.post(`${BASE_URL}/create`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (error) {
            console.error("Error al crear el ejercicio manualmente:", error);
            throw error;
        }
    }

}

export const ejercicioService = new EjercicioService();