import { axiosInstanceBackend_AI_Ejercicios } from "../AxiosConfig";
import type {  ejercicio, ejercicioCreate, EjercicioResueltoCreate, ejerciciosAlumno, EjerciciosSubtemaResponse, requestEjerciciosStudent } from "./types";

const BASE_URL = "/exercises";

export class EjercicioService {
  
  async generateEjerciciosBySubtemaId(subtema_id: string, token: string): Promise<EjerciciosSubtemaResponse> {
    try {
    const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
      console.log("token", token);
      const res = await axiosInstanceBackend_AI_Ejercicios.get(`${BASE_URL}/generar/${subtema_id}`, config);
      return res.data;
    } catch (error) {
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
    async deleteEjercicio(ejercicioId: string, token: string, subtema_id:string): Promise<void> {
        try {
            await axiosInstanceBackend_AI_Ejercicios.delete(`${BASE_URL}/delete/${ejercicioId}/${subtema_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Error al eliminar el ejercicio:", error);
            throw error;
        }
    }

    async createEjericioManual(data: ejercicioCreate, token: string, subtema_id: string): Promise<ejercicio> {
        try {
            const res = await axiosInstanceBackend_AI_Ejercicios.post(`${BASE_URL}/manual/${subtema_id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (error) {
            console.error("Error al crear el ejercicio manualmente:", error);
            throw error;
        }
    }

    async getEjerciciosForStudent(re:requestEjerciciosStudent, token: string) :Promise<ejerciciosAlumno> {
        try {
            const res = await axiosInstanceBackend_AI_Ejercicios.post(`${BASE_URL}/student/info`, re, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Ejercicios obtenidos para el alumno:", res.data);
            return res.data;
        } catch (error) {
            console.error("Error al obtener ejercicios para el alumno:", error);
            throw error;
        }
    }

    async createEjercicioResuelto(data:EjercicioResueltoCreate, tema_id: string, token: string){
        try {
            const res = await axiosInstanceBackend_AI_Ejercicios.post(`${BASE_URL}/resuelto/${tema_id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (error) {
            console.error("Error al crear el ejercicio resuelto:", error);
            throw error;
        }
    }

}

export const ejercicioService = new EjercicioService();