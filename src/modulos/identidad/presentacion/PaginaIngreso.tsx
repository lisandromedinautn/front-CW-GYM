import { useState, type FormEvent } from 'react';
import { usarIngresarAlSistema } from '../aplicacion/usarIngresarAlSistema.ts';

export function PaginaIngreso() {
  const { ingresarAlSistema, error, enviando } = usarIngresarAlSistema();
  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    void ingresarAlSistema(email, contrasenia);
  }

  return (
    <main className="ingreso">
      <form className="tarjeta" onSubmit={enviar}>
        <h1>Ingresar al sistema</h1>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <button type="submit" disabled={enviando}>
          Ingresar
        </button>
      </form>
    </main>
  );
}
