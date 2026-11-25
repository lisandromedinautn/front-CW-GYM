import { useState, type ReactNode } from 'react';
import type { RegistroSerie } from '../../dominio/entrenamiento/entrenamiento.ts';
import { describirMedida, pasoInicial, type FilaSerie } from '../../dominio/serie/filasSeries.ts';
import { FormularioSerie } from './FormularioSerie.tsx';

/** RN-UI-ENT-03: un paso por vez; registrar avanza y "Anterior"/"Siguiente" mueven sin registrar. */
export function PasoActual(props: {
  pasos: FilaSerie[];
  registrar: (registro: RegistroSerie) => Promise<boolean>;
  /** US15: el último paso ofrece finalizar el entrenamiento. */
  finalizar: () => void;
  finalizando: boolean;
  /** T22: el cronómetro, que va en el tanteador junto con el paso. */
  cronometro?: ReactNode;
}) {
  const { pasos } = props;
  const [indice, setIndice] = useState(() => pasoInicial(pasos));
  const paso = pasos[indice];
  // Sin pasos, el cronómetro se sigue mostrando en el tanteador.
  if (!paso) return props.cronometro ? <div className="tanteador">{props.cronometro}</div> : null;
  const ultimo = pasos.length - 1;
  const ir = (destino: number) => setIndice(Math.min(Math.max(destino, 0), ultimo));

  return (
    <section aria-label="Paso actual" className="paso">
      {/* Tanteador (T22): lo único vivo de la pantalla; queda fijo arriba al desplazarse. */}
      <div className="tanteador">
        {props.cronometro}
        <p className="tanteador-paso">
          Paso {indice + 1} de {pasos.length}
        </p>
        <div className="tanteador-avance" aria-hidden="true">
          <span style={{ width: `${((indice + 1) / pasos.length) * 100}%` }} />
        </div>
      </div>
      <h3 className="paso-titulo">
        {paso.titulo} · {paso.nombre}
      </h3>
      {paso.urlGif && (
        <figure className="paso-gif">
          <img src={paso.urlGif} alt={paso.nombre} className="gif-paso" />
          <figcaption>
            <small>GIF © Gym visual</small>
          </figcaption>
        </figure>
      )}
      <p className="paso-prescripto">Prescripto: {describirMedida(paso.prescripta)}</p>
      {paso.registrada && (
        <p className="paso-registrada">Registrada: {describirMedida(paso.registrada)}</p>
      )}
      <FormularioSerie
        key={paso.clave}
        fila={paso}
        registrar={props.registrar}
        alRegistrar={() => ir(indice + 1)}
      />
      <div className="paso-navegacion">
        <button
          type="button"
          className="secundario"
          disabled={indice === 0}
          onClick={() => ir(indice - 1)}
        >
          Anterior
        </button>
        <button
          type="button"
          className="secundario"
          disabled={indice === ultimo}
          onClick={() => ir(indice + 1)}
        >
          Siguiente
        </button>
      </div>
      {indice === ultimo && (
        <button
          type="button"
          className="paso-finalizar"
          disabled={props.finalizando}
          onClick={props.finalizar}
        >
          Finalizar entrenamiento
        </button>
      )}
    </section>
  );
}
