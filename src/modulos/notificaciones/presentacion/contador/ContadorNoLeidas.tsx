import { usarContadorNoLeidas } from '../../aplicacion/contar-no-leidas/usarContadorNoLeidas.ts';

/** Texto que se suma a la etiqueta "Notificaciones" del menú: " (2)", o nada si no hay no leídas. */
export function ContadorNoLeidas() {
  const cantidad = usarContadorNoLeidas();
  return cantidad > 0 ? ` (${cantidad})` : null;
}
