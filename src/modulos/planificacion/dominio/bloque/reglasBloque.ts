/** Reglas del bloque que la UI refleja antes de enviar. La fuente de verdad es el back. */
export type CampoObjetivo = 'repeticiones' | 'segundos';

/** RN-PLAN-04: "por tiempo" pide segundos; "por repeticiones", repeticiones. Nunca los dos. */
export function campoObjetivo(tipoEjercicio: string): CampoObjetivo {
  return tipoEjercicio === 'por tiempo' ? 'segundos' : 'repeticiones';
}

/** RN-PLAN-05: el peso solo se pide si el tipo de carga incluye Peso Extra (y es opcional). */
export function admitePeso(tipoCarga: string): boolean {
  return tipoCarga.includes('Peso Extra');
}

/** RN-PLAN-01: el tipo se deriva del contenido. Por ahora solo hay bloques (US06). */
export function tipoDeRutina(cantidadBloques: number): string | null {
  return cantidadBloques > 0 ? 'Bloques' : null;
}

/** RN-PLAN-02: un bloque tiene al menos una serie. */
export function seriesValidas(series: number): boolean {
  return Number.isInteger(series) && series >= 1;
}
