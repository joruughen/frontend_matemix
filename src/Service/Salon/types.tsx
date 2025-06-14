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
export interface InfoOfSalonesByProfesor {
   totalTemas: number;
    totalSubtemas: number;
    totalAlumnos: number;
    totalSalones: number;
}

export interface salonResponInfo {
    nombre: string;
    id: string;
    grado: number;
    seccion: string;
    turno: string;
    descripcion: string;
    totalAlumnos: number;
    totalTemas: number;
    totalSubtemas: number;
}
