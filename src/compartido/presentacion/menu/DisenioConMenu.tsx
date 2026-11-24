import type { ReactNode } from 'react';
import { Outlet } from 'react-router';
import { MenuPrincipal } from './MenuPrincipal.tsx';

interface Props {
  /** Contenido opcional por ruta de opción de menú (lo arma la raíz de composición). */
  extrasMenu?: Record<string, ReactNode>;
}

export function DisenioConMenu({ extrasMenu }: Props) {
  return (
    <>
      <MenuPrincipal extras={extrasMenu} />
      <main className="contenido">
        <Outlet />
      </main>
    </>
  );
}
