export type Rol = 'Admin' | 'Profesor' | 'Alumno';

export interface Sesion {
  token: string;
  rol: Rol;
}

export const RUTA_INICIO: Record<Rol, string> = {
  Admin: '/admin',
  Profesor: '/profesor',
  Alumno: '/alumno',
};
