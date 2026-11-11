import type { Pagina } from '../../../../compartido/dominio/paginacion/paginacion.ts';
import { pedir } from '../../../../compartido/infraestructura/cliente-http/clienteHttp.ts';
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

/** RN-PLAN-21: renombra una rutina propia (409 si ya tiene otra con ese nombre). */
export function renombrarRutina(id: string, nombre: string): Promise<RutinaCreada> {
  return pedir<RutinaCreada>(`/planificacion/rutinas/${id}/nombre`, {
    metodo: 'PATCH',
    cuerpo: { nombre },
  });
}
