import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { usarSesion } from '../aplicacion/usarSesion.ts';
import type { Rol } from '../dominio/sesion.ts';

interface Propiedades {
  rol: Rol;
  children: ReactNode;
}

export function RutaProtegida({ rol, children }: Propiedades) {
  const { sesion } = usarSesion();
  if (!sesion) return <Navigate to="/ingreso" replace />;
  if (sesion.rol !== rol) return <p role="alert">No tenés acceso a esta sección</p>;
  return children;
}
