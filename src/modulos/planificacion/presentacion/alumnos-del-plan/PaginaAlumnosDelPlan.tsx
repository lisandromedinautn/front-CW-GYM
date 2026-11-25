import { Link, useParams } from 'react-router';
import { usarAlumnosDelPlan } from '../../aplicacion/alumnos-del-plan/usarAlumnosDelPlan.ts';

export function PaginaAlumnosDelPlan() {
  const { id = '' } = useParams();
  const { alumnos, asignados, error, ocupado, cambiar } = usarAlumnosDelPlan(id);

  return (
    <section className="pagina">
      <Link to="/profesor/planes" className="volver">
        Volver a planes
      </Link>
      <h1>Alumnos del plan</h1>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {asignados === null && !error && <p role="status">Cargando alumnos…</p>}
      {asignados && (
        <>
          {asignados.length === 0 && <p>Sin alumnos asignados.</p>}
          {alumnos.length === 0 && <p>No tenés alumnos vinculados.</p>}
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
