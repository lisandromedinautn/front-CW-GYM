import { useEffect, useState } from 'react';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import type { AlumnoDelProfesor } from '../../dominio/plan/plan.ts';
import {
  agregarAlumnoAlPlan,
  consultarAlumnosDelPlan,
  listarAlumnosDelProfesor,
  quitarAlumnoDelPlan,
} from '../../infraestructura/api/apiPlanificacion.ts';

export function usarAlumnosDelPlan(id: string) {
  const [alumnos, setAlumnos] = useState<AlumnoDelProfesor[]>([]);
  const [asignados, setAsignados] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    let activo = true;
    Promise.all([listarAlumnosDelProfesor(), consultarAlumnosDelPlan(id)])
      .then(([lista, plan]) => {
        if (activo) {
          setAlumnos(lista);
          setAsignados(plan.alumnoIds);
        }
      })
      .catch((e: unknown) => {
        if (activo) setError(esErrorApi(e) ? e.mensaje : 'No se pudieron cargar los alumnos');
      });
    return () => {
      activo = false;
    };
  }, [id]);

  async function cambiar(alumnoId: string, asignado: boolean) {
    setOcupado(true);
    setError(null);
    try {
      if (asignado) await quitarAlumnoDelPlan(id, alumnoId);
      else await agregarAlumnoAlPlan(id, alumnoId);
      setAsignados((await consultarAlumnosDelPlan(id)).alumnoIds);
    } catch (e: unknown) {
      setError(esErrorApi(e) ? e.mensaje : 'No se pudo actualizar el plan');
    } finally {
      setOcupado(false);
    }
  }

  return { alumnos, asignados, error, ocupado, cambiar };
}
