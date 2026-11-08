import { useState, type FormEvent } from 'react';
import { usarVincularAlumno } from '../aplicacion/usarVincularAlumno.ts';

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
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              autoCapitalize="characters"
              autoComplete="off"
              required
            />
          </label>
          <button type="submit" disabled={enviando}>
            Vincularme
          </button>
        </form>
      )}
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
    </section>
  );
}
