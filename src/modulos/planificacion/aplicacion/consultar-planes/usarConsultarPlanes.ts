import { useEffect, useState } from 'react';
import { usarTamanioPagina } from '../../../../compartido/aplicacion/paginacion/usarTamanioPagina.ts';
import type { Pagina } from '../../../../compartido/dominio/paginacion/paginacion.ts';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import {
  type FiltrosPlanes,
  type ResumenPlan,
  SIN_FILTROS_PLANES,
} from '../../dominio/plan/listadoPlanes.ts';
import type { AlumnoDelProfesor } from '../../dominio/plan/plan.ts';
import {
  consultarPlanes,
  listarAlumnosDelProfesor,
} from '../../infraestructura/api/apiPlanificacion.ts';

export const PLANES_POR_PAGINA = 10;

/** RN-PLAN-22: planes del profesor con filtros combinados (RN-UI-LIS-01 a 03) y paginación. */
export function usarConsultarPlanes() {
  const [filtros, setFiltros] = useState<FiltrosPlanes>(SIN_FILTROS_PLANES);
  const [pagina, setPagina] = useState(1);
  const [tamanio, setTamanio] = usarTamanioPagina('planes', PLANES_POR_PAGINA);
  const [resultado, setResultado] = useState<Pagina<ResumenPlan> | null>(null);
  const [alumnos, setAlumnos] = useState<AlumnoDelProfesor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [revision, setRevision] = useState(0);

  // Los alumnos dan los nombres de las tarjetas y las opciones del filtro.
  useEffect(() => {
    let vigente = true;
    listarAlumnosDelProfesor()
      .then((lista) => {
        if (!vigente) return;
        setAlumnos(
          [...lista].sort((uno, otro) =>
            `${uno.apellido} ${uno.nombre}`.localeCompare(`${otro.apellido} ${otro.nombre}`),
          ),
        );
      })
      .catch(() => {
        // Sin alumnos el listado igual se ve; solo faltan los nombres.
      });
    return () => {
      vigente = false;
    };
  }, []);

  useEffect(() => {
    let vigente = true;
    setCargando(true);
    setError(null);
    consultarPlanes(filtros, pagina, tamanio)
      .then((datos) => {
        if (vigente) setResultado(datos);
      })
      .catch((e: unknown) => {
        if (vigente) setError(esErrorApi(e) ? e.mensaje : 'No se pudieron cargar los planes');
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });
    return () => {
      vigente = false;
    };
  }, [filtros, pagina, tamanio, revision]);

  return {
    resultado,
    alumnos,
    error,
    cargando,
    filtros,
    hayFiltros: Object.values(filtros).some((valor) => valor !== ''),
    pagina,
    tamanio,
    irAPagina: setPagina,
    /** RN-UI-LIS-03: al cambiar un filtro vuelve a la página 1. */
    cambiarFiltro: <K extends keyof FiltrosPlanes>(clave: K, valor: FiltrosPlanes[K]) => {
      setFiltros((actuales) => ({ ...actuales, [clave]: valor }));
      setPagina(1);
    },
    /** RN-UI-LIS-01: "Limpiar filtros". */
    limpiarFiltros: () => {
      setFiltros(SIN_FILTROS_PLANES);
      setPagina(1);
    },
    recargar: () => {
      setPagina(1);
      setRevision((actual) => actual + 1);
    },
    cambiarTamanio: (nuevo: number) => {
      setTamanio(nuevo);
      setPagina(1);
    },
  };
}
