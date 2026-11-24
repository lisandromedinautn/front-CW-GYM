import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { usarCrearRutina } from '../../aplicacion/editor-rutina/usarCrearRutina.ts';
import { usarEjerciciosParaRutina } from '../../aplicacion/editor-rutina/usarEjerciciosParaRutina.ts';
import { tipoDeRutina } from '../../dominio/bloque/reglasBloque.ts';
import { validarNombreRutina } from '../../dominio/rutina/nombreRutina.ts';
import type { PedidoRutina, RutinaCreada } from '../../dominio/rutina/rutina.ts';
import { mover } from '../../dominio/rutina/secuenciaRutina.ts';
import {
  type BloqueEnEdicion,
  bloqueAPedido,
  bloqueVacio,
  type CircuitoEnEdicion,
  circuitoAPedido,
  circuitoVacio,
  ejercicioCircuitoVacio,
  rutinaAEdicion,
  type Errores,
  type ObjetivoEnEdicion,
  sinErrores,
  validarBloque,
  validarCircuito,
} from './edicion.ts';
import { EditorBloque } from './EditorBloque.tsx';
import { EditorCircuito } from './EditorCircuito.tsx';

/**
 * US06, US09 y US10: el profesor arma una rutina por bloques, por circuitos o mixta. Los bloques
 * y circuitos se muestran en el orden de la rutina (`secuencia`), que se cambia con "Subir" y
 * "Bajar" (RN-PLAN-01). US06: con `rutina` y `edicion`, muestra esa rutina y guarda sus cambios.
 */
