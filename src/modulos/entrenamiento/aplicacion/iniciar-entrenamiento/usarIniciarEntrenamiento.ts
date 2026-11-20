import { useState } from 'react';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import { iniciarEntrenamiento } from '../../infraestructura/api/apiEntrenamiento.ts';

export function usarIniciarEntrenamiento() {
  const [iniciando, setIniciando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function iniciar(): Promise<boolean> {
    setIniciando(true);
    setError(null);
    try {
      await iniciarEntrenamiento();
      return true;
    } catch (e: unknown) {
      setError(esErrorApi(e) ? e.mensaje : 'No se pudo iniciar el entrenamiento');
      return false;
    } finally {
      setIniciando(false);
    }
  }

  return { iniciar, iniciando, error };
}
