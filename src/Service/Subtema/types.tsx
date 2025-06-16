export interface CreateSubtema {
    titulo: string
    descripcion: string | null
    tema_id: string
    orden: number
}

export interface ListYoutubeTemasCreation {
    url:string;
    title: string;
    id: string;
    thumbnail: string;
}

export interface subtemaResponse{
    _id: string
    titulo: string
    descripcion: string | null
    video_url?: videoResponse[]
    preguntas?: Record<string, string[]>
    tema_id: string
    orden?: number
}
export interface subtemaIdeas {
    titulo: string;
    descripcion: string;
    tema: string;
}

export interface videoResponse {
    id:string;
    title: string;
    similarity: number;
    url: string;
    thumbnail: string;
    duracion?: string; 
}

export type SubtemaConVideos = { 
  id?: string, 
  titulo: string, 
  descripcion: string, 
  videos: videoResponse[] 
}