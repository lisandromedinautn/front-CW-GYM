import type { ResumenEntrenamiento as DatosResumen } from '../../dominio/entrenamiento/entrenamiento.ts';
import type { RecordBatido } from '../../dominio/record-batido/record-batido.ts';
import { aplanarRecords } from '../../dominio/record-batido/aplanarRecords.ts';

interface Props {
  resumen: DatosResumen;
  recordsBatidos?: RecordBatido[];
}

export function ResumenEntrenamiento({ resumen, recordsBatidos = [] }: Props) {
  const minutos = Math.floor(resumen.duracionSegundos / 60);
  const segundos = resumen.duracionSegundos % 60;
  const filasRecords = aplanarRecords(recordsBatidos);

  return (
    <section aria-label="Resumen del entrenamiento" className="resumen">
      <h2>Resumen del entrenamiento</h2>
      {/* Marcador final (T22): el tanteador del entrenamiento terminado, con los récords. */}
      <div className="marcador-final">
        <div className="marcador-cifras">
          <p className="marcador-cifra">
            <span className="marcador-rotulo">
              Peso total levantado<span className="solo-lectores">: </span>
            </span>
            <span className="marcador-valor">{resumen.volumenKg} kg</span>
          </p>
          <p className="marcador-cifra">
            <span className="marcador-rotulo">
              Duración<span className="solo-lectores">: </span>
            </span>
            <span className="marcador-valor">
              {minutos} min {segundos} s
            </span>
          </p>
        </div>
        {filasRecords.length > 0 && (
          <section aria-label="Récords personales batidos" className="marcador-records">
            <h3>¡Nuevos récords personales!</h3>
            <ul>
              {filasRecords.map((fila, indice) => (
                <li key={`${fila.nombre}-${fila.etiqueta}-${indice}`}>
                  <strong>{fila.nombre}</strong> — {fila.etiqueta}: {fila.valorAnterior}
                  {fila.unidad && ` ${fila.unidad}`} → {fila.valorNuevo}
                  {fila.unidad && ` ${fila.unidad}`}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <h3>Grupos musculares trabajados</h3>
      {resumen.gruposMusculares.length ? (
        <ul className="grupos-musculares">
          {resumen.gruposMusculares.map((grupo) => (
            <li key={grupo} className="etiqueta">
              {grupo}
            </li>
          ))}
        </ul>
      ) : (
        <p>Sin grupos musculares registrados.</p>
      )}
    </section>
  );
}
