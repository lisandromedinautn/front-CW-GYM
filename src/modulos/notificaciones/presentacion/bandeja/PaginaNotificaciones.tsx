import { Paginador } from '../../../../compartido/presentacion/paginador/Paginador.tsx';
import { usarNotificaciones } from '../../aplicacion/consultar-notificaciones/usarNotificaciones.ts';
import { usarMarcarLeida } from '../../aplicacion/marcar-leida/usarMarcarLeida.ts';
import { TarjetaNotificacion } from './TarjetaNotificacion.tsx';
import { Aviso } from '../../../../compartido/presentacion/estados/Aviso.tsx';
import { Cargando } from '../../../../compartido/presentacion/estados/Cargando.tsx';
import { EstadoVacio } from '../../../../compartido/presentacion/estados/EstadoVacio.tsx';

/** US21: bandeja del profesor con los entrenamientos de sus alumnos por debajo de lo prescripto (RN-NOT-01 a 04). */
export function PaginaNotificaciones() {
  const consulta = usarNotificaciones();
  const lectura = usarMarcarLeida(consulta.marcarComoLeida);
  const { bandeja } = consulta;
  const error = lectura.error ?? consulta.error;

  return (
    <section className="pagina pagina-ancha">
      <h1>Notificaciones</h1>
      {error && <Aviso tipo="error">{error}</Aviso>}
      {bandeja === null && !error && <Cargando>Cargando tus notificaciones…</Cargando>}
      {bandeja && (
        <>
          <p className="etiqueta resumen-bandeja">No leídas: {bandeja.noLeidas}</p>
          {bandeja.items.length === 0 && <EstadoVacio titulo="Todavía no tenés notificaciones." />}
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
