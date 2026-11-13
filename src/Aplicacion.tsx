import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { usarSesion } from './compartido/aplicacion/sesion/usarSesion.ts';
import { OPCIONES_MENU } from './compartido/dominio/menu/opcionesMenu.ts';
import { RUTA_INICIO, type Rol } from './compartido/dominio/sesion/sesion.ts';
import { DisenioConMenu } from './compartido/presentacion/menu/DisenioConMenu.tsx';
import { PaginaInicio } from './compartido/presentacion/inicio/PaginaInicio.tsx';
import { Proximamente } from './compartido/presentacion/proximamente/Proximamente.tsx';
import { RutaProtegida } from './compartido/presentacion/ruta-protegida/RutaProtegida.tsx';
import { ListaEjercicios } from './modulos/catalogo/presentacion/lista-ejercicios/ListaEjercicios.tsx';
import { PaginaAltaProfesor } from './modulos/identidad/presentacion/alta-profesor/PaginaAltaProfesor.tsx';
import { PaginaCodigoProfesor } from './modulos/identidad/presentacion/codigo-profesor/PaginaCodigoProfesor.tsx';
import { PaginaVincularProfesor } from './modulos/identidad/presentacion/vinculo/PaginaVincularProfesor.tsx';
import { PaginaIngreso } from './modulos/identidad/presentacion/ingreso/PaginaIngreso.tsx';
import { PaginaCrearPlan } from './modulos/planificacion/presentacion/crear-plan/PaginaCrearPlan.tsx';
import { PaginaRutinas } from './modulos/planificacion/presentacion/consultar-rutinas/PaginaRutinas.tsx';
import { EditorRutina } from './modulos/planificacion/presentacion/editor-rutina/EditorRutina.tsx';
import './estilos.css';

const ROLES: Rol[] = ['Admin', 'Profesor', 'Alumno'];

/** Páginas implementadas por ruta; las que faltan muestran "Próximamente". */
const PAGINAS: Record<string, ReactElement> = {
  '/admin/ejercicios': <ListaEjercicios />,
  '/profesor/ejercicios': <ListaEjercicios />,
  '/admin/profesores': <PaginaAltaProfesor />,
  '/profesor/codigo': <PaginaCodigoProfesor />,
  '/alumno/vinculo': <PaginaVincularProfesor />,
  '/profesor/rutinas': <PaginaRutinas />,
  '/profesor/planes': <PaginaCrearPlan />,
};

/** Páginas que no son opción de menú (se llega desde otra pantalla). */
const SUBPAGINAS: Record<Rol, Record<string, ReactElement>> = {
  Admin: {},
  Profesor: { '/profesor/rutinas/nueva': <EditorRutina /> },
  Alumno: {},
};

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
              element={PAGINAS[opcion.ruta] ?? <Proximamente />}
            />
          ))}
          {Object.entries(SUBPAGINAS[rol]).map(([ruta, pagina]) => (
            <Route key={ruta} path={ruta.slice(RUTA_INICIO[rol].length + 1)} element={pagina} />
          ))}
        </Route>
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
