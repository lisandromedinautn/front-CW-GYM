import { useEffect, useState } from 'react';
import { esErrorApi } from '../../../compartido/dominio/errorApi.ts';
import type { Ejercicio } from '../dominio/ejercicio.ts';
import { listarEjercicios } from '../infraestructura/apiCatalogo.ts';

export function usarListarEjercicios() {
  const [ejercicios, setEjercicios] = useState<Ejercicio[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let vigente = true;
    listarEjercicios()
      .then((lista) => {
        if (vigente) setEjercicios(lista);
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
