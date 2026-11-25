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
  const clase = `tarjeta-registro aviso-${notificacion.gravedad}${notificacion.leida ? ' leida' : ''}`;
  if (notificacion.tipo === 'alerta-incumplimiento') {
    return (
      <article className={clase}>
        <h2 className="gravedad">{etiquetaDeGravedad(notificacion.gravedad)}</h2>
        <p>{nombre}: 3 entrenamientos seguidos por debajo de lo prescripto</p>
        <ul className="series-alumno">
          {(notificacion.entrenamientos ?? []).map((e) => (
            <li key={e.id}>
              {fechaCorta(e.fecha)} · {e.rutina}
            </li>
          ))}
        </ul>
        <div className="tarjeta-acciones">
          <Link to={`/profesor/entrenamientos?alumno=${alumno.id}`}>Ver entrenamientos</Link>
          {!notificacion.leida && (
            <button type="button" onClick={() => alMarcarLeida(notificacion.id)}>
              Marcar como leída
            </button>
          )}
        </div>
      </article>
    );
  }
  return (
    <article className={clase}>
      <div className="tarjeta-registro-cabecera">
        <h2 className="gravedad">{etiquetaDeGravedad(notificacion.gravedad)}</h2>
        <p className="tenue">{fechaHora(entrenamiento.inicio)}</p>
      </div>
      <p className="tarjeta-registro-titulo">{nombre}</p>
      <p className="tenue">{entrenamiento.rutina}</p>
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
      <div className="tarjeta-acciones">
        <Link to={`/profesor/entrenamientos?alumno=${alumno.id}`}>
          Ver entrenamientos de {nombre}
        </Link>
        {!notificacion.leida && (
          <button type="button" onClick={() => alMarcarLeida(notificacion.id)}>
            Marcar como leída
          </button>
        )}
      </div>
    </article>
  );
}
