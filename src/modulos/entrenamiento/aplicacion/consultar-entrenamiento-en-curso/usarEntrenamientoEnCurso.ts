import { useEffect, useState } from 'react';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import type { ResultadoEntrenamiento } from '../../dominio/entrenamiento/entrenamiento.ts';
import { consultarEntrenamiento } from '../../infraestructura/api/apiEntrenamiento.ts';

export function usarEntrenamientoEnCurso() {
  const [resultado, setResultado] = useState<ResultadoEntrenamiento | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let vigente = true;
    consultarEntrenamiento()
      .then((datos) => {
        if (vigente) setResultado(datos);
      })
      .catch((e: unknown) => {
        if (vigente) setError(esErrorApi(e) ? e.mensaje : 'No se pudo consultar el entrenamiento');
      });
    return () => {
      vigente = false;
    };
  }, []);

  return { resultado, error };
}
