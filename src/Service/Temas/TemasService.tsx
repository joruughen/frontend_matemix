import { axiosInstanceBackend_AI_Ejercicios } from '../AxiosConfig'; 



import type { ResponseTema, Tema, temasForStudent } from './types';

export class TemasService {
    async crearTema(data: Tema, token: string): Promise<ResponseTema> {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,  
                    'Content-Type': 'application/json',  
                }
            };

            const response = await axiosInstanceBackend_AI_Ejercicios.post('/topics', data, config);

            return response.data; 
        } catch (error) {
            console.error('Error al crear tema:', error);
            throw error;
        }
    }

    async obtenerTemas(salon_id: string, token: string): Promise<ResponseTema[]> {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            };

            const response = await axiosInstanceBackend_AI_Ejercicios.get(`/topics/${salon_id}`, config);

            return response.data;  
        } catch (error) {
            console.error('Error al obtener los temas:', error);
            throw error;
        }
    }

    async obtenerTemaPorId(tema_id: string, token: string): Promise<ResponseTema> {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            };

            const response = await axiosInstanceBackend_AI_Ejercicios.get(`/topics/topic/tema/${tema_id}`, config);

            return response.data; 
        } catch (error) {
            console.error('Error al obtener el tema por ID:', error);
            throw error;
        }
    }



    async eliminarTema(tema_id: string, token: string): Promise<{ message: string, tema_id: string }> {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            };

            const response = await axiosInstanceBackend_AI_Ejercicios.delete(`/topics/${tema_id}`, config);

            return response.data;  
        } catch (error) {
            console.error('Error al eliminar el tema:', error);
            throw error;
        }
    }
    async updateTemaOrden(tema_id:string, orden:number, token:string){
        try{
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            };

            const response = await axiosInstanceBackend_AI_Ejercicios.put(`/topics/update/orden/${tema_id}/${orden}`, config);

            return response.data;
        } catch (error) {
            console.error('Error al actualizar el orden del tema:', error);
            throw error;
        }
    }
    async getAllTemasForStudent(token:string):Promise<temasForStudent>{
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            };

            const response = await axiosInstanceBackend_AI_Ejercicios.get(`/topics/info/student`, config);

            return response.data;
        } catch (error) {
            console.error('Error al obtener todos los temas para el estudiante:', error);
            throw error;
        }
    }

}

export const temasService = new TemasService(); 
