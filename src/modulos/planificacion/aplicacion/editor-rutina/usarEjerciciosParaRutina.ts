import { useEffect, useState } from 'react';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import type { EjercicioParaRutina } from '../../dominio/rutina/rutina.ts';
import { listarEjerciciosParaRutina } from '../../infraestructura/api/apiPlanificacion.ts';

/** Carga el catálogo para elegir el ejercicio de cada bloque, ordenado por nombre. */
export function usarEjerciciosParaRutina() {
  const [ejercicios, setEjercicios] = useState<EjercicioParaRutina[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let vigente = true;
    listarEjerciciosParaRutina()
      .then((lista) => {
        if (vigente) setEjercicios([...lista].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      })
      .catch((e: unknown) => {
        if (vigente) setError(esErrorApi(e) ? e.mensaje : 'No se pudo cargar el catálogo');
      });
    return () => {
      vigente = false;
    };
  }, []);

  return { ejercicios, error };
}
