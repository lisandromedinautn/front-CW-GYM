import { Paginador } from '../../../../compartido/presentacion/paginador/Paginador.tsx';
import { usarNotificaciones } from '../../aplicacion/consultar-notificaciones/usarNotificaciones.ts';
import { usarMarcarLeida } from '../../aplicacion/marcar-leida/usarMarcarLeida.ts';
import { TarjetaNotificacion } from './TarjetaNotificacion.tsx';

/** US21: bandeja del profesor con los entrenamientos de sus alumnos por debajo de lo prescripto (RN-NOT-01 a 04). */
export function PaginaNotificaciones() {
  const consulta = usarNotificaciones();
  const lectura = usarMarcarLeida(consulta.marcarComoLeida);
  const { bandeja } = consulta;
  const error = lectura.error ?? consulta.error;

  return (
    <section className="pagina pagina-ancha">
      <h1>Notificaciones</h1>
      {error && <p role="alert">{error}</p>}
      {bandeja === null && !error && <p>Cargando tus notificaciones…</p>}
      {bandeja && (
        <>
          <p>No leídas: {bandeja.noLeidas}</p>
          {bandeja.items.length === 0 && <p>Todavía no tenés notificaciones.</p>}
          {bandeja.items.map((notificacion) => (
            <TarjetaNotificacion
              key={notificacion.id}
              notificacion={notificacion}
              alMarcarLeida={lectura.marcar}
            />
          ))}
          <Paginador
            pagina={consulta.pagina}
            total={bandeja.total}
            tamanio={consulta.tamanio}
            alCambiarPagina={consulta.irAPagina}
            alCambiarTamanio={consulta.cambiarTamanio}
          />
        </>
      )}
    </section>
  );
}
