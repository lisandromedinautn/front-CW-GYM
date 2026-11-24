import { esErrorApi, type ErrorApi } from '../../dominio/error-api/errorApi.ts';
import { borrarSesion, leerSesion } from '../sesion/almacenSesion.ts';

const URL_BASE: string = import.meta.env.VITE_URL_API ?? 'http://localhost:3000';

export async function pedir<T>(
  ruta: string,
  opciones: { metodo?: string; cuerpo?: unknown } = {},
): Promise<T> {
  const encabezados: Record<string, string> = {};
  const sesion = leerSesion();
  if (sesion) encabezados.Authorization = `Bearer ${sesion.token}`;
  if (opciones.cuerpo !== undefined) encabezados['Content-Type'] = 'application/json';

  const respuesta = await fetch(`${URL_BASE}${ruta}`, {
    method: opciones.metodo ?? 'GET',
    headers: encabezados,
    body: opciones.cuerpo === undefined ? undefined : JSON.stringify(opciones.cuerpo),
  });
  const datos: unknown = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    // RN-UI-IDE-02: sesión vencida. Sin sesión (ingreso inválido) no hay nada que cerrar.
    if (respuesta.status === 401 && sesion) borrarSesion();
    const error: ErrorApi = esErrorApi(datos)
      ? { codigo: datos.codigo, mensaje: datos.mensaje }
      : { codigo: 'ERROR-RED', mensaje: 'No se pudo completar la operación' };
    throw error;
  }
  return datos as T;
}
