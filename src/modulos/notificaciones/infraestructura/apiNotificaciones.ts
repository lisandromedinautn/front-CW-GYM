import { pedir } from '../../../compartido/infraestructura/cliente-http/clienteHttp.ts';
import type { BandejaNotificaciones } from '../dominio/notificacion/notificacion.ts';

export function consultarNotificaciones(
  pagina: number,
  tamanio: number,
): Promise<BandejaNotificaciones> {
  return pedir(`/notificaciones/mis-notificaciones?pagina=${pagina}&tamanio=${tamanio}`);
}

export async function contarNoLeidas(): Promise<number> {
  const { cantidad } = await pedir<{ cantidad: number }>(
    '/notificaciones/mis-notificaciones/no-leidas',
  );
  return cantidad;
}

export async function marcarLeida(id: string): Promise<void> {
  await pedir(`/notificaciones/mis-notificaciones/${id}/lectura`, { metodo: 'PUT' });
}
