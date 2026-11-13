import { useEffect, useState } from 'react';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import type { AlumnoDelProfesor } from '../../dominio/plan/plan.ts';
import type { RutinaCreada } from '../../dominio/rutina/rutina.ts';
import {
  listarAlumnosDelProfesor,
  listarTodasLasRutinas,
} from '../../infraestructura/api/apiPlanificacion.ts';

/**
 * US07: datos que necesita la pantalla de crear plan. Alumnos vinculados al profesor
 * (RN-PLAN-13) y sus rutinas para asignar a cada día (RN-PLAN-08).
 */
export function usarDatosParaPlan() {
  const [alumnos, setAlumnos] = useState<AlumnoDelProfesor[] | null>(null);
  const [rutinas, setRutinas] = useState<RutinaCreada[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vigente = true;
    Promise.all([listarAlumnosDelProfesor(), listarTodasLasRutinas()])
      .then(([listaAlumnos, listaRutinas]) => {
        if (!vigente) return;
        setAlumnos(
          [...listaAlumnos].sort((uno, otro) =>
            `${uno.apellido} ${uno.nombre}`.localeCompare(`${otro.apellido} ${otro.nombre}`),
          ),
        );
        setRutinas(listaRutinas);
      })
      .catch((e: unknown) => {
        if (vigente) {
          setError(esErrorApi(e) ? e.mensaje : 'No se pudieron cargar los datos del plan');
        }
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });
    return () => {
      vigente = false;
    };
  }, []);

  return { alumnos, rutinas, error, cargando };
}
