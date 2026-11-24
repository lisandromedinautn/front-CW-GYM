import type { Pagina } from '../../../../compartido/dominio/paginacion/paginacion.ts';
import { pedir } from '../../../../compartido/infraestructura/cliente-http/clienteHttp.ts';
import type { FiltrosEjercicios } from '../../dominio/ejercicio/clasificacion.ts';
import type { Ejercicio } from '../../dominio/ejercicio/ejercicio.ts';

/** Consulta paginada con filtros (T06, T07). Solo viajan los filtros con valor. */
export function consultarEjercicios(
  filtros: FiltrosEjercicios,
  pagina: number,
  tamanio: number,
): Promise<Pagina<Ejercicio>> {
  const parametros = new URLSearchParams({ pagina: String(pagina), tamanio: String(tamanio) });
  for (const [clave, valor] of Object.entries(filtros)) {
    const texto = valor.trim();
    if (texto) parametros.set(clave, texto);
  }
  return pedir<Pagina<Ejercicio>>(`/catalogo/ejercicios/consulta?${parametros.toString()}`);
}
