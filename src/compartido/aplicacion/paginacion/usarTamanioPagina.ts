import { useState } from 'react';
import { TAMANIOS_PAGINA } from '../../dominio/paginacion/paginacion.ts';

const PREFIJO = 'cwgym.tamanio.';

function leer(clave: string, porDefecto: number): number {
  try {
    const guardado = Number(localStorage.getItem(PREFIJO + clave));
    return (TAMANIOS_PAGINA as readonly number[]).includes(guardado) ? guardado : porDefecto;
  } catch {
    return porDefecto;
  }
}

/** Tamaño de página de un listado, recordado por `clave` en `localStorage` (T06). */
export function usarTamanioPagina(
  clave: string,
  porDefecto: number,
): [number, (tamanio: number) => void] {
  const [tamanio, setTamanio] = useState(() => leer(clave, porDefecto));

  const cambiar = (nuevo: number) => {
    setTamanio(nuevo);
    try {
      localStorage.setItem(PREFIJO + clave, String(nuevo));
    } catch {
      // Sin almacenamiento, el tamaño vale solo mientras la pantalla está abierta.
    }
  };

  return [tamanio, cambiar];
}
