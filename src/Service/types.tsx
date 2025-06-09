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


// temas types.tsx

export interface Pregunta {
    id: string;
    pregunta: string;
    respuesta_correcta: string;
    es_multiple_choice: boolean;
    opciones?: string[];
    explicacion?: string;
}

export interface Nivel {
    nivel: "facil" | "medio" | "dificil"; // O puedes agregar más valores si es necesario
    preguntas: Pregunta[];  // Un nivel tiene una lista de preguntas
}

export interface TemaCreate {
    nombre: string;
    descripcion?: string;
    niveles: Nivel[];  // Ahora especificamos que niveles es un array de objetos de tipo Nivel
    puntos?: number;
    cantidad_problemas?: number;
}

export interface TemaUpdate {
    nombre?: string;
    descripcion?: string;
    niveles?: Nivel[];  // Lo mismo para la actualización, ahora es un array de objetos de tipo Nivel
    puntos?: number;
    cantidad_problemas?: number;
}

export interface TemaResponse {
    id: string;
    nombre: string;
    descripcion?: string;
    niveles: Nivel[];  // Lo mismo aquí, niveles es un array de objetos de tipo Nivel
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
    id: string;  // También cambiamos el tipo a string, ya que en MongoDB se almacena como string
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


// Respuestas types.tsx


export interface Respuesta {
    id: string;                  // ID único de la respuesta
    alumno_id: string;           // ID del alumno que responde
    tema_id: string;             // ID del tema al que pertenece la pregunta
    pregunta_id: string;        // ID de la pregunta a la que se responde
    respuesta: string;           // Respuesta proporcionada por el alumno
    respuesta_correcta: boolean; // Indica si la respuesta es correcta o no
    fecha_respuesta: string;     // Fecha en que el alumno respondió
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


//



// Preguntas types.

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

