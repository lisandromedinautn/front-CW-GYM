import { useState, type FormEvent } from 'react';
import { usarCrearPlan } from '../../aplicacion/crear-plan/usarCrearPlan.ts';
import { usarDatosParaPlan } from '../../aplicacion/crear-plan/usarDatosParaPlan.ts';
import {
  DIAS_DEL_PLAN,
  type DiaDelPlan,
  esFechaValida,
  etiquetaDeFecha,
  fechaFinDelPlan,
  fechasDeLosDias,
  hoyIso,
} from '../../dominio/plan/plan.ts';

/**
 * US07: el profesor crea un plan de 28 días y asigna una rutina o descanso a cada día.
 * RN-PLAN-09 (fin calculado), RN-PLAN-10 (rutina o descanso), RN-PLAN-11 (fecha de cada día),
 * RN-PLAN-12 (al menos un alumno), RN-PLAN-13 (solo alumnos vinculados) y RN-PLAN-17 (sin
 * finalización anticipada).
 */
export function PaginaCrearPlan() {
  const { alumnos, rutinas, error: errorDatos, cargando } = usarDatosParaPlan();
  const { crear, avisar, error, plan, enviando } = usarCrearPlan();
  const [fechaInicio, setFechaInicio] = useState(hoyIso());
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  /** Rutina elegida por número de día; sin entrada (o '') el día es de descanso. */
  const [rutinaPorDia, setRutinaPorDia] = useState<Record<number, string>>({});

  const fechaValida = esFechaValida(fechaInicio);
  const fechas = fechaValida ? fechasDeLosDias(fechaInicio) : [];
  const fechaFin = fechaValida ? fechaFinDelPlan(fechaInicio) : null;

  function alternarAlumno(alumnoId: string) {
    setSeleccionados((anteriores) =>
      anteriores.includes(alumnoId)
        ? anteriores.filter((id) => id !== alumnoId)
        : [...anteriores, alumnoId],
    );
  }

  async function guardar(evento: FormEvent) {
    evento.preventDefault();
    if (!fechaValida) {
      avisar('Elegí una fecha de inicio válida');
      return;
    }
    // RN-PLAN-12: el plan se crea con al menos un alumno.
    if (seleccionados.length === 0) {
      avisar('Elegí al menos un alumno');
      return;
    }

    const dias: DiaDelPlan[] = fechas.map((_, indice) => ({
      numero: indice + 1,
      rutinaId: rutinaPorDia[indice + 1] ? rutinaPorDia[indice + 1] : null,
    }));
    await crear({ fechaInicio, dias, alumnos: seleccionados });
  }

  return (
    <section className="pagina pagina-ancha">
      <h1>Nuevo plan</h1>
      {errorDatos && (
        <p role="alert" className="error">
          {errorDatos}
        </p>
      )}
      {cargando && <p className="tenue">Cargando alumnos y rutinas…</p>}

      <form className="formulario" onSubmit={(e) => void guardar(e)} noValidate>
        <div className="barra">
          <label htmlFor="fecha-inicio">Fecha de inicio</label>
          <input
            id="fecha-inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          {/* RN-PLAN-09: la fecha de fin se calcula sola y no se edita. */}
          <p className="etiqueta">Fecha de fin: {fechaFin ?? 'elegí la fecha de inicio'}</p>
        </div>

        <fieldset className="bloque">
          <legend>Alumnos</legend>
          {alumnos !== null && alumnos.length === 0 && (
            <p className="tenue">No tenés alumnos vinculados todavía.</p>
          )}
          {alumnos?.map((alumno) => (
            <label key={alumno.id} className="campo">
              <span>
                <input
                  type="checkbox"
                  checked={seleccionados.includes(alumno.id)}
                  onChange={() => alternarAlumno(alumno.id)}
                />{' '}
                {alumno.apellido}, {alumno.nombre}
              </span>
            </label>
          ))}
        </fieldset>

        <fieldset className="bloque">
          <legend>Días del plan</legend>
          {fechas.length === 0 && (
            <p className="tenue">Elegí la fecha de inicio para ver los {DIAS_DEL_PLAN} días.</p>
          )}
          {fechas.map((fecha, indice) => {
            const numero = indice + 1;
            return (
              <div key={numero} className="barra">
                <p className="campo">
                  Día {numero} — {etiquetaDeFecha(fecha)}
                </p>
                <label>
                  <span>Rutina del día {numero}</span>
                  <select
                    value={rutinaPorDia[numero] ?? ''}
                    onChange={(e) =>
                      setRutinaPorDia((anteriores) => ({
                        ...anteriores,
                        [numero]: e.target.value,
                      }))
                    }
                  >
                    <option value="">Descanso</option>
                    {(rutinas ?? []).map((rutina) => (
                      <option key={rutina.id} value={rutina.id}>
                        {rutina.nombre}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            );
          })}
        </fieldset>

        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        {plan && (
          <p role="status" className="exito">
            Plan creado del {plan.fechaInicio} al {plan.fechaFin}
          </p>
        )}
        <button type="submit" disabled={enviando}>
          Crear plan
        </button>
      </form>
    </section>
  );
}
