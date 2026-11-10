import { useState, type FormEvent } from 'react';
import { usarCrearRutina } from '../../aplicacion/editor-rutina/usarCrearRutina.ts';
import { usarEjerciciosParaRutina } from '../../aplicacion/editor-rutina/usarEjerciciosParaRutina.ts';
import {
  admitePeso,
  campoObjetivo,
  seriesValidas,
  tipoDeRutina,
} from '../../dominio/bloque/reglasBloque.ts';
import type { EjercicioParaRutina, PedidoBloque } from '../../dominio/rutina/rutina.ts';

type CampoNumerico =
  'series' | 'repeticiones' | 'segundos' | 'pesoKg' | 'micropausa' | 'macropausa';
type Campo = 'ejercicioId' | CampoNumerico;

/** Un bloque mientras se edita: todo como texto, tal cual lo escribe el profesor. */
interface BloqueEnEdicion {
  clave: number;
  ejercicioId: string;
  series: string;
  repeticiones: string;
  segundos: string;
  pesoKg: string;
  micropausa: string;
  macropausa: string;
}

type ErroresBloque = Partial<Record<Campo, string>>;

const COMPLETAR = 'Completá este campo';

let proximaClave = 1;
const bloqueVacio = (): BloqueEnEdicion => ({
  clave: proximaClave++,
  ejercicioId: '',
  series: '',
  repeticiones: '',
  segundos: '',
  pesoKg: '',
  micropausa: '',
  macropausa: '',
});

/** RN-PLAN-02 y 04 reflejadas en el front: qué le falta a un bloque antes de enviarlo. */
function validar(bloque: BloqueEnEdicion, ejercicio: EjercicioParaRutina | undefined) {
  const errores: ErroresBloque = {};
  if (!ejercicio) errores.ejercicioId = COMPLETAR;
  if (bloque.series.trim() === '') errores.series = COMPLETAR;
  else if (!seriesValidas(Number(bloque.series))) errores.series = 'Mínimo 1 serie';
  if (ejercicio && bloque[campoObjetivo(ejercicio.tipo)].trim() === '') {
    errores[campoObjetivo(ejercicio.tipo)] = COMPLETAR;
  }
  if (bloque.micropausa.trim() === '') errores.micropausa = COMPLETAR;
  if (bloque.macropausa.trim() === '') errores.macropausa = COMPLETAR;
  return errores;
}

/** Arma el bloque con la forma del contrato: repeticiones o segundos, y peso solo si corresponde. */
function aPedido(bloque: BloqueEnEdicion, ejercicio: EjercicioParaRutina): PedidoBloque {
  const campo = campoObjetivo(ejercicio.tipo);
  return {
    ejercicioId: ejercicio.id,
    series: Number(bloque.series),
    micropausaSegundos: Number(bloque.micropausa),
    macropausaSegundos: Number(bloque.macropausa),
    [campo]: Number(bloque[campo]),
    ...(admitePeso(ejercicio.tipoCarga) && bloque.pesoKg.trim() !== ''
      ? { pesoKg: Number(bloque.pesoKg) }
      : {}),
  };
}

