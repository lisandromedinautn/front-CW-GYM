/** Campos del entrenamiento que usa la UI en US13. */
export interface Entrenamiento {
  id: string;
  inicio: string;
  rutina: { nombre: string };
}

export type ResultadoEntrenamiento =
  | { estado: 'sin-entrenamiento' }
  | { estado: 'en-curso' | 'abandonado'; entrenamiento: Entrenamiento };
