import type { Rol } from '../sesion/sesion.ts';

export interface OpcionMenu {
  etiqueta: string;
  ruta: string;
}

/** RN-UI-IDE-01: cada rol ve solo sus opciones. */
export const OPCIONES_MENU: Record<Rol, OpcionMenu[]> = {
  Admin: [
    { etiqueta: 'Profesores', ruta: '/admin/profesores' },
    { etiqueta: 'Ejercicios', ruta: '/admin/ejercicios' },
  ],
  Profesor: [
    { etiqueta: 'Mi código', ruta: '/profesor/codigo' },
    { etiqueta: 'Ejercicios', ruta: '/profesor/ejercicios' },
    { etiqueta: 'Rutinas', ruta: '/profesor/rutinas' },
    { etiqueta: 'Planes', ruta: '/profesor/planes' },
  ],
  Alumno: [{ etiqueta: 'Vincularme con mi profesor', ruta: '/alumno/vinculo' }],
};
