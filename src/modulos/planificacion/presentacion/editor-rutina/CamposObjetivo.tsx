import { admitePeso, campoObjetivo } from '../../dominio/bloque/reglasBloque.ts';
import type { EjercicioParaRutina } from '../../dominio/rutina/rutina.ts';
import { CampoNumero } from './CampoNumero.tsx';
import type { Errores, ObjetivoEnEdicion } from './edicion.ts';

type CampoObjetivo = 'ejercicioId' | 'repeticiones' | 'segundos' | 'pesoKg';

/**
 * Ejercicio y objetivo de cada serie, compartido por bloques y circuitos:
 * repeticiones o tiempo según el tipo (RN-PLAN-04) y peso solo con Peso Extra (RN-PLAN-05).
 */
export function CamposObjetivo(props: {
  objetivo: ObjetivoEnEdicion;
  ejercicios: EjercicioParaRutina[];
  errores: Errores;
  alCambiar: (campo: CampoObjetivo, valor: string) => void;
}) {
  const { objetivo, errores, alCambiar } = props;
  const ejercicio = props.ejercicios.find((e) => e.id === objetivo.ejercicioId);
  const campo = ejercicio ? campoObjetivo(ejercicio.tipo) : null;
  const id = String(objetivo.clave);
  return (
    <>
      <div className="campo">
        <label>
          Ejercicio
          <select
            value={objetivo.ejercicioId}
            onChange={(e) => alCambiar('ejercicioId', e.target.value)}
            aria-invalid={Boolean(errores.ejercicioId)}
          >
            <option value="">Elegí un ejercicio</option>
            {props.ejercicios.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </label>
        {errores.ejercicioId && <span className="error-campo">{errores.ejercicioId}</span>}
      </div>
      {campo === 'repeticiones' && (
        <CampoNumero
          id={`${id}-repeticiones`}
          etiqueta="Repeticiones"
          minimo={1}
          valor={objetivo.repeticiones}
          error={errores.repeticiones}
          alCambiar={(v) => alCambiar('repeticiones', v)}
        />
      )}
      {campo === 'segundos' && (
        <CampoNumero
          id={`${id}-segundos`}
          etiqueta="Tiempo (s)"
          minimo={1}
          valor={objetivo.segundos}
          error={errores.segundos}
          alCambiar={(v) => alCambiar('segundos', v)}
        />
      )}
      {ejercicio && admitePeso(ejercicio.tipoCarga) && (
        <CampoNumero
          id={`${id}-peso`}
          etiqueta="Peso (kg)"
          minimo={0}
          valor={objetivo.pesoKg}
          alCambiar={(v) => alCambiar('pesoKg', v)}
        />
      )}
    </>
  );
}
