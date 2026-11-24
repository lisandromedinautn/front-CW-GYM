/** Reglas del circuito que la UI refleja antes de enviar. La fuente de verdad es el back. */

/** RN-PLAN-03: un circuito tiene 2 o más ejercicios. */
export function ejerciciosSuficientes(cantidad: number): boolean {
  return cantidad >= 2;
}

/** RN-PLAN-03: cada vuelta es una serie, y hay al menos una. */
export function vueltasValidas(vueltas: number): boolean {
  return Number.isInteger(vueltas) && vueltas >= 1;
}

/** RN-PLAN-20: un circuito no repite ejercicios. */
export function tieneRepetidos(ejercicioIds: string[]): boolean {
  return new Set(ejercicioIds).size !== ejercicioIds.length;
}