export function EditorRutina(props: {
  rutina?: RutinaCreada;
  edicion?: Pick<ReturnType<typeof usarCrearRutina>, 'avisar' | 'error' | 'exito' | 'enviando'> & {
    guardar: (pedido: PedidoRutina) => Promise<boolean>;
  };
}) {
  const { ejercicios, error: errorCatalogo } = usarEjerciciosParaRutina();
  const creacion = usarCrearRutina();
  const { avisar, error, exito, enviando } = props.edicion ?? creacion;
  const [inicial] = useState(() =>
    props.rutina ? rutinaAEdicion(props.rutina) : { bloques: [], circuitos: [], secuencia: [] },
  );
  const [nombre, setNombre] = useState(props.rutina?.nombre ?? '');
  const [bloques, setBloques] = useState<BloqueEnEdicion[]>(inicial.bloques);
  const [circuitos, setCircuitos] = useState<CircuitoEnEdicion[]>(inicial.circuitos);
  const [errores, setErrores] = useState<Record<number, Errores>>({});
  /** Claves de bloques y circuitos en el orden de la rutina (RN-PLAN-01). */
  const [secuencia, setSecuencia] = useState<number[]>(inicial.secuencia);

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

  function agregarBloque() {
    const bloque = bloqueVacio();
    setBloques((anteriores) => [...anteriores, bloque]);
    setSecuencia((anterior) => [...anterior, bloque.clave]);
  }

  function agregarCircuito() {
    const circuito = circuitoVacio();
    setCircuitos((anteriores) => [...anteriores, circuito]);
    setSecuencia((anterior) => [...anterior, circuito.clave]);
  }

  function quitar(clave: number) {
    setBloques((anteriores) => anteriores.filter((b) => b.clave !== clave));
    setCircuitos((anteriores) => anteriores.filter((c) => c.clave !== clave));
    setSecuencia((anterior) => anterior.filter((c) => c !== clave));
  }

  /** "Subir" y "Bajar" solo aparecen si hay más de un bloque o circuito. */
  function reordenar(clave: number) {
    if (secuencia.length < 2) return undefined;
    const indice = secuencia.indexOf(clave);
    return {
      puedeSubir: indice > 0,
      puedeBajar: indice < secuencia.length - 1,
      alSubir: () => setSecuencia((anterior) => mover(anterior, indice, 'arriba')),
      alBajar: () => setSecuencia((anterior) => mover(anterior, indice, 'abajo')),
    };
  }

  // Bloques y circuitos en el orden de la rutina; "Bloque N" y "Circuito N" cuentan por tipo.
  const bloquesEnOrden = secuencia.flatMap((clave) => bloques.filter((b) => b.clave === clave));
  const circuitosEnOrden = secuencia.flatMap((clave) => circuitos.filter((c) => c.clave === clave));
  const orden = (clave: number) => secuencia.indexOf(clave) + 1;

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
    // RN-PLAN-21 reflejada: al editar, el nombre va de 1 a 60 caracteres.
    const avisoNombre = props.edicion ? validarNombreRutina(nombre) : null;
    if (avisoNombre) {
      avisar(avisoNombre);
      return;
    }

    // Se manda solo la lista que tiene contenido (contrato de US06 y US09). En una rutina mixta
    // van las dos y cada bloque y circuito lleva su `orden` en la rutina (US10).
    const mixta = bloques.length > 0 && circuitos.length > 0;
    const conOrden = <T,>(clave: number, pedido: T) =>
      mixta ? { orden: orden(clave), ...pedido } : pedido;
    const pedido: PedidoRutina = {
      ...(props.edicion && { nombre: nombre.trim() }),
      ...(bloques.length > 0 && {
        bloques: bloquesEnOrden.map((b) => conOrden(b.clave, bloqueAPedido(b, buscar))),
      }),
      ...(circuitos.length > 0 && {
        circuitos: circuitosEnOrden.map((c) => conOrden(c.clave, circuitoAPedido(c, buscar))),
      }),
    };
    if (props.edicion) {
      await props.edicion.guardar(pedido);
    } else if (await creacion.crear(pedido)) {
      setBloques([]);
      setCircuitos([]);
      setSecuencia([]);
      setErrores({});
    }
  }

  return (
    <section className="pagina">
      <Link to="/profesor/rutinas" className="volver">
        Volver a rutinas
      </Link>
      <h1>{props.rutina ? props.rutina.nombre : 'Nueva rutina'}</h1>
      {errorCatalogo && (
        <p role="alert" className="error">
          {errorCatalogo}
        </p>
      )}
      <form className="formulario" onSubmit={(e) => void guardar(e)} noValidate>
        {props.edicion && (
          <label>
            Nombre
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </label>
        )}
        {tipo && <p className="etiqueta">Tipo de rutina: {tipo}</p>}
        {secuencia.map((clave) => {
          const bloque = bloques.find((b) => b.clave === clave);
          if (bloque) {
            return (
              <EditorBloque
                key={clave}
                numero={bloquesEnOrden.indexOf(bloque) + 1}
                bloque={bloque}
                ejercicios={catalogo}
                errores={errores[clave] ?? {}}
                alCambiar={(campo, valor) => cambiarBloque(clave, campo, valor)}
                alQuitar={() => quitar(clave)}
                reordenar={reordenar(clave)}
              />
            );
          }
          const circuito = circuitos.find((c) => c.clave === clave);
          if (!circuito) return null;
          return (
            <EditorCircuito
              key={clave}
              numero={circuitosEnOrden.indexOf(circuito) + 1}
              circuito={circuito}
              ejercicios={catalogo}
              errores={errores}
              alCambiar={(campo, valor) => {
                cambiarCircuito(clave, (c) => ({ ...c, [campo]: valor }));
                limpiarError(clave, campo);
              }}
              alCambiarEjercicio={(ejercicio, campo, valor) =>
                cambiarEjercicio(clave, ejercicio, campo, valor)
              }
              alAgregarEjercicio={() =>
                cambiarCircuito(clave, (c) => ({
                  ...c,
                  ejercicios: [...c.ejercicios, ejercicioCircuitoVacio()],
                }))
              }
              alQuitarEjercicio={(ejercicio) =>
                cambiarCircuito(clave, (c) => ({
                  ...c,
                  ejercicios: c.ejercicios.filter((e) => e.clave !== ejercicio),
                }))
              }
              alQuitar={() => quitar(clave)}
              reordenar={reordenar(clave)}
            />
          );
        })}
        <div className="barra">
          <button type="button" className="secundario" onClick={agregarBloque}>
            Agregar bloque
          </button>
          <button type="button" className="secundario" onClick={agregarCircuito}>
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
          {props.edicion ? 'Guardar cambios' : 'Guardar rutina'}
        </button>
      </form>
    </section>
  );
}
