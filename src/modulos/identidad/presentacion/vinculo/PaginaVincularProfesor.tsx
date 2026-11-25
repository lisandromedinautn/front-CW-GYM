import { useState, type FormEvent } from 'react';
import { usarVincularAlumno } from '../../aplicacion/vinculo/usarVincularAlumno.ts';
import { Aviso } from '../../../../compartido/presentacion/estados/Aviso.tsx';

export function PaginaVincularProfesor() {
  const { vincular, error, exito, yaVinculado, enviando } = usarVincularAlumno();
  const [codigo, setCodigo] = useState('');

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    void vincular(codigo);
  }

  return (
    <section className="pagina">
      <h1>Vincularme con mi profesor</h1>
      {!yaVinculado && !exito && (
        <form className="formulario" onSubmit={enviar}>
          <label>
            Código de profesor
            <input
              className="campo-codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              autoCapitalize="characters"
              autoComplete="off"
              required
            />
          </label>
          <button type="submit" className="accion-principal" disabled={enviando}>
            Vincularme
          </button>
        </form>
      )}
      {error && <Aviso tipo="error">{error}</Aviso>}
      {exito && <Aviso tipo="exito">{exito}</Aviso>}
    </section>
  );
}
