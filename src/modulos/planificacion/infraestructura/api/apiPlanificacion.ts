import { pedir } from '../../../../compartido/infraestructura/cliente-http/clienteHttp.ts';
import type {
  EjercicioParaRutina,
  PedidoRutina,
  RutinaCreada,
} from '../../dominio/rutina/rutina.ts';

/** El catálogo, reducido a lo que usa el editor de rutinas (Profesor, RN-IDE-03). */
export async function listarEjerciciosParaRutina(): Promise<EjercicioParaRutina[]> {
  const ejercicios = await pedir<EjercicioParaRutina[]>('/catalogo/ejercicios');
  return ejercicios.map(({ id, nombre, tipo, tipoCarga }) => ({ id, nombre, tipo, tipoCarga }));
}

/** US06: crea una rutina por bloques. */
export function crearRutina(pedido: PedidoRutina): Promise<RutinaCreada> {
  return pedir<RutinaCreada>('/planificacion/rutinas', { metodo: 'POST', cuerpo: pedido });
}
