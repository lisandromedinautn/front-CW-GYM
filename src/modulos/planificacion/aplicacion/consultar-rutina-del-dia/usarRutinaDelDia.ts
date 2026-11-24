import { useEffect, useState } from 'react';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import type { RutinaDelDia } from '../../dominio/plan/rutinaDelDia.ts';
import { obtenerRutinaDelDia } from '../../infraestructura/api/apiPlanificacion.ts';

/** US08: consulta la rutina del día del alumno al abrir la pantalla (RN-PLAN-18). */
export function usarRutinaDelDia() {
  const [resultado, setResultado] = useState<RutinaDelDia | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vigente = true;
    obtenerRutinaDelDia()
      .then((rutina) => {
        if (vigente) setResultado(rutina);
      })
      .catch((e: unknown) => {
        if (vigente) {
          setError(esErrorApi(e) ? e.mensaje : 'No se pudo cargar la rutina del día');
        }
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
