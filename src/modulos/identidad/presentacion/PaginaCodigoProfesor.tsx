import { useState } from 'react';
import { usarCodigoProfesor } from '../aplicacion/usarCodigoProfesor.ts';

export function PaginaCodigoProfesor() {
  const { codigo, cargado, error, aviso, generar, copiar } = usarCodigoProfesor();
  const [confirmando, setConfirmando] = useState(false);

  async function regenerar() {
    setConfirmando(false);
    await generar();
  }

  return (
    <section className="pagina">
      <h1>Mi código de profesor</h1>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {cargado && codigo === null && (
        <div className="formulario">
          <p>Todavía no generaste tu código</p>
          <div className="acciones">
            <button type="button" onClick={() => void generar()}>
              Generar código
            </button>
          </div>
        </div>
      )}
      {cargado && codigo !== null && (
        <div className="formulario">
          <p className="codigo">{codigo}</p>
          <div className="acciones">
            <button type="button" onClick={() => void copiar()}>
              Copiar
            </button>
            <button type="button" className="secundario" onClick={() => setConfirmando(true)}>
              Regenerar código
            </button>
          </div>
        </div>
      )}
      {aviso && (
        <p role="status" className="exito">
          {aviso}
        </p>
      )}
      {confirmando && (
        <div className="fondo-dialog">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-regenerar"
            className="dialog"
          >
            <h2 id="titulo-regenerar">Regenerar código</h2>
            <p>El código anterior deja de funcionar</p>
            <div className="acciones">
              <button type="button" onClick={() => void regenerar()}>
                Regenerar
              </button>
              <button type="button" className="secundario" onClick={() => setConfirmando(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
