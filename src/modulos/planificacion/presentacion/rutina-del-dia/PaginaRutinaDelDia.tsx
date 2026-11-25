import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { usarRutinaDelDia } from '../../aplicacion/consultar-rutina-del-dia/usarRutinaDelDia.ts';
import { etiquetaDelDia } from '../../dominio/plan/rutinaDelDia.ts';
import { DetalleRutina } from '../detalle-rutina/DetalleRutina.tsx';
import { Aviso } from '../../../../compartido/presentacion/estados/Aviso.tsx';
import { Cargando } from '../../../../compartido/presentacion/estados/Cargando.tsx';
import { EstadoVacio } from '../../../../compartido/presentacion/estados/EstadoVacio.tsx';

/**
 * US08: el alumno consulta la rutina del día de su plan vigente. RN-PLAN-18 (rutina, descanso o
 * sin plan), RN-PLAN-11 (día del plan) y RN-PLAN-15 (vigencia, la resuelve el back).
 */
export function PaginaRutinaDelDia({ acciones }: { acciones?: (hayRutina: boolean) => ReactNode }) {
  const { resultado, error, cargando } = usarRutinaDelDia();

  return (
    <section className="pagina">
      <h1>Mi rutina del día</h1>
      <p>
        <Link to="/alumno/mi-plan">Ver mi plan completo</Link>
      </p>

      {error && <Aviso tipo="error">{error}</Aviso>}
      {cargando && !resultado && <Cargando>Cargando tu rutina…</Cargando>}

      {resultado && (
        <p className="tenue">
          Fecha: <time dateTime={resultado.fecha}>{resultado.fecha}</time>
        </p>
      )}

      {resultado?.estado === 'sin-plan' && <EstadoVacio titulo="No tenés un plan vigente." />}

      {resultado?.estado === 'descanso' && (
        <>
          <p className="etiqueta">{etiquetaDelDia(resultado.numeroDia)}</p>
          <p className="dia-descanso">Hoy es día de descanso.</p>
        </>
      )}

      {resultado?.estado === 'rutina' && (
        <DetalleRutina rutina={resultado.rutina} numeroDia={resultado.numeroDia} />
      )}
      {/* En el celular, la acción del día queda fija abajo, siempre a mano (T22). */}
      {resultado && (
        <div className="barra-del-dia">{acciones?.(resultado.estado === 'rutina')}</div>
      )}
    </section>
  );
}
