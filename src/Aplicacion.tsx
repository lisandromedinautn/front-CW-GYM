import { PaginaEditarDiasPlan } from './modulos/planificacion/presentacion/editar-dias-plan/PaginaEditarDiasPlan.tsx';
import { PaginaAlumnosDelPlan } from './modulos/planificacion/presentacion/alumnos-del-plan/PaginaAlumnosDelPlan.tsx';
import type { ReactElement, ReactNode } from 'react';
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
import { PaginaEntrenamientosDeAlumnos } from './modulos/entrenamiento/presentacion/entrenamientos-de-alumnos/PaginaEntrenamientosDeAlumnos.tsx';
import { ContadorNoLeidas } from './modulos/notificaciones/presentacion/contador/ContadorNoLeidas.tsx';
import { PaginaNotificaciones } from './modulos/notificaciones/presentacion/bandeja/PaginaNotificaciones.tsx';
import { PaginaPlanes } from './modulos/planificacion/presentacion/consultar-planes/PaginaPlanes.tsx';
import { PaginaNuevoPlan } from './modulos/planificacion/presentacion/crear-plan/PaginaNuevoPlan.tsx';
import { PaginaRutinas } from './modulos/planificacion/presentacion/consultar-rutinas/PaginaRutinas.tsx';
import { PaginaEditarRutina } from './modulos/planificacion/presentacion/editar-rutina/PaginaEditarRutina.tsx';
import { EditorRutina } from './modulos/planificacion/presentacion/editor-rutina/EditorRutina.tsx';
import { EstadoDelDia } from './modulos/planificacion/presentacion/estado-del-dia/EstadoDelDia.tsx';
import { PaginaRutinaDelDia } from './modulos/planificacion/presentacion/rutina-del-dia/PaginaRutinaDelDia.tsx';
import { PaginaMiPlan } from './modulos/planificacion/presentacion/mi-plan/PaginaMiPlan.tsx';
import { AccionesEntrenamiento } from './modulos/entrenamiento/presentacion/entrenamiento-en-curso/AccionesEntrenamiento.tsx';
import { EntrenamientoDelDia } from './modulos/entrenamiento/presentacion/estado-del-dia/EntrenamientoDelDia.tsx';
import { PaginaEntrenamientoEnCurso } from './modulos/entrenamiento/presentacion/entrenamiento-en-curso/PaginaEntrenamientoEnCurso.tsx';
import { RUTA_ENTRENAMIENTO } from './modulos/entrenamiento/presentacion/entrenamiento-en-curso/rutas.ts';
import './estilos.css';

const ROLES: Rol[] = ['Admin', 'Profesor', 'Alumno'];

/** Contenido que cada módulo suma a una opción de menú, solo para el rol que lo usa (RN-UI-NOT-01). */
const EXTRAS_MENU: Partial<Record<Rol, Record<string, ReactNode>>> = {
  Profesor: { '/profesor/notificaciones': <ContadorNoLeidas /> },
};

/** Páginas implementadas por ruta; las que faltan muestran "Próximamente". */
const PAGINAS: Record<string, ReactElement> = {
  '/admin/ejercicios': <ListaEjercicios />,
  '/profesor/ejercicios': <ListaEjercicios />,
  '/admin/profesores': <PaginaAltaProfesor />,
  '/profesor/codigo': <PaginaCodigoProfesor />,
  '/alumno/vinculo': <PaginaVincularProfesor />,
  '/profesor/rutinas': <PaginaRutinas />,
  '/profesor/planes': <PaginaPlanes />,
  '/profesor/entrenamientos': <PaginaEntrenamientosDeAlumnos />,
  '/profesor/notificaciones': <PaginaNotificaciones />,
  '/alumno/mi-plan': <PaginaMiPlan />,
  '/alumno/rutina-del-dia': (
    <PaginaRutinaDelDia acciones={(hayRutina) => <AccionesEntrenamiento hayRutina={hayRutina} />} />
  ),
};

/** Lo que cada rol suma debajo de los accesos del inicio (RN-UI-ENT-06, T25). */
const EXTRAS_INICIO: Record<Rol, ReactElement | null> = {
  Admin: null,
  Profesor: null,
  Alumno: <EstadoDelDia entrenamiento={(rutina) => <EntrenamientoDelDia {...rutina} />} />,
};

/** Páginas que no son opción de menú (se llega desde otra pantalla). */
const SUBPAGINAS: Record<Rol, Record<string, ReactElement>> = {
  Admin: {},
  Profesor: {
    '/profesor/rutinas/nueva': <EditorRutina />,
    '/profesor/rutinas/:id': <PaginaEditarRutina />,
    '/profesor/planes/nuevo': <PaginaNuevoPlan />,
    '/profesor/planes/:id/alumnos': <PaginaAlumnosDelPlan />,
    '/profesor/planes/:id/dias': <PaginaEditarDiasPlan />,
  },
  Alumno: { [RUTA_ENTRENAMIENTO]: <PaginaEntrenamientoEnCurso /> },
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
              <DisenioConMenu extrasMenu={EXTRAS_MENU[rol]} />
            </RutaProtegida>
          }
        >
          <Route index element={<PaginaInicio rol={rol}>{EXTRAS_INICIO[rol]}</PaginaInicio>} />
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
