import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { OPCIONES_MENU } from '../../dominio/menu/opcionesMenu.ts';
import type { Rol } from '../../dominio/sesion/sesion.ts';

/**
 * Inicio de cada rol (T20): una tarjeta de acceso por opción del menú, con su color de sección.
 * El nombre accesible empieza con "Ir a" para no repetir el de la pestaña del menú.
 * Debajo va lo que la raíz de composición sume para el rol (el estado del día del Alumno, T25).
 */
export function PaginaInicio({ rol, children }: { rol: Rol; children?: ReactNode }) {
  return (
    <section className="pagina pagina-ancha">
      <h1>Panel del {rol}</h1>
      <nav aria-label="Accesos del inicio">
        <ul className="accesos">
          {OPCIONES_MENU[rol].map((opcion) => (
            <li key={opcion.ruta}>
              <Link
                to={opcion.ruta}
                className="acceso"
                style={
                  {
                    '--color-seccion-opcion': `var(--color-seccion-${opcion.seccion})`,
                  } as CSSProperties
                }
              >
                <span className="solo-lectores">Ir a </span>
                {opcion.etiqueta}
                <ArrowRight aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {children}
    </section>
  );
}
