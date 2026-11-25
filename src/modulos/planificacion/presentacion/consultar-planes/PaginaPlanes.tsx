import { ArrowRight, CalendarDays, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Paginador } from '../../../../compartido/presentacion/paginador/Paginador.tsx';
import { usarConsultarPlanes } from '../../aplicacion/consultar-planes/usarConsultarPlanes.ts';
import {
  ESTADOS_DEL_PLAN,
  type EstadoPlan,
  etiquetaDeEstado,
  fechaConBarras,
  type ResumenPlan,
} from '../../dominio/plan/listadoPlanes.ts';
import { RUTA_NUEVO_PLAN } from '../crear-plan/PaginaNuevoPlan.tsx';
import { Aviso } from '../../../../compartido/presentacion/estados/Aviso.tsx';
import { Cargando } from '../../../../compartido/presentacion/estados/Cargando.tsx';
import { EstadoVacio } from '../../../../compartido/presentacion/estados/EstadoVacio.tsx';

/** RN-PLAN-22: planes del profesor con estado y filtros (RN-UI-LIS-01 a 04), y acceso a crear. */
export function PaginaPlanes() {
  const consulta = usarConsultarPlanes();
  const navegar = useNavigate();
  const { resultado, error, cargando, filtros, alumnos } = consulta;

  const nombres = new Map(alumnos.map((a) => [a.id, `${a.apellido}, ${a.nombre}`]));
  const vacia = resultado !== null && resultado.items.length === 0;

  return (
    <section className="pagina pagina-ancha">
      <header className="encabezado">
        <h1>Planes</h1>
        <button
          type="button"
          className="accion-principal"
          onClick={() => void navegar(RUTA_NUEVO_PLAN)}
        >
          Nuevo plan
        </button>
      </header>

      <div className="barra">
        <label>
          Estado
          <select
            value={filtros.estado}
            onChange={(e) => consulta.cambiarFiltro('estado', e.target.value as EstadoPlan | '')}
          >
            <option value="">Todos</option>
            {ESTADOS_DEL_PLAN.map(({ valor, etiqueta }) => (
              <option key={valor} value={valor}>
                {etiqueta}
              </option>
            ))}
          </select>
        </label>
        <label>
          Alumno
          <select
            value={filtros.alumnoId}
            onChange={(e) => consulta.cambiarFiltro('alumnoId', e.target.value)}
          >
            <option value="">Todos</option>
            {alumnos.map((alumno) => (
              <option key={alumno.id} value={alumno.id}>
                {alumno.apellido}, {alumno.nombre}
              </option>
            ))}
          </select>
        </label>
        <label>
          Inicio desde
          <input
            type="date"
            value={filtros.inicioDesde}
            onChange={(e) => consulta.cambiarFiltro('inicioDesde', e.target.value)}
          />
        </label>
        <label>
          Inicio hasta
          <input
            type="date"
            value={filtros.inicioHasta}
            onChange={(e) => consulta.cambiarFiltro('inicioHasta', e.target.value)}
          />
        </label>
        <button type="button" className="secundario" onClick={consulta.limpiarFiltros}>
          Limpiar filtros
        </button>
      </div>

      {error && <Aviso tipo="error">{error}</Aviso>}
      {cargando && !resultado && <Cargando>Cargando planes…</Cargando>}

      {vacia && (
        <EstadoVacio
          titulo={
            consulta.hayFiltros ? 'No hay planes con esos filtros.' : 'Todavía no creaste planes.'
          }
        />
      )}

      {resultado && (
        <>
          <ul className="grilla-rutinas" aria-label="Planes">
            {resultado.items.map((plan) => (
              <TarjetaPlan key={plan.id} plan={plan} nombres={nombres} />
            ))}
          </ul>
          {!vacia && (
            <Paginador
              pagina={consulta.pagina}
              total={resultado.total}
              tamanio={consulta.tamanio}
              alCambiarPagina={consulta.irAPagina}
              alCambiarTamanio={consulta.cambiarTamanio}
            />
          )}
        </>
      )}
    </section>
  );
}

/** "25/11" grande y el año chico, como en un tanteador. Recibe dd/mm/aaaa. */
function FechaTanteador({ fecha }: { fecha: string }) {
  return (
    <span className="fecha-tanteador">
      <span className="fecha-tanteador-dia">{fecha.slice(0, 5)}</span>
      <span className="fecha-tanteador-anio">{fecha.slice(6)}</span>
    </span>
  );
}

/**
 * Tarjeta del plan (T21): las fechas y los días se leen como un tanteador. El título y el resumen
 * completos quedan para lectores de pantalla; la versión visual es decorativa.
 */
function TarjetaPlan(props: { plan: ResumenPlan; nombres: Map<string, string> }) {
  const { plan } = props;
  const inicio = fechaConBarras(plan.fechaInicio);
  const fin = fechaConBarras(plan.fechaFin);
  return (
    <li className="tarjeta-rutina">
      <div className="tarjeta-rutina-cabecera">
        <h2 className="solo-lectores">{`Del ${inicio} al ${fin}`}</h2>
        <p className="fechas-plan" aria-hidden="true">
          <FechaTanteador fecha={inicio} />
          <ArrowRight className="fechas-plan-flecha" />
          <FechaTanteador fecha={fin} />
        </p>
        <span className={`estado-plan estado-plan-${plan.estado}`}>
          {etiquetaDeEstado(plan.estado)}
        </span>
      </div>
      <p className="solo-lectores">{`${plan.diasConRutina} días con rutina · ${plan.diasDeDescanso} de descanso`}</p>
      <dl className="dias-plan-cifras" aria-hidden="true">
        <div>
          <dt>Con rutina</dt>
          <dd>{plan.diasConRutina}</dd>
        </div>
        <div>
          <dt>Descanso</dt>
          <dd>{plan.diasDeDescanso}</dd>
        </div>
      </dl>
      {plan.alumnoIds.length === 0 ? (
        <p className="tenue">Sin alumnos</p>
      ) : (
        <ul className="alumnos-plan">
          {plan.alumnoIds.map((id) => (
            <li key={id}>{props.nombres.get(id) ?? 'Alumno'}</li>
          ))}
        </ul>
      )}
      {plan.estado !== 'finalizado' && (
        <div className="tarjeta-acciones">
          {plan.estado === 'vigente' && (
            <Link to={`/profesor/planes/${plan.id}/alumnos`} className="boton secundario">
              <Users aria-hidden="true" />
              Alumnos
            </Link>
          )}
          <Link to={`/profesor/planes/${plan.id}/dias`} className="boton secundario">
            <CalendarDays aria-hidden="true" />
            Editar días
          </Link>
        </div>
      )}
    </li>
  );
}
