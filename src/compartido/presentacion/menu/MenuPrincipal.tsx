import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router';
import { usarSesion } from '../../aplicacion/sesion/usarSesion.ts';
import { OPCIONES_MENU, opcionActual } from '../../dominio/menu/opcionesMenu.ts';
import { RUTA_INICIO } from '../../dominio/sesion/sesion.ts';

interface Props {
  /** Contenido opcional que la raíz de composición suma a la opción de menú con esa ruta. */
  extras?: Record<string, ReactNode>;
}

/**
 * Marco de cancha (T19): marca, menú por rol (RN-UI-IDE-01) y "Salir". La opción activa lleva
 * `aria-current="page"` y su color de sección pinta la pestaña y la franja del marco.
 */
export function MenuPrincipal({ extras = {} }: Props) {
  const { sesion, cerrarSesion } = usarSesion();
  const navegar = useNavigate();
  const { pathname } = useLocation();
  const menu = useRef<HTMLElement>(null);

  // En el celular la tira se desliza: la pestaña activa queda a la vista al cambiar de página.
  // Solo se mueve la tira en horizontal (nunca la página), respetando su scroll-padding. Se repite si
  // la pestaña cambia de ancho: el contador de no leídas llega después y la agranda.
  useEffect(() => {
    const tira = menu.current;
    const activa = tira?.querySelector('[aria-current="page"]');
    if (!tira || !activa) return;
    const llevarALaVista = () => {
      const margen = parseFloat(getComputedStyle(tira).scrollPaddingInlineStart) || 0;
      const izquierda = activa.getBoundingClientRect().left - tira.getBoundingClientRect().left;
      const derecha = izquierda + activa.getBoundingClientRect().width;
      if (izquierda < margen) tira.scrollLeft += izquierda - margen;
      else if (derecha > tira.clientWidth - margen)
        tira.scrollLeft += derecha - (tira.clientWidth - margen);
    };
    llevarALaVista();
    if (typeof ResizeObserver === 'undefined') return;
    const observador = new ResizeObserver(llevarALaVista);
    observador.observe(activa);
    return () => observador.disconnect();
  }, [pathname]);

  if (!sesion) return null;

  function salir() {
    cerrarSesion();
    void navegar('/ingreso', { replace: true });
  }

  const actual = opcionActual(sesion.rol, pathname);
  const estiloMarco = actual
    ? ({ '--color-seccion-actual': `var(--color-seccion-${actual.seccion})` } as CSSProperties)
    : undefined;

  return (
    <header className="marco" style={estiloMarco}>
      <div className="marco-interior">
        <span className="marca" aria-hidden="true">
          CW-GYM
        </span>
        <nav ref={menu} aria-label="Menú principal" className="menu">
          <NavLink to={RUTA_INICIO[sesion.rol]} end>
            Inicio
          </NavLink>
          {OPCIONES_MENU[sesion.rol].map((opcion) => (
            <NavLink
              key={opcion.ruta}
              to={opcion.ruta}
              style={
                {
                  '--color-seccion-opcion': `var(--color-seccion-${opcion.seccion})`,
                } as CSSProperties
              }
            >
              {opcion.etiqueta}
              {extras[opcion.ruta]}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="marco-salir" onClick={salir}>
          Salir
        </button>
      </div>
    </header>
  );
}
