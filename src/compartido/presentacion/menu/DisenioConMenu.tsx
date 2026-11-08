import { Outlet } from 'react-router';
import { MenuPrincipal } from './MenuPrincipal.tsx';

export function DisenioConMenu() {
  return (
    <>
      <MenuPrincipal />
      <main className="contenido">
        <Outlet />
      </main>
    </>
  );
}
