import { usarRutinaDelDia } from '../../aplicacion/consultar-rutina-del-dia/usarRutinaDelDia.ts';
import { etiquetaDelDia } from '../../dominio/plan/rutinaDelDia.ts';
import { DetalleRutina } from '../detalle-rutina/DetalleRutina.tsx';

/**
 * US08: el alumno consulta la rutina del día de su plan vigente. RN-PLAN-18 (rutina, descanso o
 * sin plan), RN-PLAN-11 (día del plan) y RN-PLAN-15 (vigencia, la resuelve el back).
 */
export function PaginaRutinaDelDia() {
  const { resultado, error, cargando } = usarRutinaDelDia();

  return (
    <section className="pagina">
      <h1>Mi rutina del día</h1>

      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {cargando && !resultado && <p className="tenue">Cargando tu rutina…</p>}

      {resultado && (
        <p className="tenue">
          Fecha: <time dateTime={resultado.fecha}>{resultado.fecha}</time>
        </p>
      )}

      {resultado?.estado === 'sin-plan' && <p>No tenés un plan vigente.</p>}

      {resultado?.estado === 'descanso' && (
        <>
          <p className="etiqueta">{etiquetaDelDia(resultado.numeroDia)}</p>
          <p>Hoy es día de descanso.</p>
        </>
      )}

      {resultado?.estado === 'rutina' && (
        <DetalleRutina rutina={resultado.rutina} numeroDia={resultado.numeroDia} />
      )}
    </section>
  );
}
