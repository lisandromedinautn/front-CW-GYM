import { useState } from 'react';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import type { PedidoRutina } from '../../dominio/rutina/rutina.ts';
import { crearRutina } from '../../infraestructura/api/apiPlanificacion.ts';

/** US06. Devuelve true si la rutina se creó, para que el editor se vacíe. */
export function usarCrearRutina() {
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function crear(pedido: PedidoRutina): Promise<boolean> {
    setError(null);
    setExito(null);
    setEnviando(true);
    try {
      const rutina = await crearRutina(pedido);
      setExito(`Rutina creada (tipo ${rutina.tipo})`);
      return true;
    } catch (e) {
      // RN-PLAN-01, 02, 04, 05, 06: el back manda { codigo, mensaje } y se muestra su mensaje.
      setError(esErrorApi(e) ? e.mensaje : 'No se pudo crear la rutina, intentá de nuevo');
      return false;
    } finally {
      setEnviando(false);
    }
  }

  /** Para mostrar un error detectado en el front antes de enviar. */
  function avisar(mensaje: string) {
    setExito(null);
    setError(mensaje);
  }

  return { crear, avisar, error, exito, enviando };
}
