import { useEffect, useState } from 'react';
import { usarTamanioPagina } from '../../../../compartido/aplicacion/paginacion/usarTamanioPagina.ts';
import type { Pagina } from '../../../../compartido/dominio/paginacion/paginacion.ts';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import type { RutinaCreada } from '../../dominio/rutina/rutina.ts';
import { listarRutinas } from '../../infraestructura/api/apiPlanificacion.ts';

export const RUTINAS_POR_PAGINA = 10;

/** Consulta paginada de las rutinas del profesor (RN-PLAN-08: solo las propias). */
export function usarConsultarRutinas() {
  const [pagina, setPagina] = useState(1);
  const [tamanio, setTamanio] = usarTamanioPagina('rutinas', RUTINAS_POR_PAGINA);
  const [resultado, setResultado] = useState<Pagina<RutinaCreada> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vigente = true;
    setCargando(true);
    setError(null);
    listarRutinas(pagina, tamanio)
      .then((datos) => {
        if (vigente) setResultado(datos);
      })
      .catch((e: unknown) => {
        if (vigente) setError(esErrorApi(e) ? e.mensaje : 'No se pudieron cargar las rutinas');
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });
    return () => {
      vigente = false;
    };
  }, [pagina, tamanio]);

  return {
    resultado,
    error,
    cargando,
    pagina,
    tamanio,
    irAPagina: setPagina,
    cambiarTamanio: (nuevo: number) => {
      setTamanio(nuevo);
      setPagina(1);
    },
    /** Reemplaza una rutina ya listada (por ejemplo, tras renombrarla). */
    reemplazar: (rutina: RutinaCreada) =>
      setResultado((actual) =>
        actual
          ? { ...actual, items: actual.items.map((r) => (r.id === rutina.id ? rutina : r)) }
          : actual,
      ),
  };
}
