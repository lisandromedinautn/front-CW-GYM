import { useEffect, useState } from 'react';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import type { PlanConDias } from '../../dominio/plan/plan.ts';
import type { RutinaCreada } from '../../dominio/rutina/rutina.ts';
import {
  guardarDiaDelPlan,
  listarTodasLasRutinas,
  obtenerPlan,
} from '../../infraestructura/api/apiPlanificacion.ts';

/** RN-PLAN-23: carga el plan con sus 28 días y guarda de a un día. */
export function usarEditarDiasPlan(id: string) {
  const [plan, setPlan] = useState<PlanConDias | null>(null);
  const [rutinas, setRutinas] = useState<RutinaCreada[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    let activo = true;
    Promise.all([obtenerPlan(id), listarTodasLasRutinas()])
      .then(([planObtenido, lista]) => {
        if (activo) {
          setPlan(planObtenido);
          setRutinas(lista);
        }
      })
      .catch((e: unknown) => {
        if (activo) setError(esErrorApi(e) ? e.mensaje : 'No se pudo cargar el plan');
      });
    return () => {
      activo = false;
    };
  }, [id]);

  async function guardar(numero: number, rutinaId: string | null) {
    setOcupado(true);
    setError(null);
    try {
      const dia = await guardarDiaDelPlan(id, numero, rutinaId);
      setPlan(
        (actual) =>
          actual && { ...actual, dias: actual.dias.map((d) => (d.numero === numero ? dia : d)) },
      );
    } catch (e: unknown) {
      setError(esErrorApi(e) ? e.mensaje : 'No se pudo guardar el día');
    } finally {
      setOcupado(false);
    }
  }

  return { plan, rutinas, error, ocupado, guardar };
}
