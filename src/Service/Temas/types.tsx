export interface Tema {
    nombre: string;
    descripcion: string;
    classroom_id: string;
    subtema_id?: string[];
}

export interface ResponseTema {
    _id: string;
    nombre: string;
    descripcion: string;
    classroom_id: string;
    subtema_id?: string[];
}

