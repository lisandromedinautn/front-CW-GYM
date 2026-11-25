import { Link, useParams } from 'react-router';
import { usarAlumnosDelPlan } from '../../aplicacion/alumnos-del-plan/usarAlumnosDelPlan.ts';
import { Aviso } from '../../../../compartido/presentacion/estados/Aviso.tsx';
import { Cargando } from '../../../../compartido/presentacion/estados/Cargando.tsx';
import { EstadoVacio } from '../../../../compartido/presentacion/estados/EstadoVacio.tsx';

export function PaginaAlumnosDelPlan() {
  const { id = '' } = useParams();
  const { alumnos, asignados, error, ocupado, cambiar } = usarAlumnosDelPlan(id);

  return (
    <section className="pagina">
      <Link to="/profesor/planes" className="volver">
        Volver a planes
      </Link>
      <h1>Alumnos del plan</h1>
      {error && <Aviso tipo="error">{error}</Aviso>}
      {asignados === null && !error && <Cargando>Cargando alumnos…</Cargando>}
      {asignados && (
        <>
          {asignados.length === 0 && <EstadoVacio titulo="Sin alumnos asignados." />}
          {alumnos.length === 0 && <EstadoVacio titulo="No tenés alumnos vinculados." />}
          <ul className="lista-tarjetas" aria-label="Alumnos">
            {alumnos.map((alumno) => {
              const asignado = asignados.includes(alumno.id);
              return (
                <li key={alumno.id} className="tarjeta-item fila-alumno">
                  <span>
                    {alumno.apellido}, {alumno.nombre}
                  </span>
                  <button
                    type="button"
                    className={asignado ? 'secundario' : undefined}
                    aria-label={`${asignado ? 'Quitar' : 'Agregar'} a ${alumno.nombre} ${alumno.apellido}`}
                    disabled={ocupado}
                    onClick={() => void cambiar(alumno.id, asignado)}
                  >
                    {asignado ? 'Quitar' : 'Agregar'}
                  </button>
                </li>
              );
            })}
            {asignados
              .filter((alumnoId) => !alumnos.some((alumno) => alumno.id === alumnoId))
              .map((alumnoId) => (
                <li key={alumnoId} className="tarjeta-item fila-alumno">
                  <span>Alumno sin vínculo</span>
                  <button
                    type="button"
                    className="secundario"
                    disabled={ocupado}
                    onClick={() => void cambiar(alumnoId, true)}
                  >
                    Quitar
                  </button>
                </li>
              ))}
          </ul>
        </>
      )}
    </section>
  );
}
