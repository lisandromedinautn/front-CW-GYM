import { pedir } from '../../../../compartido/infraestructura/cliente-http/clienteHttp.ts';
import type { Pagina } from '../../../../compartido/dominio/paginacion/paginacion.ts';
import type {
  AlumnoVinculado,
  EntrenamientoDeAlumno,
} from '../../dominio/entrenamientos-de-alumnos/entrenamientosDeAlumnos.ts';
import type {
  Entrenamiento,
  RegistroSerie,
  ResultadoEntrenamiento,
  ResumenEntrenamiento,
  SerieRealizada,
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

/** US14: registra la serie o reemplaza la ya registrada con la misma clave (orden, numero, posicion). */
export function registrarSerie(id: string, registro: RegistroSerie): Promise<SerieRealizada> {
  return pedir(`/entrenamiento/entrenamientos/${id}/series`, { metodo: 'POST', cuerpo: registro });
}

/** US18: alumnos vinculados al profesor de la sesión. */
export function listarAlumnosVinculados(): Promise<AlumnoVinculado[]> {
  return pedir('/identidad/alumnos');
}

/** US18 (RN-ENT-18): entrenamientos de un alumno vinculado, del más nuevo al más viejo. */
export function consultarEntrenamientosDeAlumno(
  alumnoId: string,
  pagina: number,
  tamanio: number,
): Promise<Pagina<EntrenamientoDeAlumno>> {
  const query = new URLSearchParams({ pagina: String(pagina), tamanio: String(tamanio) });
  return pedir(`/entrenamiento/alumnos/${alumnoId}/entrenamientos?${query.toString()}`);
}