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
