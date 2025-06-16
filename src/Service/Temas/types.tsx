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
 