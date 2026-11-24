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
      {resultado?.estado === 'sin-plan' && <p>No tenés un plan vigente.</p>}
      {resultado?.estado === 'plan' && (
        <>
          <p className="tenue">
            Del <time dateTime={resultado.plan.fechaInicio}>{resultado.plan.fechaInicio}</time> al{' '}
            <time dateTime={resultado.plan.fechaFin}>{resultado.plan.fechaFin}</time>
          </p>
          <ol className="lista-tarjetas" aria-label="Días del plan">
            {resultado.plan.dias.map((dia) => (
              <li
                key={dia.numero}
                className="tarjeta-rutina"
                aria-labelledby={`dia-del-plan-${dia.numero}`}
              >
                <h2 id={`dia-del-plan-${dia.numero}`}>
                  Día {dia.numero} — <time dateTime={dia.fecha}>{etiquetaDeFecha(dia.fecha)}</time>
                </h2>
                {dia.rutina === null ? (
                  <p>Descanso</p>
                ) : (
                  <details>
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
