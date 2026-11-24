import {
  etiquetaDelDia,
  objetivoDeEjercicio,
  resumenDeBloque,
  type RutinaDelDiaDetalle,
} from '../../dominio/plan/rutinaDelDia.ts';

export function DetalleRutina(props: { rutina: RutinaDelDiaDetalle; numeroDia: number }) {
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
          <ol className="lista-tarjetas" aria-label="Bloques">
            {rutina.bloques.map((bloque, indice) => (
              <li key={indice} className="tarjeta-rutina">
                <p className="campo">{bloque.nombre}</p>
                <p className="tenue">{resumenDeBloque(bloque)}</p>
                <p className="tenue">
                  Micropausa entre series: {bloque.micropausaSegundos} s · Macropausa al terminar el
                  bloque: {bloque.macropausaSegundos} s
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {rutina.circuitos.length > 0 && (
        <section>
          <h3>Circuitos</h3>
          {rutina.circuitos.map((circuito, indice) => (
            <div key={indice} className="tarjeta-rutina">
              <p className="etiqueta">
                {circuito.vueltas} {circuito.vueltas === 1 ? 'vuelta' : 'vueltas'}
              </p>
              <ol>
                {circuito.ejercicios.map((ejercicio) => (
                  <li key={ejercicio.ejercicioId}>
                    <p className="campo">{ejercicio.nombre}</p>
                    <p className="tenue">{objetivoDeEjercicio(ejercicio)}</p>
                  </li>
                ))}
              </ol>
              <p className="tenue">
                Macropausa al terminar cada vuelta: {circuito.macropausaSegundos} s
              </p>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
