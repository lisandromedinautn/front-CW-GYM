import { useEffect, useState } from 'react';
import { usarTamanioPagina } from '../../../../compartido/aplicacion/paginacion/usarTamanioPagina.ts';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import type { Pagina } from '../../../../compartido/dominio/paginacion/paginacion.ts';
import type {
  AlumnoVinculado,
  EntrenamientoDeAlumno,
} from '../../dominio/entrenamientos-de-alumnos/entrenamientosDeAlumnos.ts';
import {
  consultarEntrenamientosDeAlumno,
  listarAlumnosVinculados,
} from '../../infraestructura/api/apiEntrenamiento.ts';

export const ENTRENAMIENTOS_POR_PAGINA = 10;

/** US18 (RN-ENT-18, RN-UI-ENT-04): entrenamientos del alumno elegido, paginados. */
export function usarEntrenamientosDeAlumnos() {
  const [alumnos, setAlumnos] = useState<AlumnoVinculado[] | null>(null);
  const [alumnoId, setAlumnoId] = useState('');
  const [pagina, setPagina] = useState(1);
  const [tamanio, setTamanio] = usarTamanioPagina(
    'entrenamientos-de-alumnos',
    ENTRENAMIENTOS_POR_PAGINA,
  );
  const [resultado, setResultado] = useState<Pagina<EntrenamientoDeAlumno> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let vigente = true;
    listarAlumnosVinculados()
      .then((lista) => {
        if (!vigente) return;
        setAlumnos(
          [...lista].sort((uno, otro) =>
            `${uno.apellido} ${uno.nombre}`.localeCompare(`${otro.apellido} ${otro.nombre}`),
          ),
        );
      })
      .catch((e: unknown) => {
        if (vigente) setError(esErrorApi(e) ? e.mensaje : 'No se pudieron cargar tus alumnos');
      });
    return () => {
      vigente = false;
    };
  }, []);

  useEffect(() => {
    if (!alumnoId) return;
    let vigente = true;
    setError(null);
    setResultado(null);
    consultarEntrenamientosDeAlumno(alumnoId, pagina, tamanio)
      .then((datos) => {
        if (vigente) setResultado(datos);
      })
      .catch((e: unknown) => {
        if (vigente)
          setError(esErrorApi(e) ? e.mensaje : 'No se pudieron cargar los entrenamientos');
      });
    return () => {
      vigente = false;
    };
  }, [alumnoId, pagina, tamanio]);

  return {
    alumnos,
    alumnoId,
    resultado,
    error,
    pagina,
    tamanio,
    /** RN-UI-LIS-03: cambiar de alumno vuelve a la página 1. */
    elegirAlumno: (id: string) => {
      setAlumnoId(id);
      setPagina(1);
    },
    irAPagina: setPagina,
    cambiarTamanio: (nuevo: number) => {
      setTamanio(nuevo);
      setPagina(1);
    },
  };
}
