export const MAXIMO_NOMBRE_RUTINA = 60;

/** RN-PLAN-21: de 1 a 60 caracteres sin contar los espacios de los extremos. Devuelve el aviso o `null`. */
export function validarNombreRutina(texto: string): string | null {
  const nombre = texto.trim();
  if (nombre.length === 0) return 'Completá el nombre';
  if (nombre.length > MAXIMO_NOMBRE_RUTINA) return `Máximo ${MAXIMO_NOMBRE_RUTINA} caracteres`;
  return null;
}
