import { useState } from 'react';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import type { PedidoPlan, PlanCreado } from '../../dominio/plan/plan.ts';
import { crearPlan } from '../../infraestructura/api/apiPlanificacion.ts';

/** US07. Devuelve el plan creado, o null si el back lo rechazó. */
export function usarCrearPlan() {
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlanCreado | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function crear(pedido: PedidoPlan): Promise<PlanCreado | null> {
    setError(null);
    setPlan(null);
    setEnviando(true);
    try {
      const creado = await crearPlan(pedido);
      setPlan(creado);
      return creado;
    } catch (e) {
      // RN-PLAN-13, 14 y 08: el back manda { codigo, mensaje } y se muestra su mensaje.
      setError(esErrorApi(e) ? e.mensaje : 'No se pudo crear el plan, intentá de nuevo');
      return null;
    } finally {
      setEnviando(false);
    }
  }

  /** Para mostrar un error detectado en el front antes de enviar. */
  function avisar(mensaje: string) {
    setPlan(null);
    setError(mensaje);
  }

  return { crear, avisar, error, plan, enviando };
}
