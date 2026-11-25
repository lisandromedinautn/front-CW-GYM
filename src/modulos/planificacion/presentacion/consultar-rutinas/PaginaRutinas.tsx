import { Copy, Pencil } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { Paginador } from '../../../../compartido/presentacion/paginador/Paginador.tsx';
import { usarConsultarRutinas } from '../../aplicacion/consultar-rutinas/usarConsultarRutinas.ts';
import { usarEjerciciosParaRutina } from '../../aplicacion/editor-rutina/usarEjerciciosParaRutina.ts';
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
          <Link to={RUTA_NUEVA} className="boton accion-principal">
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
          <Link to={RUTA_NUEVA} className="boton accion-principal">
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
  alImportar: () => void;
  importando: boolean;
}) {
  const ids = ejerciciosDeRutina(props.rutina);
  const visibles = ids.slice(0, EJERCICIOS_VISIBLES);
  const restantes = ids.length - visibles.length;
  return (
    <li className="tarjeta-rutina">
      <div className="tarjeta-rutina-cabecera">
        <h2>{props.rutina.nombre}</h2>
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
      <AccionesRutina
        rutina={props.rutina}
        alImportar={props.alImportar}
        importando={props.importando}
      />
    </li>
  );
}

/**
 * Pie de la tarjeta (T21): "Editar" abre la rutina en el editor (US06, RN-PLAN-07) e "Importar"
 * crea una copia (US20). El nombre accesible completo contiene el texto visible.
 */
function AccionesRutina(props: {
  rutina: RutinaCreada;
  alImportar: () => void;
  importando: boolean;
}) {
  return (
    <div className="tarjeta-acciones">
      <Link
        to={`/profesor/rutinas/${props.rutina.id}`}
        className="boton secundario"
        aria-label="Editar rutina"
      >
        <Pencil aria-hidden="true" />
        Editar
      </Link>
      <button
        type="button"
        className="secundario"
        onClick={props.alImportar}
        disabled={props.importando}
        aria-label="Importar como copia"
      >
        <Copy aria-hidden="true" />
        Importar
      </button>
    </div>
  );
}
