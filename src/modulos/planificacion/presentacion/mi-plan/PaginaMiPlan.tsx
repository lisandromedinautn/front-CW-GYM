import { usarMiPlan } from '../../aplicacion/consultar-plan-del-alumno/usarMiPlan.ts';
import { etiquetaDeFecha } from '../../dominio/plan/plan.ts';
import { DetalleRutina } from '../detalle-rutina/DetalleRutina.tsx';

export function PaginaMiPlan() {
  const { resultado, error, cargando } = usarMiPlan();

  return (
    <section className="pagina">
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
      {resultado?.estado === 'plan' && (
        <>
          <p className="tenue">
            Del <time dateTime={resultado.plan.fechaInicio}>{resultado.plan.fechaInicio}</time> al{' '}
            <time dateTime={resultado.plan.fechaFin}>{resultado.plan.fechaFin}</time>
          </p>
          <ol className="dias-alumno" aria-label="Días del plan">
            {resultado.plan.dias.map((dia) => (
              <li
                key={dia.numero}
                className={`dia-alumno${dia.rutina === null ? '' : ' con-rutina'}`}
                aria-labelledby={`dia-del-plan-${dia.numero}`}
              >
                <h2 id={`dia-del-plan-${dia.numero}`} className="dia-alumno-titulo">
                  Día {dia.numero} — <time dateTime={dia.fecha}>{etiquetaDeFecha(dia.fecha)}</time>
                </h2>
                {dia.rutina === null ? (
                  <p className="dia-alumno-descanso">Descanso</p>
                ) : (
                  <details className="dia-alumno-detalle">
                    <summary aria-label={`Ver rutina del día ${dia.numero}: ${dia.rutina.nombre}`}>
                      {dia.rutina.nombre} · {dia.rutina.tipo}
                    </summary>
                    <DetalleRutina rutina={dia.rutina} numeroDia={dia.numero} />
                  </details>
                )}
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
