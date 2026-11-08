import { Link, useNavigate } from 'react-router';
import { usarSesion } from '../../aplicacion/sesion/usarSesion.ts';
import { OPCIONES_MENU } from '../../dominio/menu/opcionesMenu.ts';
import { RUTA_INICIO } from '../../dominio/sesion/sesion.ts';

export function MenuPrincipal() {
  const { sesion, cerrarSesion } = usarSesion();
  const navegar = useNavigate();
  if (!sesion) return null;

  function salir() {
    cerrarSesion();
    void navegar('/ingreso', { replace: true });
  }

  return (
    <nav aria-label="Menú principal" className="menu">
      <Link to={RUTA_INICIO[sesion.rol]}>Inicio</Link>
      {OPCIONES_MENU[sesion.rol].map((opcion) => (
        <Link key={opcion.ruta} to={opcion.ruta}>
          {opcion.etiqueta}
        </Link>
      ))}
      <button type="button" onClick={salir}>
        Salir
      </button>
    </nav>
  );
}