export function EditorRutina() {
  const { ejercicios, error: errorCatalogo } = usarEjerciciosParaRutina();
  const { crear, avisar, error, exito, enviando } = usarCrearRutina();
  const [bloques, setBloques] = useState<BloqueEnEdicion[]>([]);
  const [errores, setErrores] = useState<Record<number, ErroresBloque>>({});

  const tipo = tipoDeRutina(bloques.length);
  const buscar = (id: string) => ejercicios?.find((e) => e.id === id);

  function cambiar(clave: number, campo: Campo, valor: string) {
    setBloques((anteriores) =>
      anteriores.map((b) => (b.clave === clave ? { ...b, [campo]: valor } : b)),
    );
    setErrores((anteriores) => ({
      ...anteriores,
      [clave]: { ...anteriores[clave], [campo]: undefined },
    }));
  }

  function quitar(clave: number) {
    setBloques((anteriores) => anteriores.filter((b) => b.clave !== clave));
  }

  async function guardar(evento: FormEvent) {
    evento.preventDefault();
    // RN-PLAN-01: al menos un bloque.
    if (bloques.length === 0) {
      avisar('Agregá al menos un bloque');
      return;
    }
    const encontrados = Object.fromEntries(
      bloques.map((b) => [b.clave, validar(b, buscar(b.ejercicioId))]),
    );
    setErrores(encontrados);
    if (Object.values(encontrados).some((e) => Object.keys(e).length > 0)) return;

    const pedido = { bloques: bloques.map((b) => aPedido(b, buscar(b.ejercicioId)!)) };
    if (await crear(pedido)) {
      setBloques([]);
      setErrores({});
    }
  }

  return (
    <section className="pagina">
      <h1>Nueva rutina</h1>
      {errorCatalogo && (
        <p role="alert" className="error">
          {errorCatalogo}
        </p>
      )}
      <form className="formulario" onSubmit={(e) => void guardar(e)} noValidate>
        {tipo && <p className="etiqueta">Tipo de rutina: {tipo}</p>}
        {bloques.map((bloque, indice) => {
          const ejercicio = buscar(bloque.ejercicioId);
          const objetivo = ejercicio ? campoObjetivo(ejercicio.tipo) : null;
          const props = { bloque, errores: errores[bloque.clave] ?? {}, alCambiar: cambiar };
          return (
            <fieldset key={bloque.clave} className="bloque">
              <legend>Bloque {indice + 1}</legend>
              <div className="campo">
                <label>
                  Ejercicio
                  <select
                    value={bloque.ejercicioId}
                    onChange={(e) => cambiar(bloque.clave, 'ejercicioId', e.target.value)}
                    aria-invalid={Boolean(props.errores.ejercicioId)}
                  >
                    <option value="">Elegí un ejercicio</option>
                    {(ejercicios ?? []).map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nombre}
                      </option>
                    ))}
                  </select>
                </label>
                {props.errores.ejercicioId && (
                  <span className="error-campo">{props.errores.ejercicioId}</span>
                )}
              </div>
              <CampoNumero {...props} campo="series" etiqueta="Series" minimo={1} />
              {objetivo === 'repeticiones' && (
                <CampoNumero {...props} campo="repeticiones" etiqueta="Repeticiones" minimo={1} />
              )}
              {objetivo === 'segundos' && (
                <CampoNumero {...props} campo="segundos" etiqueta="Tiempo (s)" minimo={1} />
              )}
              {ejercicio && admitePeso(ejercicio.tipoCarga) && (
                <CampoNumero {...props} campo="pesoKg" etiqueta="Peso (kg)" minimo={0} />
              )}
              <CampoNumero {...props} campo="micropausa" etiqueta="Micropausa (s)" minimo={0} />
              <CampoNumero {...props} campo="macropausa" etiqueta="Macropausa (s)" minimo={0} />
              <button type="button" className="secundario" onClick={() => quitar(bloque.clave)}>
                Quitar bloque
              </button>
            </fieldset>
          );
        })}
        <button
          type="button"
          className="secundario"
          onClick={() => setBloques((anteriores) => [...anteriores, bloqueVacio()])}
        >
          Agregar bloque
        </button>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        {exito && (
          <p role="status" className="exito">
            {exito}
          </p>
        )}
        <button type="submit" disabled={enviando}>
          Guardar rutina
        </button>
      </form>
    </section>
  );
}

function CampoNumero(props: {
  bloque: BloqueEnEdicion;
  errores: ErroresBloque;
  campo: CampoNumerico;
  etiqueta: string;
  minimo: number;
  alCambiar: (clave: number, campo: Campo, valor: string) => void;
}) {
  const mensaje = props.errores[props.campo];
  const idError = `error-${props.bloque.clave}-${props.campo}`;
  return (
    <div className="campo">
      <label>
        {props.etiqueta}
        <input
          type="number"
          min={props.minimo}
          value={props.bloque[props.campo]}
          onChange={(e) => props.alCambiar(props.bloque.clave, props.campo, e.target.value)}
          aria-invalid={Boolean(mensaje)}
          aria-describedby={mensaje ? idError : undefined}
        />
      </label>
      {mensaje && (
        <span id={idError} className="error-campo">
          {mensaje}
        </span>
      )}
    </div>
  );
}
