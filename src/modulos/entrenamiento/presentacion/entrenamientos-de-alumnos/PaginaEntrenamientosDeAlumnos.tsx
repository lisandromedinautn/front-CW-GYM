import { Paginador } from '../../../../compartido/presentacion/paginador/Paginador.tsx';
import { usarEntrenamientosDeAlumnos } from '../../aplicacion/consultar-entrenamientos-de-alumnos/usarEntrenamientosDeAlumnos.ts';
import {
  type EntrenamientoDeAlumno,
  etiquetaDeEstado,
  fechaHora,
  seriesEnOrden,
  tituloDeSerie,
  totalDeSeries,
} from '../../dominio/entrenamientos-de-alumnos/entrenamientosDeAlumnos.ts';
import { describirMedida } from '../../dominio/serie/filasSeries.ts';

export const RUTA_ENTRENAMIENTOS_DE_ALUMNOS = '/profesor/entrenamientos';

/** US18: el profesor consulta los entrenamientos de un alumno vinculado (RN-ENT-18, RN-UI-ENT-04). */
export function PaginaEntrenamientosDeAlumnos() {
  const consulta = usarEntrenamientosDeAlumnos();
  const { alumnos, alumnoId, resultado, error } = consulta;

  return (
    <section className="pagina pagina-ancha">
      <h1>Entrenamientos de mis alumnos</h1>
      {error && <p role="alert">{error}</p>}
      {alumnos === null && !error && <p>Cargando tus alumnos…</p>}
      {alumnos?.length === 0 && <p>Todavía no tenés alumnos vinculados.</p>}
      {alumnos && alumnos.length > 0 && (
        <div className="barra">
          <label>
            Alumno
            <select value={alumnoId} onChange={(e) => consulta.elegirAlumno(e.target.value)}>
              <option value="">Elegí un alumno</option>
              {alumnos.map((alumno) => (
                <option key={alumno.id} value={alumno.id}>
                  {alumno.apellido}, {alumno.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      {alumnos && alumnos.length > 0 && !alumnoId && (
        <p>Elegí un alumno para ver sus entrenamientos.</p>
      )}
      {alumnoId && resultado?.items.length === 0 && (
        <p>Este alumno todavía no tiene entrenamientos.</p>
      )}
      {alumnoId && resultado && resultado.items.length > 0 && (
        <>
          {resultado.items.map((entrenamiento) => (
            <TarjetaEntrenamiento key={entrenamiento.id} entrenamiento={entrenamiento} />
          ))}
          <Paginador
            pagina={consulta.pagina}
            total={resultado.total}
            tamanio={consulta.tamanio}
            alCambiarPagina={consulta.irAPagina}
            alCambiarTamanio={consulta.cambiarTamanio}
          />
        </>
      )}
    </section>
  );
}

function TarjetaEntrenamiento({ entrenamiento }: { entrenamiento: EntrenamientoDeAlumno }) {
  const series = seriesEnOrden(entrenamiento.series ?? []);
  return (
    <article className="tarjeta-plan">
      <h2>
        {fechaHora(entrenamiento.inicio)} · {entrenamiento.rutina.nombre} ·{' '}
        {etiquetaDeEstado(entrenamiento.estado)}
      </h2>
      <p>Peso del día: {String(entrenamiento.pesoCorporalKg).replace('.', ',')} kg</p>
      <p>
        Series registradas: {series.length} de {totalDeSeries(entrenamiento)}
      </p>
      {series.length === 0 ? (
        <p>Sin series registradas</p>
      ) : (
        <ul className="series-alumno">
          {series.map((serie) => (
            <li key={`${serie.orden}-${serie.numero}-${serie.posicion ?? 0}`}>
              <strong>{tituloDeSerie(serie)}</strong>
              <span>Prescripto: {describirMedida(serie.prescripta)}</span>
              <span>Realizado: {describirMedida(serie.realizada)}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
