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