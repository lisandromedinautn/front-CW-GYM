import { LoaderCircle } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * Indicador de carga único (T23): se anuncia como `status` y conserva el texto de cada pantalla
 * ("Cargando rutinas…"). El icono es decorativo y deja de girar si se pide menos movimiento.
 */
export function Cargando({ children }: { children: ReactNode }) {
  return (
    <p role="status" className="estado-carga">
      <LoaderCircle aria-hidden="true" className="estado-carga-icono" />
      {children}
    </p>
  );
}
