/**
 * US08: la rutina del día del alumno. Contrato de `GET /planificacion/mi-rutina-del-dia`
 * (back: `consultar-rutina-del-dia.caso-uso.ts`). Las reglas RN-PLAN viven en el back; acá solo
 * se formatean los datos para mostrarlos.
 */
import { DIAS_DEL_PLAN } from './plan.ts';

/** Un ejercicio prescripto con el nombre del catálogo resuelto por el back. */
export interface EjercicioDeLaRutina {
  ejercicioId: string;
  nombre: string;
  repeticiones: number | null;
  segundos: number | null;
  pesoKg: number | null;
}

/** Un bloque: un ejercicio con sus series y pausas (RN-PLAN-02). */
export interface BloqueDeLaRutina extends EjercicioDeLaRutina {
  series: number;
  micropausaSegundos: number;
  macropausaSegundos: number;
}

/** Un circuito: 2 o más ejercicios, vueltas y macropausa (RN-PLAN-03). */
export interface CircuitoDeLaRutina {
  vueltas: number;
  macropausaSegundos: number;
  ejercicios: EjercicioDeLaRutina[];
}

export interface RutinaDelDiaDetalle {
  id: string;
  /** RN-PLAN-21. */
  nombre: string;
  tipo: string;
  bloques: BloqueDeLaRutina[];
  circuitos: CircuitoDeLaRutina[];
}

/**
 * RN-PLAN-18: unión discriminada por `estado`. Hay plan vigente con rutina, con descanso, o no
 * hay plan vigente.
 */
export type RutinaDelDia =
  | { estado: 'rutina'; fecha: string; numeroDia: number; rutina: RutinaDelDiaDetalle }
  | { estado: 'descanso'; fecha: string; numeroDia: number }
  | { estado: 'sin-plan'; fecha: string };

/** RN-PLAN-09: "Día 1 de 28". */
export function etiquetaDelDia(numeroDia: number): string {
  return `Día ${numeroDia} de ${DIAS_DEL_PLAN}`;
}

/** RN-PLAN-04: repeticiones o tiempo, más el peso si corresponde. */
export function objetivoDeEjercicio(
  ejercicio: Pick<EjercicioDeLaRutina, 'repeticiones' | 'segundos' | 'pesoKg'>,
): string {
  const partes: string[] = [];
  if (ejercicio.repeticiones !== null) {
    partes.push(
      `${ejercicio.repeticiones} ${ejercicio.repeticiones === 1 ? 'repetición' : 'repeticiones'}`,
    );
  }
  if (ejercicio.segundos !== null) {
    partes.push(`${ejercicio.segundos} ${ejercicio.segundos === 1 ? 'segundo' : 'segundos'}`);
  }
  if (ejercicio.pesoKg !== null) partes.push(`${ejercicio.pesoKg} kg`);
  return partes.join(' · ');
}

/** "3 series × 10 repeticiones · 20 kg". */
export function resumenDeBloque(
  bloque: Pick<BloqueDeLaRutina, 'series' | 'repeticiones' | 'segundos' | 'pesoKg'>,
): string {
  const series = `${bloque.series} ${bloque.series === 1 ? 'serie' : 'series'}`;
  return `${series} × ${objetivoDeEjercicio(bloque)}`;
}
