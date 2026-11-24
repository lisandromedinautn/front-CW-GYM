import { useRef, useState } from 'react';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import { importarRutina } from '../../infraestructura/api/apiPlanificacion.ts';

export function usarImportarRutina() {
  const [importando, setImportando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendiente = useRef(false);

  async function importar(id: string) {
    if (pendiente.current) return null;
    pendiente.current = true;
    setImportando(true);
    setError(null);
    try {
      return await importarRutina(id);
    } catch (e: unknown) {
      setError(esErrorApi(e) ? e.mensaje : 'No se pudo importar la rutina');
      return null;
    } finally {
      pendiente.current = false;
      setImportando(false);
    }
  }

  return { importar, importando, error };
}
