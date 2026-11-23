/** Medida de una serie (contrato del back, US14): repeticiones o segundos, y peso si corresponde. */
export interface MedidaSerie {
  repeticiones: number | null;
  segundos: number | null;
  pesoKg: number | null;
}

export interface EjercicioPrescripto extends MedidaSerie {
  ejercicioId: string;
  nombre: string;
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
}

export type ResultadoEntrenamiento =
  | { estado: 'sin-entrenamiento' }
  | { estado: 'en-curso' | 'abandonado'; entrenamiento: Entrenamiento };
