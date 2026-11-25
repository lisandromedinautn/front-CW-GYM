import type { Rol } from '../../dominio/sesion/sesion.ts';

export function PaginaInicio({ rol }: { rol: Rol }) {
  return (
    <section className="pagina pagina-ancha">
      <h1>Panel del {rol}</h1>
    </section>
  );
}
