import { useState } from 'react';
import type { RegistroSerie } from '../../dominio/entrenamiento/entrenamiento.ts';
import { describirMedida, pasoInicial, type FilaSerie } from '../../dominio/serie/filasSeries.ts';
import { FormularioSerie } from './FormularioSerie.tsx';

/** RN-UI-ENT-03: un paso por vez; registrar avanza y "Anterior"/"Siguiente" mueven sin registrar. */
export function PasoActual(props: {
  pasos: FilaSerie[];
  registrar: (registro: RegistroSerie) => Promise<boolean>;
}) {
  const { pasos } = props;
  const [indice, setIndice] = useState(() => pasoInicial(pasos));
  const paso = pasos[indice];
  if (!paso) return null;
  const ultimo = pasos.length - 1;
  const ir = (destino: number) => setIndice(Math.min(Math.max(destino, 0), ultimo));

  return (
    <section aria-label="Paso actual">
      <p>
        Paso {indice + 1} de {pasos.length}
      </p>
      <h3>
        {paso.titulo} · {paso.nombre}
      </h3>
      {paso.urlGif && (
        <figure>
          <img src={paso.urlGif} alt={paso.nombre} className="gif-paso" />
          <figcaption>
            <small>GIF © Gym visual</small>
          </figcaption>
        </figure>
      )}
      <p>Prescripto: {describirMedida(paso.prescripta)}</p>
      {paso.registrada && <p>Registrada: {describirMedida(paso.registrada)}</p>}
      <FormularioSerie
        key={paso.clave}
        fila={paso}
        registrar={props.registrar}
        alRegistrar={() => ir(indice + 1)}
      />
      <div>
        <button type="button" disabled={indice === 0} onClick={() => ir(indice - 1)}>
          Anterior
        </button>
        <button type="button" disabled={indice === ultimo} onClick={() => ir(indice + 1)}>
          Siguiente
        </button>
      </div>
      {indice === ultimo && (
        // Se habilita con US15 (finalizar y ver resumen): hoy el back no tiene la finalización.
        <p>
          <button type="button" disabled aria-describedby="finalizar-pendiente">
            Finalizar entrenamiento
          </button>{' '}
          <small id="finalizar-pendiente">Disponible con US15</small>
        </p>
      )}
    </section>
  );
}
