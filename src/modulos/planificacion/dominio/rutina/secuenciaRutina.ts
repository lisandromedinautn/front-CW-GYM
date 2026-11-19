/**
 * RN-PLAN-01 reflejada (US10): la rutina es una secuencia ordenada de bloques y circuitos.
 * Mueve un paso arriba o abajo el elemento en `indice`; en los extremos la deja igual.
 */
export function mover<T>(lista: readonly T[], indice: number, direccion: 'arriba' | 'abajo'): T[] {
  const destino = direccion === 'arriba' ? indice - 1 : indice + 1;
  const resultado = [...lista];
  if (destino < 0 || destino >= lista.length) return resultado;
  [resultado[indice], resultado[destino]] = [resultado[destino] as T, resultado[indice] as T];
  return resultado;
}
