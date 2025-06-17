export interface Tema {
    nombre: string;
    descripcion: string;
    classroom_id: string;
    subtema_id?: string[];
    orden?:number
}

export interface ResponseTema {
    _id: string;
    nombre: string;
    descripcion: string;
    classroom_id: string;
    orden?:number
    subtema_id?: string[];
}

export interface responseTemaStudent extends ResponseTema {
    cantidadSubtemas: number;

}

export interface temasForStudent {
    salon_id: string;
    temas: responseTemaStudent[];
    totalTemas: number;

}
 