import { axiosInstanceBackendUsuarios } from "../AxiosConfig";
import type { SalonRequestDTO, SalonResponse } from "./types";

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

    async obtenerSalones(token: string): Promise<SalonResponse[]> {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axiosInstanceBackendUsuarios.get("/salon/profesor/my-salons", config);
            return response.data.data;
        } catch (error) {
            console.error("Error al obtener los salones:", error);
            throw error;
        }
    }

    
}

export const salonService = new SalonService();