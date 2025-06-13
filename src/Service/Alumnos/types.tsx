

export interface AlumnoRegisterRequestDTO {
    nombre: string;
    apellido: string;
    dni: string;
}

export interface AlumnoRegisterResponse{
    nombre: string;
    apellido: string;
    dni: string;
    username: string;
    contraseña: string;
    id:string;
}

export interface AlumnosDTO{
    id: string;
    nombre: string;
    apellido: string;
    dni: string;
    username: string;
}