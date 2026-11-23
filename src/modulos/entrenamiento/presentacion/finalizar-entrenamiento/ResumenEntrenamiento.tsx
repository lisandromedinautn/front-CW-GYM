import type { ResumenEntrenamiento as DatosResumen } from '../../dominio/entrenamiento/entrenamiento.ts';

export function ResumenEntrenamiento({ resumen }: { resumen: DatosResumen }) {
  const minutos = Math.floor(resumen.duracionSegundos / 60);
  const segundos = resumen.duracionSegundos % 60;
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
    </section>
  );
}
