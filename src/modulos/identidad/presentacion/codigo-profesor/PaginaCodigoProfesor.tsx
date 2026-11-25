import { useState } from 'react';
import { usarCodigoProfesor } from '../../aplicacion/codigo-profesor/usarCodigoProfesor.ts';
import { Aviso } from '../../../../compartido/presentacion/estados/Aviso.tsx';
import { EstadoVacio } from '../../../../compartido/presentacion/estados/EstadoVacio.tsx';

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
      {error && <Aviso tipo="error">{error}</Aviso>}
      {cargado && codigo === null && (
        <EstadoVacio
          titulo="Todavía no generaste tu código"
          accion={
            <button type="button" className="accion-principal" onClick={() => void generar()}>
              Generar código
            </button>
          }
        />
      )}
      {cargado && codigo !== null && (
        <div className="formulario">
          <p className="codigo">{codigo}</p>
          <div className="acciones">
            <button type="button" className="accion-principal" onClick={() => void copiar()}>
              Copiar
            </button>
            <button type="button" className="secundario" onClick={() => setConfirmando(true)}>
              Regenerar código
            </button>
          </div>
        </div>
      )}
      {aviso && <Aviso tipo="exito">{aviso}</Aviso>}
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
              <button type="button" className="peligro" onClick={() => void regenerar()}>
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
