import { Link } from 'react-router';
import {
  describirMedida,
  describirPercepcion,
  describirRealizada,
  etiquetaDeGravedad,
  fechaCorta,
  fechaHora,
  type Notificacion,
  tituloDeSerie,
} from '../../dominio/notificacion/notificacion.ts';

interface Props {
  notificacion: Notificacion;
  alMarcarLeida: (id: string) => void;
}

/** RN-NOT-01, 02, 04 y RN-UI-NOT-02: una notificación con sus series por debajo. */
export function TarjetaNotificacion({ notificacion, alMarcarLeida }: Props) {
  const { alumno, entrenamiento, seriesPorDebajo } = notificacion;
  const nombre = `${alumno.apellido}, ${alumno.nombre}`;
  if (notificacion.tipo === 'alerta-incumplimiento') {
    return (
      <article className="tarjeta-plan">
        <h2>{etiquetaDeGravedad(notificacion.gravedad)}</h2>
        <p>{nombre}: 3 entrenamientos seguidos por debajo de lo prescripto</p>
        <ul className="series-alumno">
          {(notificacion.entrenamientos ?? []).map((e) => (
            <li key={e.id}>
              {fechaCorta(e.fecha)} · {e.rutina}
            </li>
          ))}
        </ul>
        <Link to={`/profesor/entrenamientos?alumno=${alumno.id}`}>Ver entrenamientos</Link>
        {!notificacion.leida && (
          <button type="button" onClick={() => alMarcarLeida(notificacion.id)}>
            Marcar como leída
          </button>
        )}
      </article>
    );
  }
  return (
    <article className="tarjeta-plan">
      <h2>{etiquetaDeGravedad(notificacion.gravedad)}</h2>
      <p>{nombre}</p>
      <p>{entrenamiento.rutina}</p>
      <p>{fechaHora(entrenamiento.inicio)}</p>
      {notificacion.percepcion !== null && <p>{describirPercepcion(notificacion.percepcion)}</p>}
      {seriesPorDebajo.length === 0 ? (
        <p>Percepción mala</p>
      ) : (
        <>
          <p>
            Series por debajo: {seriesPorDebajo.length} de {notificacion.totalSeries}
          </p>
          <ul className="series-alumno">
            {seriesPorDebajo.map((serie) => (
              <li key={`${serie.orden}-${serie.numero}-${serie.posicion ?? 0}`}>
                <strong>{tituloDeSerie(serie)}</strong>
                <span>Prescripto: {describirMedida(serie.prescripta)}</span>
                <span>Realizado: {describirRealizada(serie.realizada)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      <Link to={`/profesor/entrenamientos?alumno=${alumno.id}`}>
        Ver entrenamientos de {nombre}
      </Link>
      {!notificacion.leida && (
        <button type="button" onClick={() => alMarcarLeida(notificacion.id)}>
          Marcar como leída
        </button>
      )}
    </article>
  );
}
