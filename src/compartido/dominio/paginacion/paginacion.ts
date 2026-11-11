/** Tamaños de página válidos de todos los listados (T06). Los mismos que valida el back. */
export const TAMANIOS_PAGINA = [5, 10, 20, 50, 100] as const;

/** Respuesta paginada del back: `pagina` arranca en 1. */
export interface Pagina<T> {
  items: T[];
  total: number;
  pagina: number;
  tamanio: number;
}

/** Cantidad de páginas (al menos 1, para mostrar "Página 1 de 1" con la lista vacía). */
export function totalPaginas(pagina: Pick<Pagina<unknown>, 'total' | 'tamanio'>): number {
  return Math.max(1, Math.ceil(pagina.total / pagina.tamanio));
}
