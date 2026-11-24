import { useEffect, useState } from 'react';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import type { PedidoRutina, RutinaCreada } from '../../dominio/rutina/rutina.ts';
import { editarRutina, obtenerRutina } from '../../infraestructura/api/apiPlanificacion.ts';

/** US06: trae una rutina propia y guarda los cambios (RN-PLAN-07, 08). */
export function usarEditarRutina(id: string) {
  const [rutina, setRutina] = useState<RutinaCreada | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    obtenerRutina(id).then(setRutina, (e: unknown) =>
      setError(esErrorApi(e) ? e.mensaje : 'No se pudo cargar la rutina'),
    );
  }, [id]);

  /** Devuelve true si el back aceptó los cambios. */
  async function guardar(pedido: PedidoRutina): Promise<boolean> {
    setError(null);
    setExito(null);
    setEnviando(true);
    try {
      setRutina(await editarRutina(id, pedido));
      setExito('Cambios guardados');
      return true;
    } catch (e) {
      // RN-PLAN-01 a 08, 20, 21: el back manda { codigo, mensaje } y se muestra su mensaje.
      setError(esErrorApi(e) ? e.mensaje : 'No se pudieron guardar los cambios, intentá de nuevo');
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

  return { rutina, guardar, avisar, error, exito, enviando };
}
