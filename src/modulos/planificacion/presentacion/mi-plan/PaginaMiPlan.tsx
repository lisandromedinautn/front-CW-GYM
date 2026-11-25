import { useRef, useState, type CSSProperties } from 'react';
import { usarMiPlan } from '../../aplicacion/consultar-plan-del-alumno/usarMiPlan.ts';
import type { ResultadoMiPlan } from '../../dominio/plan/miPlan.ts';
import { columnaDeLaSemana, diaDelMes, etiquetaDeFecha } from '../../dominio/plan/plan.ts';
import { DetalleRutina } from '../detalle-rutina/DetalleRutina.tsx';

const DIAS_DE_LA_SEMANA = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
/** Color de cada rutina del plan, en el orden en que aparece: los colores de sección (T25). */
const COLORES_DE_RUTINA = ['lila', 'celeste', 'coral', 'lima', 'rosa', 'turquesa'];

export function PaginaMiPlan() {
  const { resultado, error, cargando } = usarMiPlan();

  return (
    <section className="pagina pagina-ancha pagina-mi-plan">
      <h1>Mi plan de entrenamiento</h1>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {cargando && (
        <p role="status" className="tenue">
          Cargando tu plan…
        </p>
      )}
      {resultado?.estado === 'sin-plan' && <p className="tenue">No tenés un plan vigente.</p>}
      {resultado?.estado === 'plan' && <CalendarioDelPlan resultado={resultado} />}
    </section>
  );
}

type PlanVigente = Extract<ResultadoMiPlan, { estado: 'plan' }>;

/**
 * RN-PLAN-19 (T25): los 28 días en un calendario de lunes a domingo, con un punto del color de su
 * rutina y una leyenda al costado. Hoy (la fecha del back) va marcado y elegido al entrar; el día
 * elegido muestra su rutina en un panel debajo. Los días del mes siguiente van en segundo plano.
 */
function CalendarioDelPlan({ resultado }: { resultado: PlanVigente }) {
  const { plan, fecha: hoy } = resultado;
  const [elegido, setElegido] = useState<number | null>(null);
  const panel = useRef<HTMLElement>(null);
  const numeroElegido = elegido ?? plan.dias.find((dia) => dia.fecha === hoy)?.numero ?? 1;
  const diaElegido = plan.dias.find((dia) => dia.numero === numeroElegido);
  const primerDia = plan.dias[0];
  const inicioDeLaGrilla = {
    '--columna-inicio': primerDia ? columnaDeLaSemana(primerDia.fecha) : 1,
  } as CSSProperties;
  // Las rutinas del plan, una vez cada una y en el orden en que aparecen.
  const rutinas = plan.dias
    .flatMap((dia) => (dia.rutina ? [dia.rutina] : []))
    .filter((rutina, indice, todas) => todas.findIndex((r) => r.id === rutina.id) === indice);
  const colorDe = (id: string) => {
    const posicion = rutinas.findIndex((r) => r.id === id);
    const color = COLORES_DE_RUTINA[posicion % COLORES_DE_RUTINA.length];
    return { '--color-rutina': `var(--color-seccion-${color})` } as CSSProperties;
  };
  // Las fechas AAAA-MM-DD se comparan como texto: "2026-12" va después de "2026-11".
  const mesDeHoy = hoy.slice(0, 7);

  /** Al tocar un día, su detalle queda a la vista (en el celular está debajo del pliegue). */
  function elegir(numero: number) {
    setElegido(numero);
    requestAnimationFrame(() => panel.current?.scrollIntoView?.({ block: 'nearest' }));
  }

  return (
    <>
      <p className="tenue">
        Del <time dateTime={plan.fechaInicio}>{plan.fechaInicio}</time> al{' '}
        <time dateTime={plan.fechaFin}>{plan.fechaFin}</time>
      </p>
      <div className="calendario-con-leyenda">
        <div className="calendario-alumno">
          <div className="calendario-semana" aria-hidden="true">
            {DIAS_DE_LA_SEMANA.map((inicial, indice) => (
              <span key={indice}>{inicial}</span>
            ))}
          </div>
          <ol className="dias-calendario" aria-label="Días del plan" style={inicioDeLaGrilla}>
            {plan.dias.map((dia) => {
              const esHoy = dia.fecha === hoy;
              const clases = [
                'dia-calendario',
                dia.rutina ? 'con-rutina' : '',
                esHoy ? 'es-hoy' : '',
                dia.numero === numeroElegido ? 'elegido' : '',
                dia.fecha.slice(0, 7) > mesDeHoy ? 'otro-mes' : '',
              ].filter(Boolean);
              return (
                <li key={dia.numero} className={clases.join(' ')}>
                  {/* El nombre del botón es lo que se ve (el número del mes), con el día del plan,
                      su fecha y la rutina o "Descanso" para lectores de pantalla (WCAG 2.5.3).
                      Las tres partes se unen por aria-labelledby, con espacios. */}
                  <button
                    type="button"
                    className="dia-calendario-boton"
                    aria-pressed={dia.numero === numeroElegido}
                    aria-current={esHoy ? 'date' : undefined}
                    aria-labelledby={`dia-${dia.numero}-numero dia-${dia.numero}-fecha dia-${dia.numero}-rutina`}
                    onClick={() => elegir(dia.numero)}
                  >
                    <span id={`dia-${dia.numero}-numero`} className="dia-calendario-numero">
                      {diaDelMes(dia.fecha)}
                    </span>
                    <span id={`dia-${dia.numero}-fecha`} className="solo-lectores">
                      {' · '}Día {dia.numero} —{' '}
                      <time dateTime={dia.fecha}>{etiquetaDeFecha(dia.fecha)}</time>:{' '}
                    </span>
                    {dia.rutina && (
                      <span
                        className="dia-calendario-marca"
                        style={colorDe(dia.rutina.id)}
                        aria-hidden="true"
                      />
                    )}
                    <span id={`dia-${dia.numero}-rutina`} className="solo-lectores">
                      {dia.rutina ? dia.rutina.nombre : 'Descanso'}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
        {/* Leyenda (T25): qué rutina es cada color. En el celular no se muestra; la rutina se ve
            al tocar el día. */}
        <ul className="leyenda-rutinas" aria-label="Rutinas del plan">
          {rutinas.map((rutina) => (
            <li key={rutina.id} style={colorDe(rutina.id)}>
              {rutina.nombre}
            </li>
          ))}
        </ul>
      </div>
      {diaElegido && (
        <section ref={panel} className="detalle-dia" aria-labelledby="detalle-dia-titulo">
          <h2 id="detalle-dia-titulo" className="detalle-dia-titulo" aria-live="polite">
            Día {diaElegido.numero} —{' '}
            <time dateTime={diaElegido.fecha}>{etiquetaDeFecha(diaElegido.fecha)}</time>
          </h2>
          {diaElegido.rutina ? (
            <DetalleRutina rutina={diaElegido.rutina} numeroDia={diaElegido.numero} />
          ) : (
            <p className="detalle-dia-descanso">Día de descanso</p>
          )}
        </section>
      )}
    </>
  );
}
