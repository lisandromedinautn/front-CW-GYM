import { useCallback, useEffect, useState } from 'react';
import { usarTamanioPagina } from '../../../../compartido/aplicacion/paginacion/usarTamanioPagina.ts';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import type { BandejaNotificaciones } from '../../dominio/notificacion/notificacion.ts';
import { consultarNotificaciones } from '../../infraestructura/apiNotificaciones.ts';

export const NOTIFICACIONES_POR_PAGINA = 10;

/** US21 (RN-NOT-03): la bandeja del profesor, paginada, de la más nueva a la más vieja. */
export function usarNotificaciones() {
  const [pagina, setPagina] = useState(1);
  const [tamanio, setTamanio] = usarTamanioPagina('notificaciones', NOTIFICACIONES_POR_PAGINA);
  const [bandeja, setBandeja] = useState<BandejaNotificaciones | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let vigente = true;
    consultarNotificaciones(pagina, tamanio)
      .then((datos) => {
        if (vigente) setBandeja(datos);
      })
      .catch((e: unknown) => {
        if (vigente)
          setError(esErrorApi(e) ? e.mensaje : 'No se pudieron cargar las notificaciones');
      });
    return () => {
      vigente = false;
    };
  }, [pagina, tamanio]);

  /** RN-NOT-04: la tarjeta pasa a leída y `noLeidas` baja en 1, sin recargar la lista. */
  const marcarComoLeida = useCallback((id: string) => {
    setBandeja((actual) =>
      actual === null
        ? actual
        : {
            ...actual,
            noLeidas: Math.max(0, actual.noLeidas - 1),
            items: actual.items.map((n) => (n.id === id ? { ...n, leida: true } : n)),
          },
    );
  }, []);

  return {
    bandeja,
    error,
    pagina,
    tamanio,
    irAPagina: setPagina,
    cambiarTamanio: (nuevo: number) => {
      setTamanio(nuevo);
      setPagina(1);
    },
    marcarComoLeida,
  };
}
