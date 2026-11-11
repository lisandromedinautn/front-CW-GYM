/**
 * Lo que el editor necesita de cada ejercicio del catálogo. Sale de `GET /catalogo/ejercicios`
 * con un cliente propio de planificación (CLAUDE.md, regla 2: no se importa el módulo catálogo).
 */
export interface EjercicioParaRutina {
  id: string;
  nombre: string;
  /** "por tiempo" o "por repeticiones". */
  tipo: string;
  /** Sin Peso, Peso Corporal, Peso Extra o Peso Corporal + Peso Extra. */
  tipoCarga: string;
  /** GIF de demostración del dataset, para la vista previa al elegir el ejercicio. */
  urlGif: string;
}

/** Un bloque tal como lo recibe `POST /planificacion/rutinas` (back: crear-rutina.dto.ts). */
export interface PedidoBloque {
  ejercicioId: string;
  series: number;
  micropausaSegundos: number;
  macropausaSegundos: number;
  repeticiones?: number;
  segundos?: number;
  pesoKg?: number;
}

/** Un ejercicio de un circuito: sin series ni pausas propias (RN-PLAN-03). */
export interface PedidoEjercicioCircuito {
  ejercicioId: string;
  repeticiones?: number;
  segundos?: number;
  pesoKg?: number;
}

/** Un circuito tal como lo recibe `POST /planificacion/rutinas` (US09). */
export interface PedidoCircuito {
  vueltas: number;
  macropausaSegundos: number;
  ejercicios: PedidoEjercicioCircuito[];
}

/** Bloques y circuitos van en listas separadas; se manda solo la que tiene contenido. */
export interface PedidoRutina {
  bloques?: PedidoBloque[];
  circuitos?: PedidoCircuito[];
}

/** Respuesta de `POST /planificacion/rutinas` (back: planificacion.controlador.ts). */
export interface RutinaCreada {
  id: string;
  /** RN-PLAN-21: de 1 a 60 caracteres. */
  nombre: string;
  tipo: string;
  bloques: {
    ejercicioId: string;
    series: number;
    micropausaSegundos: number;
    macropausaSegundos: number;
    repeticiones: number | null;
    segundos: number | null;
    pesoKg: number | null;
  }[];
  circuitos: {
    vueltas: number;
    macropausaSegundos: number;
    ejercicios: {
      ejercicioId: string;
      repeticiones: number | null;
      segundos: number | null;
      pesoKg: number | null;
    }[];
  }[];
}

/** Ids de los ejercicios de la rutina en orden, sin repetir (bloques y después circuitos). */
export function ejerciciosDeRutina(rutina: RutinaCreada): string[] {
  const ids = [
    ...rutina.bloques.map((b) => b.ejercicioId),
    ...rutina.circuitos.flatMap((c) => c.ejercicios.map((e) => e.ejercicioId)),
  ];
  return [...new Set(ids)];
}

/** "2 bloques", "1 circuito", "1 bloque · 2 circuitos". */
export function resumenRutina(rutina: RutinaCreada): string {
  const partes: string[] = [];
  const contar = (n: number, singular: string, plural: string) =>
    n > 0 && partes.push(`${n} ${n === 1 ? singular : plural}`);
  contar(rutina.bloques.length, 'bloque', 'bloques');
  contar(rutina.circuitos.length, 'circuito', 'circuitos');
  return partes.join(' · ');
}
