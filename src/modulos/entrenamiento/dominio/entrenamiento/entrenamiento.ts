/** Campos del entrenamiento que usa la UI en US13. */
export interface Entrenamiento {
  id: string;
  inicio: string;
  rutina: { nombre: string };
  fin?: string;
  resumen?: ResumenEntrenamiento;
}

export type ResultadoEntrenamiento =
  | { estado: 'sin-entrenamiento' }
  | { estado: 'en-curso' | 'abandonado' | 'finalizado'; entrenamiento: Entrenamiento };

export interface ResumenEntrenamiento {
  volumenKg: number;
  duracionSegundos: number;
  gruposMusculares: string[];
}
