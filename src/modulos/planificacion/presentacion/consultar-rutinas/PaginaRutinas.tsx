import { useState } from 'react';
import { Link } from 'react-router';
import { Paginador } from '../../../../compartido/presentacion/paginador/Paginador.tsx';
import { usarConsultarRutinas } from '../../aplicacion/consultar-rutinas/usarConsultarRutinas.ts';
import { usarEjerciciosParaRutina } from '../../aplicacion/editor-rutina/usarEjerciciosParaRutina.ts';
import { usarRenombrarRutina } from '../../aplicacion/renombrar-rutina/usarRenombrarRutina.ts';
import { usarImportarRutina } from '../../aplicacion/importar-rutina/usarImportarRutina.ts';
import {
  ejerciciosDeRutina,
  type EjercicioParaRutina,
  type RutinaCreada,
  resumenRutina,
} from '../../dominio/rutina/rutina.ts';

const RUTA_NUEVA = '/profesor/rutinas/nueva';
const EJERCICIOS_VISIBLES = 3;

/** Consulta paginada de las rutinas del profesor, con el acceso a crear una nueva. */
export function PaginaRutinas() {
  const consulta = usarConsultarRutinas();
  const { resultado, error, cargando } = consulta;
  const { ejercicios } = usarEjerciciosParaRutina();
  const { importar, importando, error: errorImportacion } = usarImportarRutina();
  const [mensaje, setMensaje] = useState<string | null>(null);
  async function copiar(id: string) {
    setMensaje(null);
    const copia = await importar(id);
    if (copia) {
      setMensaje(`Se creó la rutina ${copia.nombre}`);
      consulta.volverAlInicioYRecargar();
    }
  }
  const porId = new Map((ejercicios ?? []).map((e) => [e.id, e]));
  const vacia = resultado !== null && resultado.total === 0;

  return (
    <section className="pagina pagina-ancha">
      <header className="encabezado">
        <h1>Rutinas</h1>
        {!vacia && (
          <Link to={RUTA_NUEVA} className="boton">
            Nueva rutina
          </Link>
        )}
      </header>

      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {errorImportacion && (
        <p role="alert" className="error">
          {errorImportacion}
        </p>
      )}
      {mensaje && (
        <p role="status" className="exito">
          {mensaje}
        </p>
      )}
      {cargando && !resultado && <p className="tenue">Cargando rutinas…</p>}

      {vacia && (
        <div className="vacio">
          <p className="vacio-titulo">Creá tu primera rutina</p>
          <p className="tenue">
            Armala por bloques o por circuitos con los ejercicios del catálogo.
          </p>
          <Link to={RUTA_NUEVA} className="boton">
            Nueva rutina
          </Link>
        </div>
      )}

      {resultado && resultado.items.length > 0 && (
        <>
          <ul className="grilla-rutinas" aria-label="Rutinas">
            {resultado.items.map((rutina) => (
              <TarjetaRutina
                key={rutina.id}
                rutina={rutina}
                porId={porId}
                alRenombrar={consulta.reemplazar}
                alImportar={() => void copiar(rutina.id)}
                importando={importando}
              />
            ))}
          </ul>
          <Paginador
            pagina={consulta.pagina}
            total={resultado.total}
            tamanio={consulta.tamanio}
            alCambiarPagina={consulta.irAPagina}
            alCambiarTamanio={consulta.cambiarTamanio}
          />
        </>
      )}
    </section>
  );
}

function TarjetaRutina(props: {
  rutina: RutinaCreada;
  porId: Map<string, EjercicioParaRutina>;
  alRenombrar: (rutina: RutinaCreada) => void;
  alImportar: () => void;
  importando: boolean;
}) {
  const ids = ejerciciosDeRutina(props.rutina);
  const visibles = ids.slice(0, EJERCICIOS_VISIBLES);
  const restantes = ids.length - visibles.length;
  return (
    <li className="tarjeta-rutina">
      <div className="tarjeta-rutina-cabecera">
        <NombreRutina
          rutina={props.rutina}
          alRenombrar={props.alRenombrar}
          alImportar={props.alImportar}
          importando={props.importando}
        />
        <span className="etiqueta">{props.rutina.tipo}</span>
      </div>
      <p className="tenue">{resumenRutina(props.rutina)}</p>
      <ul className="ejercicios-rutina">
        {visibles.map((id) => {
          const ejercicio = props.porId.get(id);
          return (
            <li key={id}>
              {ejercicio?.urlGif ? (
                <img src={ejercicio.urlGif} alt="" className="miniatura" loading="lazy" />
              ) : (
                <span className="miniatura" aria-hidden="true" />
              )}
              <span>{ejercicio?.nombre ?? 'Ejercicio'}</span>
            </li>
          );
        })}
      </ul>
      {restantes > 0 && <p className="tenue">+{restantes} más</p>}
    </li>
  );
}

/** Nombre de la rutina como título, con edición en el lugar (RN-PLAN-21). */
function NombreRutina(props: {
  rutina: RutinaCreada;
  alRenombrar: (rutina: RutinaCreada) => void;
  alImportar: () => void;
  importando: boolean;
}) {
  const { renombrar, error, guardando, limpiarError } = usarRenombrarRutina(props.rutina.id);
  const [editando, setEditando] = useState(false);
  const [texto, setTexto] = useState(props.rutina.nombre);

  const abrir = () => {
    setTexto(props.rutina.nombre);
    limpiarError();
    setEditando(true);
  };
  const cancelar = () => {
    limpiarError();
    setEditando(false);
  };
  const guardar = async () => {
    const actualizada = await renombrar(texto);
    if (!actualizada) return;
    props.alRenombrar(actualizada);
    setEditando(false);
  };

  if (!editando) {
    return (
      <div className="nombre-rutina">
        <h2>{props.rutina.nombre}</h2>
        <button
          type="button"
          className="secundario boton-icono"
          onClick={abrir}
          aria-label="Editar nombre"
          title="Editar nombre"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L9 17l-4 1 1-4Z" />
          </svg>
        </button>
        <button
          type="button"
          className="secundario boton-icono"
          onClick={props.alImportar}
          disabled={props.importando}
          aria-label="Importar como copia"
          title="Importar como copia"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="8" y="8" width="12" height="12" rx="2" />
            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
          </svg>
        </button>
      </div>
    );
  }
  return (
    <div className="nombre-rutina nombre-rutina-edicion">
      <label>
        Nombre de la rutina
        <input
          type="text"
          value={texto}
          aria-invalid={error ? 'true' : undefined}
          onChange={(e) => setTexto(e.target.value)}
        />
      </label>
      {error && (
        <p role="alert" className="error-campo">
          {error}
        </p>
      )}
      <div className="acciones">
        <button type="button" disabled={guardando} onClick={() => void guardar()}>
          Guardar
        </button>
        <button type="button" className="secundario" onClick={cancelar}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
