import { describirMedida, type GrupoSeries } from '../../dominio/serie/filasSeries.ts';

/** Vista de solo lectura de todas las series (entrenamiento abandonado, RN-ENT-20). */
export function ListaSeries({ grupos }: { grupos: GrupoSeries[] }) {
  return (
    <>
      {grupos.map((grupo) => (
        <section key={grupo.orden}>
          <h3>{grupo.titulo}</h3>
          <ul>
            {grupo.filas.map((fila) => (
              <li key={fila.clave} role="group" aria-label={`${fila.titulo} de ${fila.nombre}`}>
                <strong>
                  {fila.titulo} · {fila.nombre}
                </strong>
                <p>Prescripto: {describirMedida(fila.prescripta)}</p>
                {fila.registrada && <p>Registrada: {describirMedida(fila.registrada)}</p>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
