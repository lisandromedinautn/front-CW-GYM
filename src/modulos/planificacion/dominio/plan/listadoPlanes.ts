/** RN-PLAN-22: tipos del listado de planes del profesor (GET /planificacion/planes). */

/** RN-PLAN-15: estado del plan según la fecha del reloj del back. */
export type EstadoPlan = 'proximo' | 'vigente' | 'finalizado';

export const ESTADOS_DEL_PLAN: { valor: EstadoPlan; etiqueta: string }[] = [
  { valor: 'proximo', etiqueta: 'Próximo' },
  { valor: 'vigente', etiqueta: 'Vigente' },
  { valor: 'finalizado', etiqueta: 'Finalizado' },
];

/** Un plan del listado (back: ResumenPlan). */
export interface ResumenPlan {
  id: string;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoPlan;
  alumnoIds: string[];
  diasConRutina: number;
  diasDeDescanso: number;
}

/** Filtros del listado (RN-UI-LIS-01 a 04). Cadena vacía = sin filtro. */
export interface FiltrosPlanes {
  estado: EstadoPlan | '';
  alumnoId: string;
  inicioDesde: string;
  inicioHasta: string;
}

export const SIN_FILTROS_PLANES: FiltrosPlanes = {
  estado: '',
  alumnoId: '',
  inicioDesde: '',
  inicioHasta: '',
};

/** `AAAA-MM-DD` como `dd/mm/aaaa`. */
export function fechaConBarras(fecha: string): string {
  return `${fecha.slice(8, 10)}/${fecha.slice(5, 7)}/${fecha.slice(0, 4)}`;
}

export function etiquetaDeEstado(estado: EstadoPlan): string {
  return ESTADOS_DEL_PLAN.find((e) => e.valor === estado)?.etiqueta ?? estado;
}
