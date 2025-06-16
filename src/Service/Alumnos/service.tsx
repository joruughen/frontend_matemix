import { axiosInstanceBackendUsuarios } from "../AxiosConfig";
import type { AlumnoRegisterRequestDTO, AlumnoRegisterResponse } from "./types";


export class AlumnosService {
    async registrarAlumno(data: AlumnoRegisterRequestDTO, token: string, salonId: string): Promise<AlumnoRegisterResponse> {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axiosInstanceBackendUsuarios.post(`/alumno/register/individual/${salonId}`, data, config);
            console.log("Respuesta del servidor:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error al registrar el alumno:", error);
            throw error;
        }
    }

    async registrarAlumnosMasivos(data: FormData, token: string, salonId: string) {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
            const response = await axiosInstanceBackendUsuarios.post(`/alumno/register/${salonId}`, data, config);
            console.log("Datos enviados:", data);
            console.log("Respuesta del servidor:", response);
            return response.data;
        } catch (error) {
            console.error("Error al registrar los alumnos masivos:", error);
            throw error;
        }
    }

}

export const alumnosService = new AlumnosService();
