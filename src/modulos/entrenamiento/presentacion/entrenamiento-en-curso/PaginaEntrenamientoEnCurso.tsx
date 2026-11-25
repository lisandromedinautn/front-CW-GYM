import { Link } from 'react-router';
import { usarFinalizarEntrenamiento } from '../../aplicacion/finalizar-entrenamiento/usarFinalizarEntrenamiento.ts';
import { ResumenEntrenamiento } from '../finalizar-entrenamiento/ResumenEntrenamiento.tsx';
import { PercepcionDelResumen } from '../finalizar-entrenamiento/PercepcionDelResumen.tsx';
import { useEffect, useState } from 'react';
import { usarEntrenamientoEnCurso } from '../../aplicacion/consultar-entrenamiento-en-curso/usarEntrenamientoEnCurso.ts';
import { usarRegistrarSerie } from '../../aplicacion/registrar-serie/usarRegistrarSerie.ts';
import type { Entrenamiento } from '../../dominio/entrenamiento/entrenamiento.ts';
import { agruparSeries, pasosDelEntrenamiento } from '../../dominio/serie/filasSeries.ts';
import { ListaSeries } from './ListaSeries.tsx';
import { PasoActual } from './PasoActual.tsx';
import { Aviso } from '../../../../compartido/presentacion/estados/Aviso.tsx';
import { Cargando } from '../../../../compartido/presentacion/estados/Cargando.tsx';
import { EstadoVacio } from '../../../../compartido/presentacion/estados/EstadoVacio.tsx';

export function PaginaEntrenamientoEnCurso() {
  const { resultado, error } = usarEntrenamientoEnCurso();
  const finalizacion = usarFinalizarEntrenamiento();
  const resumen =
    finalizacion.resumen ??
    (resultado?.estado === 'finalizado' ? resultado.entrenamiento.resumen : undefined);

  return (
    <section className="pagina">
      <h1>Mi entrenamiento</h1>
      {error && <Aviso tipo="error">{error}</Aviso>}
      {!resultado && !error && <Cargando>Cargando tu entrenamiento…</Cargando>}
      {resultado?.estado === 'sin-entrenamiento' && (
        <EstadoVacio titulo="No tenés un entrenamiento en curso." />
      )}
      {resultado && resultado.estado !== 'sin-entrenamiento' && (
        <>
          <h2>{resultado.entrenamiento.rutina.nombre}</h2>
          {resumen ? (
            <>
              <ResumenEntrenamiento
                resumen={resumen}
                recordsBatidos={finalizacion.resumen?.recordsBatidos ?? []}
              />
              <PercepcionDelResumen
                entrenamientoId={resultado.entrenamiento.id}
                percepcion={resultado.entrenamiento.percepcion}
              />
              {/* RN-UI-ENT-05: al final del resumen, después de la percepción (T22). */}
              <Link to="/alumno/rutina-del-dia" className="boton secundario volver-inicio">
                Volver al inicio
              </Link>
            </>
          ) : resultado.estado === 'abandonado' ? (
            <DetalleEntrenamiento
              entrenamiento={resultado.entrenamiento}
              abandonado={true}
              finalizacion={finalizacion}
            />
          ) : resultado.estado === 'finalizado' ? (
            <Aviso tipo="error">No se pudo recuperar el resumen.</Aviso>
          ) : (
            <DetalleEntrenamiento
              entrenamiento={resultado.entrenamiento}
              abandonado={false}
              finalizacion={finalizacion}
            />
          )}
        </>
      )}
    </section>
  );
}

function DetalleEntrenamiento(props: {
  entrenamiento: Entrenamiento;
  abandonado: boolean;
  finalizacion: ReturnType<typeof usarFinalizarEntrenamiento>;
}) {
  const { entrenamiento, finalizacion } = props;
  const { series, registrar, error, abandonado } = usarRegistrarSerie(
    entrenamiento.id,
    entrenamiento.series ?? [],
  );
  const soloLectura = props.abandonado || abandonado;
  const grupos = agruparSeries(entrenamiento.rutina, series);

  return (
    <>
      {soloLectura && <p className="etiqueta">Abandonado</p>}
      {error && <Aviso tipo="error">{error}</Aviso>}
      {soloLectura ? (
        <ListaSeries grupos={grupos} />
      ) : (
        <>
          {finalizacion.error && <Aviso tipo="error">{finalizacion.error}</Aviso>}
          <PasoActual
            pasos={pasosDelEntrenamiento(grupos)}
            registrar={registrar}
            finalizar={() => void finalizacion.finalizar(entrenamiento.id)}
            finalizando={finalizacion.finalizando}
            cronometro={<Contador inicio={entrenamiento.inicio} />}
          />
        </>
      )}
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
    <p role="timer" aria-label="Tiempo transcurrido" className="contador">
      {tiempo}
    </p>
  );
}
