import type { RecordBatido } from '../record-batido/record-batido.ts';
/** Medida de una serie (contrato del back, US14): repeticiones o segundos, y peso si corresponde. */
export interface MedidaSerie {
  repeticiones: number | null;
  segundos: number | null;
  pesoKg: number | null;
}

export interface EjercicioPrescripto extends MedidaSerie {
  ejercicioId: string;
  nombre: string;
  /** T14: GIF del catálogo; no está en los entrenamientos iniciados antes de T14. */
  urlGif?: string | null;
}

/** Copia independiente de la rutina que guarda el entrenamiento (RN-ENT-02). */
export interface CopiaRutina {
  nombre: string;
  bloques?: (EjercicioPrescripto & { orden: number; series: number })[];
  circuitos?: { orden: number; vueltas: number; ejercicios: EjercicioPrescripto[] }[];
}

/** Serie Realizada (RN-ENT-03): lo hecho junto a lo prescripto. `posicion` solo en circuitos. */
export interface SerieRealizada {
  orden: number;
  numero: number;
  posicion: number | null;
  ejercicioId: string;
  nombre: string;
  prescripta: MedidaSerie;
  realizada: MedidaSerie;
}

/** Lo que se envía para registrar (o corregir) una serie. */
export interface RegistroSerie {
  orden: number;
  numero: number;
  posicion?: number;
  repeticiones?: number;
  segundos?: number;
  pesoKg?: number;
}

export interface Entrenamiento {
  id: string;
  inicio: string;
  rutina: CopiaRutina;
  series?: SerieRealizada[];
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

export interface RespuestaFinalizacionEntrenamiento extends ResumenEntrenamiento {
  recordsBatidos?: RecordBatido[];
}
