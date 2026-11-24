import { useState } from 'react';
import { Paginador } from '../../../../compartido/presentacion/paginador/Paginador.tsx';
import { usarConsultarEjercicios } from '../../aplicacion/consultar-ejercicios/usarConsultarEjercicios.ts';
import {
  GRUPOS_MUSCULARES,
  MUSCULOS,
  musculosDelGrupo,
  TIPOS_CARGA,
  TIPOS_EJERCICIO,
  type FiltrosEjercicios,
} from '../../dominio/ejercicio/clasificacion.ts';
import type { Ejercicio } from '../../dominio/ejercicio/ejercicio.ts';

const SELECTORES: {
  clave: keyof FiltrosEjercicios;
  etiqueta: string;
  opciones: readonly string[];
}[] = [
  { clave: 'grupo', etiqueta: 'Grupo muscular', opciones: GRUPOS_MUSCULARES },
  { clave: 'musculo', etiqueta: 'Músculo principal', opciones: MUSCULOS },
  { clave: 'tipo', etiqueta: 'Tipo', opciones: TIPOS_EJERCICIO },
  { clave: 'tipoCarga', etiqueta: 'Tipo de carga', opciones: TIPOS_CARGA },
];

export function ListaEjercicios() {
  const catalogo = usarConsultarEjercicios();
  const { resultado, error, filtros } = catalogo;
  const [abierto, setAbierto] = useState<Ejercicio | null>(null);

  return (
    <section className="pagina pagina-ancha">
      <h1>Ejercicios</h1>
      <div className="barra">
        <label>
          Buscar por nombre
          <input
            type="search"
            value={filtros.busqueda}
            onChange={(e) => catalogo.cambiarFiltro('busqueda', e.target.value)}
          />
        </label>
        {SELECTORES.map(({ clave, etiqueta, opciones }) => (
          <label key={clave}>
            {etiqueta}
            <select
              value={filtros[clave]}
              onChange={(e) => catalogo.cambiarFiltro(clave, e.target.value)}
            >
              <option value="">Todos</option>
              {(clave === 'musculo' ? musculosDelGrupo(filtros.grupo) : opciones).map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </label>
        ))}
        <button type="button" className="secundario" onClick={catalogo.limpiarFiltros}>
          Limpiar filtros
        </button>
        <button type="button" disabled>
          Registrar ejercicio
        </button>
      </div>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {resultado === null && !error && <p>Cargando…</p>}
      {resultado !== null && resultado.items.length === 0 && (
        <p className="tenue">No hay ejercicios con esos filtros</p>
      )}
      {resultado !== null && resultado.items.length > 0 && (
        <ul aria-label="Catálogo de ejercicios" className="lista-tarjetas">
          {resultado.items.map((e) => (
            <li key={e.id} className="tarjeta-item">
              <img src={e.urlGif} alt="" className="miniatura" loading="lazy" />
              <button type="button" className="enlace" onClick={() => setAbierto(e)}>
                {e.nombre}
              </button>
              <span className="etiqueta">{e.tipo}</span>
              <span className="etiqueta">{e.tipoCarga}</span>
              <span>{e.musculoPrincipal}</span>
              <span>{e.grupoMuscular}</span>
            </li>
          ))}
        </ul>
      )}
      {resultado !== null && resultado.total > 0 && (
        <Paginador
          pagina={catalogo.pagina}
          total={resultado.total}
          tamanio={catalogo.tamanio}
          alCambiarPagina={catalogo.irAPagina}
          alCambiarTamanio={catalogo.cambiarTamanio}
        />
      )}
      {abierto && (
        <div className="fondo-dialog">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-ejercicio"
            className="dialog"
          >
            <h2 id="titulo-ejercicio">{abierto.nombre}</h2>
            <img src={abierto.urlGif} alt={abierto.nombre} className="gif" />
            <p>{abierto.descripcion}</p>
            <small>{abierto.atribucion}</small>
            <button type="button" onClick={() => setAbierto(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
