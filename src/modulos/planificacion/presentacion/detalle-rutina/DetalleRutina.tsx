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
      <header className="encabezado encabezado-rutina">
        <h2>{rutina.nombre}</h2>
        <span className="etiqueta">{rutina.tipo}</span>
        <p className="etiqueta">{etiquetaDelDia(props.numeroDia)}</p>
      </header>

      {rutina.bloques.length > 0 && (
        <section>
          <h3>Bloques</h3>
          <ol className="lista-ejercicios" aria-label="Bloques">
            {rutina.bloques.map((bloque, indice) => (
              <li key={indice} className="ejercicio-fila">
                <p className="ejercicio-nombre">{bloque.nombre}</p>
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
            <div key={indice} className="circuito-detalle">
              <p className="etiqueta">
                {circuito.vueltas} {circuito.vueltas === 1 ? 'vuelta' : 'vueltas'}
              </p>
              <ol className="lista-ejercicios">
                {circuito.ejercicios.map((ejercicio) => (
                  <li key={ejercicio.ejercicioId} className="ejercicio-fila">
                    <p className="ejercicio-nombre">{ejercicio.nombre}</p>
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
