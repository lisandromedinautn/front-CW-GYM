import { TAMANIOS_PAGINA, totalPaginas } from '../../dominio/paginacion/paginacion.ts';

interface Props {
  pagina: number;
  total: number;
  tamanio: number;
  alCambiarPagina: (pagina: number) => void;
  /** Quien lo usa vuelve a la página 1 al cambiar el tamaño. */
  alCambiarTamanio: (tamanio: number) => void;
}

/** Paginador de los listados: anterior, siguiente, "Página X de Y" y el tamaño de página (T06). */
export function Paginador(props: Props) {
  const paginas = totalPaginas(props);
  return (
    <nav className="paginacion" aria-label="Paginación">
      <button
        type="button"
        className="secundario"
        disabled={props.pagina <= 1}
        onClick={() => props.alCambiarPagina(props.pagina - 1)}
      >
        Anterior
      </button>
      <span>
        Página {props.pagina} de {paginas}
      </span>
      <button
        type="button"
        className="secundario"
        disabled={props.pagina >= paginas}
        onClick={() => props.alCambiarPagina(props.pagina + 1)}
      >
        Siguiente
      </button>
      <label className="por-pagina">
        Por página
        <select
          value={props.tamanio}
          onChange={(e) => props.alCambiarTamanio(Number(e.target.value))}
        >
          {TAMANIOS_PAGINA.map((tamanio) => (
            <option key={tamanio} value={tamanio}>
              {tamanio}
            </option>
          ))}
        </select>
      </label>
    </nav>
  );
}
