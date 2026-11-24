/** US17: lo que el alumno percibió del entrenamiento finalizado. */
export interface Percepcion {
  rpe: number;
  sensacionFuerza: number;
}

export interface EntradaPercepcion {
  rpe: string;
  sensacionFuerza: string;
}

export type ErroresPercepcion = Partial<Record<keyof Percepcion, string>>;

export type ValidacionPercepcion =
  { valida: true; cuerpo: Percepcion } | { valida: false; errores: ErroresPercepcion };

/** Entero entre `minimo` y `maximo`; vacío o no numérico es inválido. */
function enteroEnRango(texto: string, minimo: number, maximo: number): number | null {
  if (texto.trim() === '') return null;
  const valor = Number(texto);
  return Number.isInteger(valor) && valor >= minimo && valor <= maximo ? valor : null;
}

/** RN-ENT-14 y RN-ENT-15 (reflejo del back): RPE entero de 1 a 10; sensación de fuerza entera de 1 a 5. */
export function validarPercepcion(entrada: EntradaPercepcion): ValidacionPercepcion {
  const rpe = enteroEnRango(entrada.rpe, 1, 10);
  const sensacionFuerza = enteroEnRango(entrada.sensacionFuerza, 1, 5);
  const errores: ErroresPercepcion = {};
  if (rpe === null) errores.rpe = 'El RPE es un entero de 1 a 10';
  if (sensacionFuerza === null) {
    errores.sensacionFuerza = 'La sensación de fuerza es un entero de 1 a 5';
  }
  if (rpe === null || sensacionFuerza === null) return { valida: false, errores };
  return { valida: true, cuerpo: { rpe, sensacionFuerza } };
}

/** «RPE: 9 · Sensación de fuerza: 2». */
export function describirPercepcion(percepcion: Percepcion): string {
  return `RPE: ${percepcion.rpe} · Sensación de fuerza: ${percepcion.sensacionFuerza}`;
}
