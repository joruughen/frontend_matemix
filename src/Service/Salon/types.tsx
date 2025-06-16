import type { AlumnosDTO } from "../Alumnos/types";
import type { ResponseTema } from "../Temas/types";

export interface SalonRequestDTO {
    seccion: string;
    grado: number;
    turno: string;
    descripcion: string;
    nombre: string;
}

export interface SalonResponse{
    nombre: string;
    id: string;
    grado: number;
    seccion: string;
    turno: string;
    cantidadAlumnos: number;
    descripcion: string;
}
export interface info {
    totalTemas: number;
    totalSubtemas: number;
}


export interface InfoOfSalonesByProfesor extends info {
    totalAlumnos: number;
    totalSalones: number;
}

export interface salonResponInfo extends info {
    nombre: string;
    id: string;
    grado: number;
    seccion: string;
    turno: string;
    descripcion: string;
    totalAlumnos: number;
}

export interface infoSalon extends salonResponInfo{
    temas: ResponseTema[];
    alumnos: AlumnosDTO[];
}
export interface temaPage extends ResponseTema{
    totalSubtemas: number;
    totalAlumnos: number;
}

export interface responseTema extends info{
    totalSalones: number;
    temas: temaPage[];
}

