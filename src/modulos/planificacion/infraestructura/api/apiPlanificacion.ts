import type { Pagina } from '../../../../compartido/dominio/paginacion/paginacion.ts';
import { pedir } from '../../../../compartido/infraestructura/cliente-http/clienteHttp.ts';
import type { AlumnoDelProfesor, PedidoPlan, PlanCreado } from '../../dominio/plan/plan.ts';
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

/** RN-PLAN-08: crea una copia independiente de una rutina propia. */
export function importarRutina(id: string): Promise<RutinaCreada> {
  return pedir<RutinaCreada>(`/planificacion/rutinas/${id}/importacion`, { metodo: 'POST' });
}

/** RN-PLAN-21: renombra una rutina propia (409 si ya tiene otra con ese nombre). */
export function renombrarRutina(id: string, nombre: string): Promise<RutinaCreada> {
  return pedir<RutinaCreada>(`/planificacion/rutinas/${id}/nombre`, {
    metodo: 'PATCH',
    cuerpo: { nombre },
  });
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
