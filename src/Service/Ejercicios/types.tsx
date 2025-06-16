export type Nivel = "facil" | "medio" | "dificil";

export interface ejercicioCreate {
  pregunta: string;
  respuesta_correcta?: string;
  es_multiple_choice?: boolean;
  opciones?: string[] | null;
  solucion?: string[] | null;
  pistas?: string[] | null;
  concepto_principal?: string | null;
  nivel: Nivel;
}
export interface ejercicio extends ejercicioCreate {
    _id: string;
}

export interface ejercicioNivel{
    facil: ejercicio[];
    medio: ejercicio[];
    dificil: ejercicio[];
}

export interface TotalesPorNivel {
  facil: number;
  medio: number;
  dificil: number;
}

export interface EjerciciosSubtemaResponse {
  ejercicios: ejercicioNivel;
  total_ejercicios_por_subtema: number;
  total_por_nivel: TotalesPorNivel;
}