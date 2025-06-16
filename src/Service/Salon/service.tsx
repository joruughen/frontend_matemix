import type { AlumnosDTO } from "../Alumnos/types";
import { axiosInstanceBackendUsuarios, axiosInstanceBackend_AI_Ejercicios } from "../AxiosConfig";
import type { InfoOfSalonesByProfesor, infoSalon, responseTema, SalonRequestDTO, salonResponInfo, SalonResponse } from "./types";

export class SalonService {

    async crearSalon(data:SalonRequestDTO,  token:string): Promise<SalonResponse> {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axiosInstanceBackendUsuarios.post("/salon", data, config);
            console.log("Respuesta del servidor:", response.data);
            console.log("ID del salón creado:", response.data.id);
            return response.data.data;
            
        } catch (error) {
            console.error("Error al crear el salón:", error);
            throw error;
        }
    }

    async obtenerSalones(token: string): Promise<salonResponInfo[]> {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axiosInstanceBackend_AI_Ejercicios.get("/topics/info/salones/profesor", config);
            console.log("Respuesta del servidor:", response.data.salones);
            return response.data.salones;
        } catch (error) {
            console.error("Error al obtener los salones:", error);
            throw error;
        }
    }

    async deleteSalon(salonId: string, token: string) {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axiosInstanceBackendUsuarios.delete(`/salon/${salonId}`, config);
            console.log(`Salón con ID ${salonId} eliminado exitosamente.`);
            console.log("Respuesta del servidor:", response);
            return response;
        } catch (error) {
            console.error("Error al eliminar el salón:", error);
            throw error;
        }
    }

    async searchSalonByName(name: string, token: string): Promise<SalonResponse[]> {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axiosInstanceBackendUsuarios.get(`/salon/search/${name}`, config);
            console.log("Respuesta del servidor:", response.data);
            return response.data.data;
        } catch (error) {
            console.error("Error al buscar el salón por nombre:", error);
            throw error;
        }
    }

    async getSalonById(salonId: string, token: string): Promise<SalonResponse> {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axiosInstanceBackendUsuarios.get(`/salon/${salonId}`, config);
            console.log("Respuesta del servidor:", response.data);
            return response.data.data;
        } catch (error) {
            console.error("Error al obtener el salón por ID:", error);
            throw error;
        }
    }



    async getAlumnosBySalonId(salonId: string, token: string): Promise<AlumnosDTO[]> {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axiosInstanceBackendUsuarios.get(`/salon/alumnos/${salonId}`, config);
            console.log("Respuesta del servidor:", response.data);
            return response.data.data;
        } catch (error) {
            console.error("Error al obtener los alumnos por ID de salón:", error);
            throw error;
        }
    }

    async getInfoOfProfesorSalones(token:string): Promise<InfoOfSalonesByProfesor> {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axiosInstanceBackend_AI_Ejercicios.get("/topics/info/profesor", config);
            console.log("Respuesta del servidor:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error al obtener la información de los salones del profesor:", error);
            throw error;
        }
    }

    async getInfoSalon(salonId: string, token: string): Promise<infoSalon> {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axiosInstanceBackend_AI_Ejercicios.get(`/topics/info/salon/${salonId}`, config);
            console.log("Respuesta del servidor:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error al obtener la información del salón:", error);
            throw error;
        }
    }

    async getAllInfoOfTemas(token:string):Promise<responseTema>{
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axiosInstanceBackend_AI_Ejercicios.get("/topics/info/all", config);
            console.log("Respuesta del servidor:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error al obtener toda la información de los temas:", error);
            throw error;
        }
    }

    
}

export const salonService = new SalonService();