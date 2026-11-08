import type { Rol } from '../../dominio/sesion/sesion.ts';

export function PaginaInicio({ rol }: { rol: Rol }) {
  return <h1>Panel del {rol}</h1>;
}
