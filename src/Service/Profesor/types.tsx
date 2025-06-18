export interface ProfesorRegisterRequestDTO {
    nombre: string;
    apellido: string;
    telefono: string;
}

export interface ResponseProfesor{
    id: string;
    nombre: string;
    apellido: string;
    password: string;
    username: string;
    telefono: string;
}