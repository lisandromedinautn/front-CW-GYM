import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { usarCrearRutina } from '../../aplicacion/editor-rutina/usarCrearRutina.ts';
import { usarEjerciciosParaRutina } from '../../aplicacion/editor-rutina/usarEjerciciosParaRutina.ts';
import { tipoDeRutina } from '../../dominio/bloque/reglasBloque.ts';
import type { PedidoRutina } from '../../dominio/rutina/rutina.ts';
import {
  type BloqueEnEdicion,
  bloqueAPedido,
  bloqueVacio,
  type CircuitoEnEdicion,
  circuitoAPedido,
  circuitoVacio,
  ejercicioCircuitoVacio,
  type Errores,
  type ObjetivoEnEdicion,
  sinErrores,
  validarBloque,
  validarCircuito,
} from './edicion.ts';
import { EditorBloque } from './EditorBloque.tsx';
import { EditorCircuito } from './EditorCircuito.tsx';

/**
 * US06 y US09: el profesor arma una rutina por bloques o por circuitos. Hasta US10 (rutina
 * mixta) no se mezclan: con bloques no se puede agregar un circuito, y al revés.
 */
export function EditorRutina() {
  const { ejercicios, error: errorCatalogo } = usarEjerciciosParaRutina();
  const { crear, avisar, error, exito, enviando } = usarCrearRutina();
  const [bloques, setBloques] = useState<BloqueEnEdicion[]>([]);
  const [circuitos, setCircuitos] = useState<CircuitoEnEdicion[]>([]);
  const [errores, setErrores] = useState<Record<number, Errores>>({});

  const catalogo = ejercicios ?? [];
  const buscar = (id: string) => catalogo.find((e) => e.id === id);
  const tipo = tipoDeRutina(bloques.length, circuitos.length);

  /** Al editar un campo se borra su error; `general` es el error del circuito entero. */
  function limpiarError(clave: number, ...campos: string[]) {
    setErrores((anteriores) => ({
      ...anteriores,
      [clave]: { ...anteriores[clave], ...Object.fromEntries(campos.map((c) => [c, undefined])) },
    }));
  }

  function cambiarBloque(clave: number, campo: keyof BloqueEnEdicion, valor: string) {
    setBloques((anteriores) =>
      anteriores.map((b) => (b.clave === clave ? { ...b, [campo]: valor } : b)),
    );
    limpiarError(clave, campo);
  }

  function cambiarCircuito(clave: number, cambio: (c: CircuitoEnEdicion) => CircuitoEnEdicion) {
    setCircuitos((anteriores) => anteriores.map((c) => (c.clave === clave ? cambio(c) : c)));
    limpiarError(clave, 'general');
  }

  function cambiarEjercicio(
    circuito: number,
    clave: number,
    campo: keyof ObjetivoEnEdicion,
    valor: string,
  ) {
    cambiarCircuito(circuito, (c) => ({
      ...c,
      ejercicios: c.ejercicios.map((e) => (e.clave === clave ? { ...e, [campo]: valor } : e)),
    }));
    limpiarError(clave, campo);
  }

  async function guardar(evento: FormEvent) {
    evento.preventDefault();
    // RN-PLAN-01: al menos un bloque o un circuito.
    if (bloques.length + circuitos.length === 0) {
      avisar('Agregá al menos un bloque o un circuito');
      return;
    }
    const encontrados: Record<number, Errores> = Object.assign(
      {},
      ...bloques.map((b) => ({ [b.clave]: validarBloque(b, buscar) })),
      ...circuitos.map((c) => validarCircuito(c, buscar)),
    );
    setErrores(encontrados);
    if (!sinErrores(encontrados)) return;

    // Se manda solo la lista que tiene contenido (contrato de US06 y US09).
    const pedido: PedidoRutina =
      circuitos.length > 0
        ? { circuitos: circuitos.map((c) => circuitoAPedido(c, buscar)) }
        : { bloques: bloques.map((b) => bloqueAPedido(b, buscar)) };
    if (await crear(pedido)) {
      setBloques([]);
      setCircuitos([]);
      setErrores({});
    }
  }

  return (
    <section className="pagina">
      <Link to="/profesor/rutinas" className="volver">
        Volver a rutinas
      </Link>
      <h1>Nueva rutina</h1>
      {errorCatalogo && (
        <p role="alert" className="error">
          {errorCatalogo}
        </p>
      )}
      <form className="formulario" onSubmit={(e) => void guardar(e)} noValidate>
        {tipo && <p className="etiqueta">Tipo de rutina: {tipo}</p>}
        {bloques.map((bloque, indice) => (
          <EditorBloque
            key={bloque.clave}
            numero={indice + 1}
            bloque={bloque}
            ejercicios={catalogo}
            errores={errores[bloque.clave] ?? {}}
            alCambiar={(campo, valor) => cambiarBloque(bloque.clave, campo, valor)}
            alQuitar={() => setBloques((anteriores) => anteriores.filter((b) => b !== bloque))}
          />
        ))}
        {circuitos.map((circuito, indice) => (
          <EditorCircuito
            key={circuito.clave}
            numero={indice + 1}
            circuito={circuito}
            ejercicios={catalogo}
            errores={errores}
            alCambiar={(campo, valor) => {
              cambiarCircuito(circuito.clave, (c) => ({ ...c, [campo]: valor }));
              limpiarError(circuito.clave, campo);
            }}
            alCambiarEjercicio={(clave, campo, valor) =>
              cambiarEjercicio(circuito.clave, clave, campo, valor)
            }
            alAgregarEjercicio={() =>
              cambiarCircuito(circuito.clave, (c) => ({
                ...c,
                ejercicios: [...c.ejercicios, ejercicioCircuitoVacio()],
              }))
            }
            alQuitarEjercicio={(clave) =>
              cambiarCircuito(circuito.clave, (c) => ({
                ...c,
                ejercicios: c.ejercicios.filter((e) => e.clave !== clave),
              }))
            }
            alQuitar={() => setCircuitos((anteriores) => anteriores.filter((c) => c !== circuito))}
          />
        ))}
        <div className="barra">
          <button
            type="button"
            className="secundario"
            disabled={circuitos.length > 0}
            onClick={() => setBloques((anteriores) => [...anteriores, bloqueVacio()])}
          >
            Agregar bloque
          </button>
          <button
            type="button"
            className="secundario"
            disabled={bloques.length > 0}
            onClick={() => setCircuitos((anteriores) => [...anteriores, circuitoVacio()])}
          >
            Agregar circuito
          </button>
        </div>
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
