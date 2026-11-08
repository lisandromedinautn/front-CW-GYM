import { useState } from 'react';
import { usarListarEjercicios } from '../aplicacion/usarListarEjercicios.ts';
import type { Ejercicio } from '../dominio/ejercicio.ts';

export function ListaEjercicios() {
  const { ejercicios, error } = usarListarEjercicios();
  const [busqueda, setBusqueda] = useState('');
  const [abierto, setAbierto] = useState<Ejercicio | null>(null);

  const termino = busqueda.trim().toLowerCase();
  const visibles = (ejercicios ?? []).filter((e) => e.nombre.toLowerCase().includes(termino));

  return (
    <section className="pagina">
      <h1>Ejercicios</h1>
      <div className="barra">
        <label>
          Buscar por nombre
          <input type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </label>
        <button type="button" disabled>
          Registrar ejercicio
        </button>
      </div>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {ejercicios === null && !error && <p>Cargando…</p>}
      {ejercicios !== null && (
        <ul aria-label="Catálogo de ejercicios" className="lista-tarjetas">
          {visibles.map((e) => (
            <li key={e.id} className="tarjeta-item">
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
      {abierto && (
        <div className="fondo-dialog">
          <div role="dialog" aria-modal="true" aria-labelledby="titulo-ejercicio" className="dialog">
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
