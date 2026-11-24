import type { Pagina } from '../../../../compartido/dominio/paginacion/paginacion.ts';
import { pedir } from '../../../../compartido/infraestructura/cliente-http/clienteHttp.ts';
import type {
  AlumnoDelProfesor,
  DiaConsultado,
  PedidoPlan,
  PlanConDias,
  PlanCreado,
} from '../../dominio/plan/plan.ts';
import type { RutinaDelDia } from '../../dominio/plan/rutinaDelDia.ts';
import type { FiltrosPlanes, ResumenPlan } from '../../dominio/plan/listadoPlanes.ts';
import type { ResultadoMiPlan } from '../../dominio/plan/miPlan.ts';
import type {
  EjercicioParaRutina,
  PedidoRutina,
  RutinaCreada,
} from '../../dominio/rutina/rutina.ts';

/** El catálogo, reducido a lo que usa el editor de rutinas (Profesor, RN-IDE-03). */
export async function listarEjerciciosParaRutina(): Promise<EjercicioParaRutina[]> {
  const ejercicios = await pedir<EjercicioParaRutina[]>('/catalogo/ejercicios');
  return ejercicios.map(({ id, nombre, tipo, tipoCarga, urlGif }) => ({
    id,
    nombre,
    tipo,
    tipoCarga,
    urlGif,
  }));
}

/** Consulta paginada de las rutinas del profesor (RN-PLAN-08). `pagina` arranca en 1. */
export function listarRutinas(pagina: number, tamanio: number): Promise<Pagina<RutinaCreada>> {
  return pedir<Pagina<RutinaCreada>>(`/planificacion/rutinas?pagina=${pagina}&tamanio=${tamanio}`);
}

/** US06: crea una rutina por bloques. */
export function crearRutina(pedido: PedidoRutina): Promise<RutinaCreada> {
  return pedir<RutinaCreada>('/planificacion/rutinas', { metodo: 'POST', cuerpo: pedido });
}

/** US06: el detalle de una rutina propia (404 RN-PLAN-08 si es ajena). */
export function obtenerRutina(id: string): Promise<RutinaCreada> {
  return pedir<RutinaCreada>(`/planificacion/rutinas/${id}`);
}

/** US06: reemplaza el contenido de una rutina propia y conserva su id (RN-PLAN-07). */
export function editarRutina(id: string, pedido: PedidoRutina): Promise<RutinaCreada> {
  return pedir<RutinaCreada>(`/planificacion/rutinas/${id}`, { metodo: 'PUT', cuerpo: pedido });
}

/** RN-PLAN-08: crea una copia independiente de una rutina propia. */
export function importarRutina(id: string): Promise<RutinaCreada> {
  return pedir<RutinaCreada>(`/planificacion/rutinas/${id}/importacion`, { metodo: 'POST' });
}

/** US07: alumnos vinculados al profesor, los únicos que puede asignar (RN-PLAN-13). */
export function listarAlumnosDelProfesor(): Promise<AlumnoDelProfesor[]> {
  return pedir<AlumnoDelProfesor[]>('/identidad/alumnos');
}

/** US07: todas las rutinas del profesor, para elegir la de cada día del plan. */
export async function listarTodasLasRutinas(): Promise<RutinaCreada[]> {
  const tamanio = 100;
  const primera = await listarRutinas(1, tamanio);
  const rutinas = [...primera.items];
  for (let pagina = 2; rutinas.length < primera.total; pagina += 1) {
    const siguiente = await listarRutinas(pagina, tamanio);
    if (siguiente.items.length === 0) break;
    rutinas.push(...siguiente.items);
  }
  return rutinas;
}

/** US07: crea el plan de 28 días (RN-PLAN-09 a 15). */
export function crearPlan(pedido: PedidoPlan): Promise<PlanCreado> {
  return pedir<PlanCreado>('/planificacion/planes', { metodo: 'POST', cuerpo: pedido });
}

/** RN-PLAN-22: planes del profesor, paginados; la query lleva solo los filtros presentes. */
export function consultarPlanes(
  filtros: FiltrosPlanes,
  pagina: number,
  tamanio: number,
): Promise<Pagina<ResumenPlan>> {
  const query = new URLSearchParams();
  for (const clave of ['estado', 'alumnoId', 'inicioDesde', 'inicioHasta'] as const) {
    if (filtros[clave]) query.set(clave, filtros[clave]);
  }
  query.set('pagina', String(pagina));
  query.set('tamanio', String(tamanio));
  return pedir<Pagina<ResumenPlan>>(`/planificacion/planes?${query.toString()}`);
}

/** US08: la rutina del día del alumno (RN-PLAN-11, 15, 18). */
export function obtenerRutinaDelDia(): Promise<RutinaDelDia> {
  return pedir<RutinaDelDia>('/planificacion/mi-rutina-del-dia');
}

/** US11: el plan vigente completo del alumno autenticado (RN-PLAN-11, 15, 19). */
export function obtenerMiPlan(): Promise<ResultadoMiPlan> {
  return pedir<ResultadoMiPlan>('/planificacion/mi-plan');
}

export function consultarAlumnosDelPlan(id: string): Promise<{ alumnoIds: string[] }> {
  return pedir(`/planificacion/planes/${id}/alumnos`);
}

export function agregarAlumnoAlPlan(id: string, alumnoId: string): Promise<void> {
  return pedir(`/planificacion/planes/${id}/alumnos`, { metodo: 'POST', cuerpo: { alumnoId } });
}

export function quitarAlumnoDelPlan(id: string, alumnoId: string): Promise<void> {
  return pedir(`/planificacion/planes/${id}/alumnos/${alumnoId}`, { metodo: 'DELETE' });
}

/** RN-PLAN-23: el plan con sus 28 días. */
export function obtenerPlan(id: string): Promise<PlanConDias> {
  return pedir<PlanConDias>(`/planificacion/planes/${id}`);
}

/** RN-PLAN-23: asigna una rutina (o descanso con `null`) a un día del plan. */
export function guardarDiaDelPlan(
  id: string,
  numero: number,
  rutinaId: string | null,
): Promise<DiaConsultado> {
  return pedir<DiaConsultado>(`/planificacion/planes/${id}/dias/${numero}`, {
    metodo: 'PUT',
    cuerpo: { rutinaId },
  });
}
