import { pedir } from '../../../../compartido/infraestructura/cliente-http/clienteHttp.ts';
import type {
  Entrenamiento,
  ResultadoEntrenamiento,
} from '../../dominio/entrenamiento/entrenamiento.ts';

export function consultarEntrenamiento(): Promise<ResultadoEntrenamiento> {
  return pedir('/entrenamiento/mi-entrenamiento-en-curso');
}

export function iniciarEntrenamiento(): Promise<Entrenamiento> {
  return pedir('/entrenamiento/entrenamientos', { metodo: 'POST' });
}
