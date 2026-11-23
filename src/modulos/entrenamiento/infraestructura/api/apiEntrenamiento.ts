import { pedir } from '../../../../compartido/infraestructura/cliente-http/clienteHttp.ts';
import type {
  Entrenamiento,
  RegistroSerie,
  ResultadoEntrenamiento,
  SerieRealizada,
} from '../../dominio/entrenamiento/entrenamiento.ts';

export function consultarEntrenamiento(): Promise<ResultadoEntrenamiento> {
  return pedir('/entrenamiento/mi-entrenamiento-en-curso');
}

export function iniciarEntrenamiento(): Promise<Entrenamiento> {
  return pedir('/entrenamiento/entrenamientos', { metodo: 'POST' });
}

/** US14: registra la serie o reemplaza la ya registrada con la misma clave (orden, numero, posicion). */
export function registrarSerie(id: string, registro: RegistroSerie): Promise<SerieRealizada> {
  return pedir(`/entrenamiento/entrenamientos/${id}/series`, { metodo: 'POST', cuerpo: registro });
}
