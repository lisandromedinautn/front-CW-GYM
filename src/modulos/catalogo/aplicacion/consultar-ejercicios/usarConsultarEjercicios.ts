import { useEffect, useState } from 'react';
import { usarTamanioPagina } from '../../../../compartido/aplicacion/paginacion/usarTamanioPagina.ts';
import type { Pagina } from '../../../../compartido/dominio/paginacion/paginacion.ts';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import {
  musculosDelGrupo,
  SIN_FILTROS,
  type FiltrosEjercicios,
} from '../../dominio/ejercicio/clasificacion.ts';
import type { Ejercicio } from '../../dominio/ejercicio/ejercicio.ts';
import { consultarEjercicios } from '../../infraestructura/api/apiCatalogo.ts';

export const EJERCICIOS_POR_PAGINA = 20;

/** Consulta paginada del catálogo con buscador y filtros (T06, RN-UI-LIS-01 a 03). */
export function usarConsultarEjercicios() {
  const [filtros, setFiltros] = useState<FiltrosEjercicios>(SIN_FILTROS);
  const [pagina, setPagina] = useState(1);
  const [tamanio, setTamanio] = usarTamanioPagina('ejercicios', EJERCICIOS_POR_PAGINA);
  const [resultado, setResultado] = useState<Pagina<Ejercicio> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let vigente = true;
    setError(null);
    consultarEjercicios(filtros, pagina, tamanio)
      .then((datos) => {
        if (vigente) setResultado(datos);
      })
      .catch((e: unknown) => {
        if (vigente) setError(esErrorApi(e) ? e.mensaje : 'No se pudo cargar el catálogo');
      });
    return () => {
      vigente = false;
    };
  }, [filtros, pagina, tamanio]);

  return {
    resultado,
    error,
    filtros,
    pagina,
    tamanio,
    irAPagina: setPagina,
    /** RN-UI-LIS-03: cualquier cambio de filtro vuelve a la página 1. */
    cambiarFiltro: (clave: keyof FiltrosEjercicios, valor: string) => {
      setFiltros((actuales) => {
        const nuevos = { ...actuales, [clave]: valor };
        // RN-CAT-05: al cambiar el grupo, un músculo que no le pertenece deja de filtrar.
        if (clave === 'grupo' && !musculosDelGrupo(valor).includes(nuevos.musculo)) {
          nuevos.musculo = '';
        }
        return nuevos;
      });
      setPagina(1);
    },
    /** RN-UI-LIS-01: borra el buscador y todos los filtros. */
    limpiarFiltros: () => {
      setFiltros(SIN_FILTROS);
      setPagina(1);
    },
    cambiarTamanio: (nuevo: number) => {
      setTamanio(nuevo);
      setPagina(1);
    },
  };
}
