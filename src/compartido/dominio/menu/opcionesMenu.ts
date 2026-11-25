import type { Rol } from '../sesion/sesion.ts';

/**
 * Color de sección del marco (T19): marca la pestaña activa y la franja del encabezado.
 * Se agrupa por concepto, igual en todos los roles (Ejercicios siempre lima, planes en lila).
 */
export type ColorSeccion = 'turquesa' | 'coral' | 'celeste' | 'lila' | 'lima' | 'rosa';

export interface OpcionMenu {
  etiqueta: string;
  ruta: string;
  seccion: ColorSeccion;
}

/** RN-UI-IDE-01: cada rol ve solo sus opciones. */
export const OPCIONES_MENU: Record<Rol, OpcionMenu[]> = {
  Admin: [
    { etiqueta: 'Profesores', ruta: '/admin/profesores', seccion: 'turquesa' },
    { etiqueta: 'Ejercicios', ruta: '/admin/ejercicios', seccion: 'lima' },
  ],
  Profesor: [
    { etiqueta: 'Mi código', ruta: '/profesor/codigo', seccion: 'turquesa' },
    { etiqueta: 'Ejercicios', ruta: '/profesor/ejercicios', seccion: 'lima' },
    { etiqueta: 'Rutinas', ruta: '/profesor/rutinas', seccion: 'celeste' },
    { etiqueta: 'Planes', ruta: '/profesor/planes', seccion: 'lila' },
    { etiqueta: 'Entrenamientos', ruta: '/profesor/entrenamientos', seccion: 'coral' },
    { etiqueta: 'Notificaciones', ruta: '/profesor/notificaciones', seccion: 'rosa' },
  ],
  Alumno: [
    { etiqueta: 'Mi rutina del día', ruta: '/alumno/rutina-del-dia', seccion: 'coral' },
    { etiqueta: 'Mi plan', ruta: '/alumno/mi-plan', seccion: 'lila' },
    { etiqueta: 'Vincularme con mi profesor', ruta: '/alumno/vinculo', seccion: 'turquesa' },
  ],
};

/** La opción cuya ruta contiene la ruta actual (la más larga gana), o `undefined` en el inicio. */
export function opcionActual(rol: Rol, ruta: string): OpcionMenu | undefined {
  return OPCIONES_MENU[rol]
    .filter((opcion) => ruta === opcion.ruta || ruta.startsWith(`${opcion.ruta}/`))
    .sort((a, b) => b.ruta.length - a.ruta.length)[0];
}
