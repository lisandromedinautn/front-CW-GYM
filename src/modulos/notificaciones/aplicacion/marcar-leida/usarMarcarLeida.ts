import { useState } from 'react';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import { avisarCambioNoLeidas } from '../cambios-no-leidas.ts';
import { marcarLeida } from '../../infraestructura/apiNotificaciones.ts';

/** US21 (RN-NOT-04): marca una notificación como leída; si el back responde error, expone su mensaje. */
export function usarMarcarLeida(alMarcar: (id: string) => void) {
  const [error, setError] = useState<string | null>(null);

  const marcar = async (id: string) => {
    setError(null);
    try {
      await marcarLeida(id);
      alMarcar(id);
      avisarCambioNoLeidas();
    } catch (e: unknown) {
      setError(esErrorApi(e) ? e.mensaje : 'No se pudo marcar la notificación como leída');
    }
  };

  return { marcar, error };
}
