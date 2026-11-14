import { usarRutinaDelDia } from '../../aplicacion/consultar-rutina-del-dia/usarRutinaDelDia.ts';
import {
  etiquetaDelDia,
  objetivoDeEjercicio,
  resumenDeBloque,
  type RutinaDelDiaDetalle,
} from '../../dominio/plan/rutinaDelDia.ts';

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

      {resultado?.estado === 'sin-plan' && <p>No tenés un plan vigente.</p>}

      {resultado?.estado === 'descanso' && (
        <>
          <p className="etiqueta">{etiquetaDelDia(resultado.numeroDia)}</p>
          <p>Hoy es día de descanso.</p>
        </>
      )}

      {resultado?.estado === 'rutina' && (
        <Detalle rutina={resultado.rutina} numeroDia={resultado.numeroDia} />
      )}
    </section>
  );
}

function Detalle(props: { rutina: RutinaDelDiaDetalle; numeroDia: number }) {
  const { rutina } = props;
  return (
    <>
      <header className="encabezado">
        <h2>{rutina.nombre}</h2>
        <span className="etiqueta">{rutina.tipo}</span>
      </header>
      <p className="etiqueta">{etiquetaDelDia(props.numeroDia)}</p>

      {rutina.bloques.length > 0 && (
        <section>
          <h3>Bloques</h3>
          <ul className="lista-ejercicios">
            {rutina.bloques.map((bloque) => (
              <li key={bloque.ejercicioId}>
                <p className="campo">{bloque.nombre}</p>
                <p className="tenue">{resumenDeBloque(bloque)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {rutina.circuitos.length > 0 && (
        <section>
          <h3>Circuitos</h3>
          {rutina.circuitos.map((circuito) => (
            <div key={circuito.ejercicios.map((ejercicio) => ejercicio.ejercicioId).join('|')}>
              <p className="etiqueta">
                {circuito.vueltas} {circuito.vueltas === 1 ? 'vuelta' : 'vueltas'}
              </p>
              <ul className="lista-ejercicios">
                {circuito.ejercicios.map((ejercicio) => (
                  <li key={ejercicio.ejercicioId}>
                    <p className="campo">{ejercicio.nombre}</p>
                    <p className="tenue">{objetivoDeEjercicio(ejercicio)}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
