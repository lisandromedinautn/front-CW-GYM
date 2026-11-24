import { useEffect, useState } from 'react';
import { escucharCambioNoLeidas } from '../cambios-no-leidas.ts';
import { contarNoLeidas } from '../../infraestructura/apiNotificaciones.ts';

const INTERVALO_MS = 60_000;

/** US21 (RN-UI-NOT-01): cantidad de notificaciones no leídas; se consulta al montar y cada 60 s. */
export function usarContadorNoLeidas(): number {
  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    let activo = true;
    const consultar = () => {
      contarNoLeidas().then(
        (n) => {
          if (activo) setCantidad(n);
        },
        () => {
          // Sin red no se muestra nada nuevo: queda el último valor.
        },
      );
    };
    consultar();
    const intervalo = setInterval(consultar, INTERVALO_MS);
    const desuscribir = escucharCambioNoLeidas(consultar);
    return () => {
      activo = false;
      desuscribir();
      clearInterval(intervalo);
    };
  }, []);

  return cantidad;
}
