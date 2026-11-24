import type { ResumenEntrenamiento as DatosResumen } from '../../dominio/entrenamiento/entrenamiento.ts';
import { Link } from 'react-router';
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
    <section aria-label="Resumen del entrenamiento">
      <h2>Resumen del entrenamiento</h2>
      <p>Peso total levantado: {resumen.volumenKg} kg</p>
      <p>
        Duración: {minutos} min {segundos} s
      </p>
      <h3>Grupos musculares trabajados</h3>
      {resumen.gruposMusculares.length ? (
        <ul>
          {resumen.gruposMusculares.map((grupo) => (
            <li key={grupo}>{grupo}</li>
          ))}
        </ul>
      ) : (
        <p>Sin grupos musculares registrados.</p>
      )}

      {filasRecords.length > 0 && (
        <section aria-label="Récords personales batidos">
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

      <p>
        <Link to="/alumno/rutina-del-dia">Volver al inicio</Link>
      </p>
    </section>
  );
}
