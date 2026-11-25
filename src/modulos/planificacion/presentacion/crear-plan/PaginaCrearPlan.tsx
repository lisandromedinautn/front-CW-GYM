import { useState, type FormEvent } from 'react';
import { usarCrearPlan } from '../../aplicacion/crear-plan/usarCrearPlan.ts';
import { usarDatosParaPlan } from '../../aplicacion/crear-plan/usarDatosParaPlan.ts';
import { fechaConBarras } from '../../dominio/plan/listadoPlanes.ts';
import {
  DIAS_DEL_PLAN,
  type DiaDelPlan,
  esFechaValida,
  etiquetaDeFecha,
  fechaFinDelPlan,
  fechasDeLosDias,
  hoyIso,
  sumarDias,
} from '../../dominio/plan/plan.ts';
import { Aviso } from '../../../../compartido/presentacion/estados/Aviso.tsx';
import { Cargando } from '../../../../compartido/presentacion/estados/Cargando.tsx';

/** El calendario siempre muestra 5 semanas de lunes a domingo: los 28 días entran en 35 celdas. */
const CELDAS_DEL_CALENDARIO = 35;
const DIAS_DE_LA_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const ABREVIATURAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

/** Días de la semana entre el lunes y la fecha (0 si es lunes, 6 si es domingo). Fecha en UTC. */
function desfaseLunes(fecha: string): number {
  if (!esFechaValida(fecha)) return 0;
  return (new Date(`${fecha}T00:00:00Z`).getUTCDay() + 6) % 7;
}

/** "vie 13/11", para la celda del calendario. */
function etiquetaCorta(fecha: string): string {
  const diaDeLaSemana = new Date(`${fecha}T00:00:00Z`).getUTCDay();
  return `${ABREVIATURAS[diaDeLaSemana]} ${fecha.slice(8, 10)}/${fecha.slice(5, 7)}`;
}

/** Celdas grises de los días que no forman parte del plan, con su fecha real. */
function relleno(desde: string, inicio: number, cantidad: number) {
  if (!desde || cantidad <= 0) return null;
  return Array.from({ length: cantidad }, (_, indice) => {
    const fecha = sumarDias(desde, indice);
    return (
      <div key={`fuera-${inicio + indice}`} className="dia-fuera-del-plan" aria-hidden="true">
        {etiquetaCorta(fecha)}
      </div>
    );
  });
}

/**
 * US07: el profesor crea un plan de 28 días y asigna una rutina o descanso a cada día.
 * RN-PLAN-09 (fin calculado), RN-PLAN-10 (rutina o descanso), RN-PLAN-11 (fecha de cada día),
 * RN-PLAN-12 (al menos un alumno), RN-PLAN-13 (solo alumnos vinculados) y RN-PLAN-17 (sin
 * finalización anticipada).
 */
export function PaginaCrearPlan(props: { alVolver?: () => void } = {}) {
  const { alumnos, rutinas, error: errorDatos, cargando } = usarDatosParaPlan();
  const { crear, avisar, error, plan, enviando } = usarCrearPlan();
  const [fechaInicio, setFechaInicio] = useState(hoyIso());
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  /** Rutina elegida por número de día; sin entrada (o '') el día es de descanso. */
  const [rutinaPorDia, setRutinaPorDia] = useState<Record<number, string>>({});

  const fechaValida = esFechaValida(fechaInicio);
  const fechas = fechaValida ? fechasDeLosDias(fechaInicio) : [];
  // RN-PLAN-09: la fecha de fin se muestra en dd/mm/aaaa (T21, decidido por Ulises el 25/11/2026).
  const fechaFin = fechaValida ? fechaConBarras(fechaFinDelPlan(fechaInicio)) : null;

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
      {props.alVolver && (
        <button type="button" className="enlace volver" onClick={props.alVolver}>
          Volver al listado
        </button>
      )}
      <h1>Nuevo plan</h1>
      {errorDatos && <Aviso tipo="error">{errorDatos}</Aviso>}
      {cargando && <Cargando>Cargando alumnos y rutinas…</Cargando>}

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
            <Aviso tipo="advertencia">No tenés alumnos vinculados todavía.</Aviso>
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
          {fechas.length > 0 && (
            <div className="calendario-plan-semana" aria-hidden="true">
              {DIAS_DE_LA_SEMANA.map((dia) => (
                <span key={dia}>{dia}</span>
              ))}
            </div>
          )}
          <div className="dias-del-plan">
            {relleno(
              fechaValida ? sumarDias(fechaInicio, -desfaseLunes(fechaInicio)) : '',
              0,
              desfaseLunes(fechaInicio),
            )}
            {fechas.map((fecha, indice) => {
              const numero = indice + 1;
              return (
                <div
                  key={numero}
                  className={`dia-del-plan${rutinaPorDia[numero] ? ' con-rutina' : ''}`}
                >
                  {/* Texto completo para lectores de pantalla; el visible es compacto. */}
                  <p className="dia-del-plan-titulo solo-lectores">
                    Día {numero} — {etiquetaDeFecha(fecha)}
                  </p>
                  <p className="dia-del-plan-encabezado" aria-hidden="true">
                    <span className="dia-del-plan-numero">Día {numero}</span>
                    <span className="dia-del-plan-fecha">{etiquetaCorta(fecha)}</span>
                  </p>
                  <label>
                    <span className="solo-lectores">Rutina del día {numero}</span>
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
            {fechaValida &&
              relleno(
                sumarDias(fechaInicio, DIAS_DEL_PLAN),
                desfaseLunes(fechaInicio) + DIAS_DEL_PLAN,
                CELDAS_DEL_CALENDARIO - desfaseLunes(fechaInicio) - DIAS_DEL_PLAN,
              )}
          </div>
        </fieldset>

        {error && <Aviso tipo="error">{error}</Aviso>}
        {plan && (
          <Aviso tipo="exito">
            Plan creado del {plan.fechaInicio} al {plan.fechaFin}
          </Aviso>
        )}
        <button type="submit" className="accion-principal" disabled={enviando}>
          Crear plan
        </button>
      </form>
    </section>
  );
}
