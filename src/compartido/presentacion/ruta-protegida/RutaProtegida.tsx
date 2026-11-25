import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { usarSesion } from '../../aplicacion/sesion/usarSesion.ts';
import type { Rol } from '../../dominio/sesion/sesion.ts';
import { Aviso } from '../estados/Aviso.tsx';

interface Propiedades {
  rol: Rol;
  children: ReactNode;
}

export function RutaProtegida({ rol, children }: Propiedades) {
  const { sesion } = usarSesion();
  if (!sesion) return <Navigate to="/ingreso" replace />;
  if (sesion.rol !== rol) return <Aviso tipo="error">No tenés acceso a esta sección</Aviso>;
  return children;
}
