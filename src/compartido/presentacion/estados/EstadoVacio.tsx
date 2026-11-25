import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

interface Propiedades {
  /** Qué falta, con el texto de cada pantalla ("Todavía no creaste planes."). */
  titulo: ReactNode;
  /** Ayuda opcional para salir del vacío. */
  descripcion?: ReactNode;
  /** Acción opcional (por ejemplo, el enlace a crear). */
  accion?: ReactNode;
}

/** Estado vacío único (T23): un listado sin resultados o una sección sin datos. */
export function EstadoVacio({ titulo, descripcion, accion }: Propiedades) {
  return (
    <div className="vacio">
      <Inbox aria-hidden="true" className="vacio-icono" />
      <p className="vacio-titulo">{titulo}</p>
      {descripcion && <p className="tenue">{descripcion}</p>}
      {accion}
    </div>
  );
}
