import { useEffect, useState } from 'react';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import type { ResultadoMiPlan } from '../../dominio/plan/miPlan.ts';
import { obtenerMiPlan } from '../../infraestructura/api/apiPlanificacion.ts';

export function usarMiPlan() {
  const [resultado, setResultado] = useState<ResultadoMiPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vigente = true;
    obtenerMiPlan()
      .then((plan) => {
        if (vigente) setResultado(plan);
      })
      .catch((e: unknown) => {
        if (vigente) setError(esErrorApi(e) ? e.mensaje : 'No se pudo cargar tu plan');
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });
    return () => {
      vigente = false;
    };
  }, []);

  return { resultado, error, cargando };
}
