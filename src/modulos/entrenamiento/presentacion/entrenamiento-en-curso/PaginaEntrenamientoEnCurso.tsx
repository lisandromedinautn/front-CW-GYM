import { usarFinalizarEntrenamiento } from '../../aplicacion/finalizar-entrenamiento/usarFinalizarEntrenamiento.ts';
import { ResumenEntrenamiento } from '../finalizar-entrenamiento/ResumenEntrenamiento.tsx';
import { useEffect, useState } from 'react';
import { usarEntrenamientoEnCurso } from '../../aplicacion/consultar-entrenamiento-en-curso/usarEntrenamientoEnCurso.ts';

export function PaginaEntrenamientoEnCurso() {
  const { resultado, error } = usarEntrenamientoEnCurso();
  const finalizacion = usarFinalizarEntrenamiento();
  const resumen =
    finalizacion.resumen ??
    (resultado?.estado === 'finalizado' ? resultado.entrenamiento.resumen : undefined);

  return (
    <section className="pagina">
      <h1>Mi entrenamiento</h1>
      {error && <p role="alert">{error}</p>}
      {!resultado && !error && <p>Cargando tu entrenamiento…</p>}
      {resultado?.estado === 'sin-entrenamiento' && <p>No tenés un entrenamiento en curso.</p>}
      {resultado && resultado.estado !== 'sin-entrenamiento' && (
        <>
          <h2>{resultado.entrenamiento.rutina.nombre}</h2>
          {resumen ? (
            <ResumenEntrenamiento resumen={resumen} />
          ) : resultado.estado === 'abandonado' ? (
            <p>Abandonado</p>
          ) : resultado.estado === 'finalizado' ? (
            <p>No se pudo recuperar el resumen.</p>
          ) : (
            <>
              <Contador inicio={resultado.entrenamiento.inicio} />
              {finalizacion.error && <p role="alert">{finalizacion.error}</p>}
              <button
                type="button"
                disabled={finalizacion.finalizando}
                onClick={() => void finalizacion.finalizar(resultado.entrenamiento.id)}
              >
                Finalizar entrenamiento
              </button>
            </>
          )}
        </>
      )}
    </section>
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
