import { useSyncExternalStore } from 'react';
import {
  borrarSesion,
  guardarSesion,
  leerSesion,
  suscribirseASesion,
} from '../infraestructura/almacenSesion.ts';

export function usarSesion() {
  const sesion = useSyncExternalStore(suscribirseASesion, leerSesion);
  return { sesion, guardarSesion, cerrarSesion: borrarSesion };
}
