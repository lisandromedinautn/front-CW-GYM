import { useNavigate } from 'react-router';
import { PaginaCrearPlan } from './PaginaCrearPlan.tsx';

export const RUTA_LISTADO_PLANES = '/profesor/planes';
export const RUTA_NUEVO_PLAN = '/profesor/planes/nuevo';

/**
 * T13: la creación del plan (US07) tiene su propia URL, como la de rutinas. "Volver al listado"
 * regresa a `/profesor/planes`, que vuelve a pedir los planes al montarse (RN-PLAN-22).
 */
export function PaginaNuevoPlan() {
  const navegar = useNavigate();
  return <PaginaCrearPlan alVolver={() => void navegar(RUTA_LISTADO_PLANES)} />;
}
