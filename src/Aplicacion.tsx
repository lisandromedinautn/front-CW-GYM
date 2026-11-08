import { Navigate, Route, Routes } from 'react-router';
import { PaginaIngreso } from './modulos/identidad/presentacion/PaginaIngreso.tsx';
import { RutaProtegida } from './compartido/presentacion/RutaProtegida.tsx';
import './estilos.css';

/**
 * Raíz de composición: acá se arman las rutas por rol (US00, RN-UI-IDE-01) a medida que
 * cada módulo agrega sus páginas. No tiene lógica propia. El router lo pone main.tsx.
 */
export function Aplicacion() {
  return (
    <Routes>
      <Route path="/ingreso" element={<PaginaIngreso />} />
      <Route
        path="/admin"
        element={
          <RutaProtegida rol="Admin">
            <h1>Panel del Admin</h1>
          </RutaProtegida>
        }
      />
      <Route
        path="/profesor"
        element={
          <RutaProtegida rol="Profesor">
            <h1>Panel del Profesor</h1>
          </RutaProtegida>
        }
      />
      <Route
        path="/alumno"
        element={
          <RutaProtegida rol="Alumno">
            <h1>Panel del Alumno</h1>
          </RutaProtegida>
        }
      />
      <Route path="*" element={<Navigate to="/ingreso" replace />} />
    </Routes>
  );
}
