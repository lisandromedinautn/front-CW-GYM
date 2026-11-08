import { Navigate, Route, Routes } from 'react-router';
import { usarSesion } from './compartido/aplicacion/usarSesion.ts';
import { OPCIONES_MENU } from './compartido/dominio/opcionesMenu.ts';
import { RUTA_INICIO, type Rol } from './compartido/dominio/sesion.ts';
import { DisenioConMenu } from './compartido/presentacion/DisenioConMenu.tsx';
import { PaginaInicio } from './compartido/presentacion/PaginaInicio.tsx';
import { Proximamente } from './compartido/presentacion/Proximamente.tsx';
import { RutaProtegida } from './compartido/presentacion/RutaProtegida.tsx';
import { PaginaIngreso } from './modulos/identidad/presentacion/PaginaIngreso.tsx';
import './estilos.css';

const ROLES: Rol[] = ['Admin', 'Profesor', 'Alumno'];

function Raiz() {
  const { sesion } = usarSesion();
  return <Navigate to={sesion ? RUTA_INICIO[sesion.rol] : '/ingreso'} replace />;
}

/**
 * Raíz de composición: acá se arman las rutas por rol (US00, RN-UI-IDE-01) a medida que
 * cada módulo agrega sus páginas. No tiene lógica propia. El router lo pone main.tsx.
 */
export function Aplicacion() {
  return (
    <Routes>
      <Route path="/" element={<Raiz />} />
      <Route path="/ingreso" element={<PaginaIngreso />} />
      {ROLES.map((rol) => (
        <Route
          key={rol}
          path={RUTA_INICIO[rol]}
          element={
            <RutaProtegida rol={rol}>
              <DisenioConMenu />
            </RutaProtegida>
          }
        >
          <Route index element={<PaginaInicio rol={rol} />} />
          {OPCIONES_MENU[rol].map((opcion) => (
            <Route
              key={opcion.ruta}
              path={opcion.ruta.slice(RUTA_INICIO[rol].length + 1)}
              element={<Proximamente />}
            />
          ))}
        </Route>
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
