import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type TipoAviso = 'error' | 'exito' | 'advertencia' | 'info';

const ICONOS: Record<TipoAviso, LucideIcon> = {
  error: CircleAlert,
  exito: CircleCheck,
  advertencia: TriangleAlert,
  info: Info,
};

/**
 * Aviso único (T23) para errores, éxitos, advertencias e información. Los errores van en `alert`
 * y el resto en `status` (compartido/CLAUDE.md, "Validación de formularios"). El texto no cambia.
 */
export function Aviso({ tipo, children }: { tipo: TipoAviso; children: ReactNode }) {
  const Icono = ICONOS[tipo];
  return (
    <p role={tipo === 'error' ? 'alert' : 'status'} className={`aviso-estado aviso-estado-${tipo}`}>
      <Icono aria-hidden="true" className="aviso-estado-icono" />
      {children}
    </p>
  );
}
