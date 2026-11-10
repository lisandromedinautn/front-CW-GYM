import type { EjercicioParaRutina } from '../../dominio/rutina/rutina.ts';
import { CampoNumero } from './CampoNumero.tsx';
import { CamposObjetivo } from './CamposObjetivo.tsx';
import type { CircuitoEnEdicion, Errores, ObjetivoEnEdicion } from './edicion.ts';

/**
 * RN-PLAN-03: un circuito pide 2 o más ejercicios, vueltas y macropausa. No muestra micropausa.
 * Los errores van por clave: la del circuito (vueltas, macropausa, general) y la de cada ejercicio.
 */
export function EditorCircuito(props: {
  numero: number;
  circuito: CircuitoEnEdicion;
  ejercicios: EjercicioParaRutina[];
  errores: Record<number, Errores>;
  alCambiar: (campo: 'vueltas' | 'macropausa', valor: string) => void;
  alCambiarEjercicio: (clave: number, campo: keyof ObjetivoEnEdicion, valor: string) => void;
  alAgregarEjercicio: () => void;
  alQuitarEjercicio: (clave: number) => void;
  alQuitar: () => void;
}) {
  const { circuito } = props;
  const errores = props.errores[circuito.clave] ?? {};
  const id = String(circuito.clave);
  return (
    <fieldset className="bloque">
      <legend>Circuito {props.numero}</legend>
      {circuito.ejercicios.map((ejercicio, indice) => (
        <fieldset key={ejercicio.clave} className="bloque">
          <legend>Ejercicio {indice + 1}</legend>
          <CamposObjetivo
            objetivo={ejercicio}
            ejercicios={props.ejercicios}
            errores={props.errores[ejercicio.clave] ?? {}}
            alCambiar={(campo, valor) => props.alCambiarEjercicio(ejercicio.clave, campo, valor)}
          />
          <button
            type="button"
            className="secundario"
            onClick={() => props.alQuitarEjercicio(ejercicio.clave)}
          >
            Quitar ejercicio
          </button>
        </fieldset>
      ))}
      <button type="button" className="secundario" onClick={props.alAgregarEjercicio}>
        Agregar ejercicio
      </button>
      {errores.general && <span className="error-campo">{errores.general}</span>}
      <CampoNumero
        id={`${id}-vueltas`}
        etiqueta="Vueltas"
        minimo={1}
        valor={circuito.vueltas}
        error={errores.vueltas}
        alCambiar={(v) => props.alCambiar('vueltas', v)}
      />
      <CampoNumero
        id={`${id}-macropausa`}
        etiqueta="Macropausa (s)"
        minimo={0}
        valor={circuito.macropausa}
        error={errores.macropausa}
        alCambiar={(v) => props.alCambiar('macropausa', v)}
      />
      <button type="button" className="secundario" onClick={props.alQuitar}>
        Quitar circuito
      </button>
    </fieldset>
  );
}
