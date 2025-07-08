export type User = {
    id: string;
    nombre: string;
    username: string;
    fecha_registro: string;
};

export type UserLogin = {
    username: string;
    password: string;
}

export type UserRegister = {
    nombre: string;
    username: string;
    password: string;
};



export interface Pregunta {
    id: string;
    pregunta: string;
    respuesta_correcta: string;
    es_multiple_choice: boolean;
    opciones?: string[];
    explicacion?: string;
}

export interface Nivel {
    nivel: "facil" | "medio" | "dificil";
    preguntas: Pregunta[];
}

export interface TemaCreate {
    nombre: string;
    descripcion?: string;
    niveles: Nivel[];
    puntos?: number;
    cantidad_problemas?: number;
}

export interface TemaUpdate {
    nombre?: string;
    descripcion?: string;
    niveles?: Nivel[];
    puntos?: number;
    cantidad_problemas?: number;
}

export interface TemaResponse {
    id: string;
    nombre: string;
    descripcion?: string;
    niveles: Nivel[];
    fecha_creacion: string;
    puntos?: number;
    cantidad_problemas?: number;
}


export interface EnrollResponse {
    status: string;
    message: string;
    alumno_id: string;
    tema: string;
    enrolled_by: string;
    enrolled_by_role: string;
}

export interface UnenrollResponse {
    status: string;
    message: string;
    alumno_id: string;
    tema: string;
    unenrolled_by: string;
    unenrolled_by_role: string;
}

export interface AlumnoTema  {
    id: string;
}

export interface UsuarioResponse {
    usuario: {
        _id: string;
        alumno_id: string;
        tema_id: string;
        temas: Array<{
            id: string;
            nombre: string;
            nivel: string;
        }>;
    };
}
export interface UsuarioTemaUpdate {
    nombre: string;
    nivel: string;
}




export interface Respuesta {
    id: string;     
    alumno_id: string;   
    tema_id: string;  
    pregunta_id: string;   
    respuesta: string;   
    respuesta_correcta: boolean;
    fecha_respuesta: string; 
}

export interface RespuestaCorrecta {
    alumno_id: string;
    tema_id: string;
    pregunta_id: string;
    respuesta: string;
    respuesta_correcta: boolean;
    fecha_respuesta: string;
    id: string;
}


export interface PreguntaCreate {
    pregunta: string;
    respuesta_correcta: string;
    es_multiple_choice: boolean;
    opciones: string[];
    pista: string;
    concepto_principal: string;
}

export interface PreguntaUpdate {
    pregunta?: string;
    respuesta_correcta?: string;
    es_multiple_choice?: boolean;
    opciones?: string[];
    pista?: string;
    concepto_principal?: string;
}

export interface PreguntaResponse {
    id: string;
    pregunta: string;
    respuesta_correcta: string;
    es_multiple_choice: boolean;
    opciones: string[];
    pista: string;
    concepto_principal: string;
}

