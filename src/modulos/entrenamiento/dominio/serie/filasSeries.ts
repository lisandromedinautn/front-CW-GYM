import type { CopiaRutina, MedidaSerie, SerieRealizada } from '../entrenamiento/entrenamiento.ts';

/** Una serie para registrar: la serie N de un bloque o un ejercicio en la vuelta N de un circuito. */
export interface FilaSerie {
  clave: string;
  orden: number;
  numero: number;
  posicion: number | null;
  titulo: string;
  nombre: string;
  urlGif: string | null;
  prescripta: MedidaSerie;
  registrada: MedidaSerie | null;
}

export interface GrupoSeries {
  orden: number;
  titulo: string;
  filas: FilaSerie[];
}

export function claveSerie(orden: number, numero: number, posicion: number | null): string {
  return `${orden}-${numero}-${posicion ?? 0}`;
}

/** Arma las filas en el orden de la rutina (bloques y circuitos por `orden`), con lo ya registrado. */
export function agruparSeries(rutina: CopiaRutina, series: SerieRealizada[]): GrupoSeries[] {
  const registradas = new Map(
    series.map((s) => [claveSerie(s.orden, s.numero, s.posicion), s.realizada]),
  );
  const fila = (
    orden: number,
    numero: number,
    posicion: number | null,
    titulo: string,
    ejercicio: { nombre: string; urlGif?: string | null } & MedidaSerie,
  ): FilaSerie => {
    const clave = claveSerie(orden, numero, posicion);
    return {
      clave,
      orden,
      numero,
      posicion,
      titulo,
      nombre: ejercicio.nombre,
      urlGif: ejercicio.urlGif ?? null,
      prescripta: {
        repeticiones: ejercicio.repeticiones,
        segundos: ejercicio.segundos,
        pesoKg: ejercicio.pesoKg,
      },
      registrada: registradas.get(clave) ?? null,
    };
  };

  const bloques = (rutina.bloques ?? []).map((bloque) => ({
    orden: bloque.orden,
    titulo: bloque.nombre,
    filas: Array.from({ length: bloque.series }, (_, i) =>
      fila(bloque.orden, i + 1, null, `Serie ${i + 1}`, bloque),
    ),
  }));
  const circuitos = (rutina.circuitos ?? []).map((circuito) => ({
    orden: circuito.orden,
    titulo: 'Circuito',
    filas: Array.from({ length: circuito.vueltas }, (_, i) =>
      circuito.ejercicios.map((ejercicio, p) =>
        fila(circuito.orden, i + 1, p + 1, `Vuelta ${i + 1}`, ejercicio),
      ),
    ).flat(),
  }));
  return [...bloques, ...circuitos].sort((a, b) => a.orden - b.orden);
}

/** «10 repeticiones · 30 kg», «30 s». */
export function describirMedida(medida: MedidaSerie): string {
  const partes: string[] = [];
  if (medida.repeticiones !== null) partes.push(`${medida.repeticiones} repeticiones`);
  if (medida.segundos !== null) partes.push(`${medida.segundos} s`);
  if (medida.pesoKg !== null) partes.push(`${String(medida.pesoKg).replace('.', ',')} kg`);
  return partes.join(' · ');
}

/** RN-UI-ENT-03: los pasos del entrenamiento, uno por fila, en el orden de la rutina. */
export function pasosDelEntrenamiento(grupos: GrupoSeries[]): FilaSerie[] {
  return grupos.flatMap((grupo) => grupo.filas);
}

/** Al abrir o retomar se arranca en el primer paso sin registrar; si no queda ninguno, en el último. */
export function pasoInicial(pasos: FilaSerie[]): number {
  const pendiente = pasos.findIndex((paso) => paso.registrada === null);
  return pendiente === -1 ? Math.max(pasos.length - 1, 0) : pendiente;
}
