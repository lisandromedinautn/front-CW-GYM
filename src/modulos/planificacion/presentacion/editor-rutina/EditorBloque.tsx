import type { EjercicioParaRutina } from '../../dominio/rutina/rutina.ts';
import { CampoNumero } from './CampoNumero.tsx';
import { CamposObjetivo } from './CamposObjetivo.tsx';
import type { BloqueEnEdicion, Errores } from './edicion.ts';

/** RN-PLAN-02: un bloque pide ejercicio, series, micropausa y macropausa. */
export function EditorBloque(props: {
  numero: number;
  bloque: BloqueEnEdicion;
  ejercicios: EjercicioParaRutina[];
  errores: Errores;
  alCambiar: (campo: keyof BloqueEnEdicion, valor: string) => void;
  alQuitar: () => void;
}) {
  const { bloque, errores, alCambiar } = props;
  const id = String(bloque.clave);
  return (
    <fieldset className="bloque">
      <legend>Bloque {props.numero}</legend>
      <CamposObjetivo
        objetivo={bloque}
        ejercicios={props.ejercicios}
        errores={errores}
        alCambiar={alCambiar}
      />
      <CampoNumero
        id={`${id}-series`}
        etiqueta="Series"
        minimo={1}
        valor={bloque.series}
        error={errores.series}
        alCambiar={(v) => alCambiar('series', v)}
      />
      <CampoNumero
        id={`${id}-micropausa`}
        etiqueta="Micropausa (s)"
        minimo={0}
        valor={bloque.micropausa}
        error={errores.micropausa}
        alCambiar={(v) => alCambiar('micropausa', v)}
      />
      <CampoNumero
        id={`${id}-macropausa`}
        etiqueta="Macropausa (s)"
        minimo={0}
        valor={bloque.macropausa}
        error={errores.macropausa}
        alCambiar={(v) => alCambiar('macropausa', v)}
      />
      <button type="button" className="secundario" onClick={props.alQuitar}>
        Quitar bloque
      </button>
    </fieldset>
  );
}
