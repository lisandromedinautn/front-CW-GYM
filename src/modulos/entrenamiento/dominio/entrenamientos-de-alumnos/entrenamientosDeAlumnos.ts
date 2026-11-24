import type { Entrenamiento, SerieRealizada } from '../entrenamiento/entrenamiento.ts';
import { agruparSeries, pasosDelEntrenamiento } from '../serie/filasSeries.ts';

const FORMATO = new Intl.DateTimeFormat('es-AR', {
  timeZone: 'America/Argentina/Buenos_Aires',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/** RN-UI-ENT-04: fecha y hora de inicio en hora de Argentina (dd/mm/aaaa hh:mm). */
export function fechaHora(iso: string): string {
  const partes = Object.fromEntries(
    FORMATO.formatToParts(new Date(iso)).map((parte) => [parte.type, parte.value]),
  );
  return `${partes.day}/${partes.month}/${partes.year} ${partes.hour}:${partes.minute}`;
}

/** Alumno vinculado al profesor (`GET /identidad/alumnos`), para elegir de quién ver los entrenamientos. */
export interface AlumnoVinculado {
  id: string;
  nombre: string;
  apellido: string;
}

/** US18: un entrenamiento del alumno como lo devuelve el back, con su estado. */
export interface EntrenamientoDeAlumno extends Entrenamiento {
  pesoCorporalKg: number;
  estado: string;
}

const ETIQUETAS_ESTADO: Record<string, string> = {
  'en-curso': 'En curso',
  abandonado: 'Abandonado',
  finalizado: 'Finalizado',
};

export function etiquetaDeEstado(estado: string): string {
  return ETIQUETAS_ESTADO[estado] ?? estado;
}

/** «Serie 3 · press» en un bloque; «Vuelta 2 · plancha» en un circuito. */
export function tituloDeSerie(serie: SerieRealizada): string {
  return `${serie.posicion === null ? 'Serie' : 'Vuelta'} ${serie.numero} · ${serie.nombre}`;
}

/** Las series en el orden de la rutina: por `orden`, `numero` y `posicion`. */
export function seriesEnOrden(series: SerieRealizada[]): SerieRealizada[] {
  return [...series].sort(
    (a, b) => a.orden - b.orden || a.numero - b.numero || (a.posicion ?? 0) - (b.posicion ?? 0),
  );
}

/** Cuántos pasos tiene la rutina copiada (series de bloque más ejercicios por vuelta). */
export function totalDeSeries(entrenamiento: Entrenamiento): number {
  return pasosDelEntrenamiento(agruparSeries(entrenamiento.rutina, [])).length;
}
