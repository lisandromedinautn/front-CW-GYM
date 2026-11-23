import { useEffect, useState } from 'react';
import { usarEntrenamientoEnCurso } from '../../aplicacion/consultar-entrenamiento-en-curso/usarEntrenamientoEnCurso.ts';
import { usarRegistrarSerie } from '../../aplicacion/registrar-serie/usarRegistrarSerie.ts';
import type { Entrenamiento } from '../../dominio/entrenamiento/entrenamiento.ts';
import { agruparSeries } from '../../dominio/serie/filasSeries.ts';
import { ListaSeries } from './ListaSeries.tsx';

export function PaginaEntrenamientoEnCurso() {
  const { resultado, error } = usarEntrenamientoEnCurso();

  return (
    <section className="pagina">
      <h1>Mi entrenamiento</h1>
      {error && <p role="alert">{error}</p>}
      {!resultado && !error && <p>Cargando tu entrenamiento…</p>}
      {resultado?.estado === 'sin-entrenamiento' && <p>No tenés un entrenamiento en curso.</p>}
      {resultado && resultado.estado !== 'sin-entrenamiento' && (
        <DetalleEntrenamiento
          entrenamiento={resultado.entrenamiento}
          abandonado={resultado.estado === 'abandonado'}
        />
      )}
    </section>
  );
}

function DetalleEntrenamiento(props: { entrenamiento: Entrenamiento; abandonado: boolean }) {
  const { entrenamiento } = props;
  const { series, registrar, error, abandonado } = usarRegistrarSerie(
    entrenamiento.id,
    entrenamiento.series ?? [],
  );
  const soloLectura = props.abandonado || abandonado;

  return (
    <>
      <h2>{entrenamiento.rutina.nombre}</h2>
      {soloLectura ? <p>Abandonado</p> : <Contador inicio={entrenamiento.inicio} />}
      {error && <p role="alert">{error}</p>}
      <ListaSeries
        grupos={agruparSeries(entrenamiento.rutina, series)}
        registrar={soloLectura ? undefined : registrar}
      />
    </>
  );
}

function Contador({ inicio }: { inicio: string }) {
  const [ahora, setAhora] = useState(Date.now);
  useEffect(() => {
    const intervalo = window.setInterval(() => setAhora(Date.now()), 1000);
    return () => window.clearInterval(intervalo);
  }, []);

  const segundos = Math.max(0, Math.floor((ahora - Date.parse(inicio)) / 1000));
  const tiempo = [Math.floor(segundos / 3600), Math.floor(segundos / 60) % 60, segundos % 60]
    .map((parte) => String(parte).padStart(2, '0'))
    .join(':');

  return (
    <p role="timer" aria-label="Tiempo transcurrido">
      {tiempo}
    </p>
  );
}
