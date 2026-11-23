import { pedir } from '../../../../compartido/infraestructura/cliente-http/clienteHttp.ts';
import type {
  Entrenamiento,
  ResultadoEntrenamiento,
  ResumenEntrenamiento,
} from '../../dominio/entrenamiento/entrenamiento.ts';

export function consultarEntrenamiento(): Promise<ResultadoEntrenamiento> {
  return pedir('/entrenamiento/mi-entrenamiento-en-curso');
}

export function iniciarEntrenamiento(): Promise<Entrenamiento> {
  return pedir('/entrenamiento/entrenamientos', { metodo: 'POST' });
}

export function finalizarEntrenamiento(id: string): Promise<ResumenEntrenamiento> {
  return pedir(`/entrenamiento/entrenamientos/${id}/finalizacion`, { metodo: 'POST' });
}
