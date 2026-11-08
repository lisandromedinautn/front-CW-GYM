import type { Sesion } from '../dominio/sesion.ts';

const CLAVE = 'cwgym.sesion';
const oyentes = new Set<() => void>();
let cache: { crudo: string | null; sesion: Sesion | null } = { crudo: null, sesion: null };

function leerCrudo(): string | null {
  try {
    return localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

function avisar() {
  oyentes.forEach((oyente) => oyente());
}

/** Devuelve la misma referencia mientras el contenido no cambie (para useSyncExternalStore). */
export function leerSesion(): Sesion | null {
  const crudo = leerCrudo();
  if (crudo === cache.crudo) return cache.sesion;
  let sesion: Sesion | null;
  try {
    sesion = crudo ? (JSON.parse(crudo) as Sesion) : null;
  } catch {
    sesion = null;
  }
  cache = { crudo, sesion };
  return sesion;
}

export function guardarSesion(sesion: Sesion): void {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(sesion));
  } catch {
    // sin almacenamiento disponible
  }
  avisar();
}

export function borrarSesion(): void {
  try {
    localStorage.removeItem(CLAVE);
  } catch {
    // sin almacenamiento disponible
  }
  avisar();
}

export function suscribirseASesion(oyente: () => void): () => void {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}
