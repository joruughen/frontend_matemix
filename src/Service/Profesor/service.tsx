import { axiosInstanceBackendUsuarios } from "../AxiosConfig";
import type { ProfesorRegisterRequestDTO, ResponseProfesor } from "./types";

export class ProfesorServie {
    async registrarProfesor(data: ProfesorRegisterRequestDTO, token: string): Promise<ResponseProfesor> {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axiosInstanceBackendUsuarios.post('/profesor/register', data, config);
            console.log("Respuesta del servidor:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error al registrar el profesor:", error);
            throw error;
        }
    }

}

export const profesorService = new ProfesorServie();