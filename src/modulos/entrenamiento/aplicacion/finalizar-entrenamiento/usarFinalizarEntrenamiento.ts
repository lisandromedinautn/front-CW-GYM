import { useState } from 'react';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import type { ResumenEntrenamiento } from '../../dominio/entrenamiento/entrenamiento.ts';
import { finalizarEntrenamiento } from '../../infraestructura/api/apiEntrenamiento.ts';

export function usarFinalizarEntrenamiento() {
  const [resumen, setResumen] = useState<ResumenEntrenamiento | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [finalizando, setFinalizando] = useState(false);

  async function finalizar(id: string) {
    setError(null);
    setFinalizando(true);
    try {
      setResumen(await finalizarEntrenamiento(id));
    } catch (e: unknown) {
      setError(esErrorApi(e) ? e.mensaje : 'No se pudo finalizar el entrenamiento');
    } finally {
      setFinalizando(false);
    }
  }
  return { resumen, error, finalizando, finalizar };
}
