import { admitePeso, campoObjetivo, seriesValidas } from '../../dominio/bloque/reglasBloque.ts';
import {
  ejerciciosSuficientes,
  tieneRepetidos,
  vueltasValidas,
} from '../../dominio/circuito/reglasCircuito.ts';
import type {
  EjercicioParaRutina,
  PedidoBloque,
  PedidoCircuito,
  PedidoEjercicioCircuito,
} from '../../dominio/rutina/rutina.ts';

/** Estado del editor mientras se escribe: todo como texto, tal cual lo carga el profesor. */
export interface ObjetivoEnEdicion {
  clave: number;
  ejercicioId: string;
  repeticiones: string;
  segundos: string;
  pesoKg: string;
}

export interface BloqueEnEdicion extends ObjetivoEnEdicion {
  series: string;
  micropausa: string;
  macropausa: string;
}

export interface CircuitoEnEdicion {
  clave: number;
  vueltas: string;
  macropausa: string;
  ejercicios: ObjetivoEnEdicion[];
}

/** Errores por campo; `general` es el error del circuito entero (RN-PLAN-03, 20). */
export type Errores = Partial<Record<string, string>>;

type Buscar = (id: string) => EjercicioParaRutina | undefined;

export const COMPLETAR = 'Completá este campo';

let proximaClave = 1;
const nuevaClave = () => proximaClave++;

const objetivoVacio = (): ObjetivoEnEdicion => ({
  clave: nuevaClave(),
  ejercicioId: '',
  repeticiones: '',
  segundos: '',
  pesoKg: '',
});

export const bloqueVacio = (): BloqueEnEdicion => ({
  ...objetivoVacio(),
  series: '',
  micropausa: '',
  macropausa: '',
});

export const ejercicioCircuitoVacio = objetivoVacio;

/** Un circuito nuevo arranca con 2 ejercicios, el mínimo de RN-PLAN-03 (decidido el 10/11/2026). */
export const circuitoVacio = (): CircuitoEnEdicion => ({
  clave: nuevaClave(),
  vueltas: '',
  macropausa: '',
  ejercicios: [objetivoVacio(), objetivoVacio()],
});

const vacio = (texto: string) => texto.trim() === '';

/** RN-PLAN-04 reflejada: ejercicio elegido y repeticiones o tiempo según su tipo. */
function validarObjetivo(objetivo: ObjetivoEnEdicion, buscar: Buscar): Errores {
  const ejercicio = buscar(objetivo.ejercicioId);
  if (!ejercicio) return { ejercicioId: COMPLETAR };
  const campo = campoObjetivo(ejercicio.tipo);
  return vacio(objetivo[campo]) ? { [campo]: COMPLETAR } : {};
}

/** RN-PLAN-02 y 04 reflejadas: qué le falta a un bloque antes de enviarlo. */
export function validarBloque(bloque: BloqueEnEdicion, buscar: Buscar): Errores {
  const errores = validarObjetivo(bloque, buscar);
  if (vacio(bloque.series)) errores.series = COMPLETAR;
  else if (!seriesValidas(Number(bloque.series))) errores.series = 'Mínimo 1 serie';
  if (vacio(bloque.micropausa)) errores.micropausa = COMPLETAR;
  if (vacio(bloque.macropausa)) errores.macropausa = COMPLETAR;
  return errores;
}

/** RN-PLAN-03, 04 y 20 reflejadas. Devuelve los errores por clave (circuito y cada ejercicio). */
export function validarCircuito(
  circuito: CircuitoEnEdicion,
  buscar: Buscar,
): Record<number, Errores> {
  const delCircuito: Errores = {};
  if (vacio(circuito.vueltas)) delCircuito.vueltas = COMPLETAR;
  else if (!vueltasValidas(Number(circuito.vueltas))) delCircuito.vueltas = 'Mínimo 1 vuelta';
  if (vacio(circuito.macropausa)) delCircuito.macropausa = COMPLETAR;

  const elegidos = circuito.ejercicios.map((e) => e.ejercicioId).filter((id) => id !== '');
  if (!ejerciciosSuficientes(circuito.ejercicios.length)) {
    delCircuito.general = 'Un circuito necesita 2 o más ejercicios';
  } else if (tieneRepetidos(elegidos)) {
    delCircuito.general = 'No repitas ejercicios en el circuito';
  }

  return Object.fromEntries([
    [circuito.clave, delCircuito],
    ...circuito.ejercicios.map((e) => [e.clave, validarObjetivo(e, buscar)]),
  ]);
}

export const sinErrores = (errores: Record<number, Errores>) =>
  Object.values(errores).every((e) => Object.values(e).every((m) => !m));

/** Repeticiones o segundos según el tipo, y peso solo si la carga incluye Peso Extra (RN-PLAN-04, 05). */
function objetivoAPedido(
  objetivo: ObjetivoEnEdicion,
  ejercicio: EjercicioParaRutina,
): PedidoEjercicioCircuito {
  const campo = campoObjetivo(ejercicio.tipo);
  return {
    ejercicioId: ejercicio.id,
    [campo]: Number(objetivo[campo]),
    ...(admitePeso(ejercicio.tipoCarga) && !vacio(objetivo.pesoKg)
      ? { pesoKg: Number(objetivo.pesoKg) }
      : {}),
  };
}

export function bloqueAPedido(bloque: BloqueEnEdicion, buscar: Buscar): PedidoBloque {
  const { ejercicioId, ...objetivo } = objetivoAPedido(bloque, buscar(bloque.ejercicioId)!);
  return {
    ejercicioId,
    series: Number(bloque.series),
    micropausaSegundos: Number(bloque.micropausa),
    macropausaSegundos: Number(bloque.macropausa),
    ...objetivo,
  };
}

export function circuitoAPedido(circuito: CircuitoEnEdicion, buscar: Buscar): PedidoCircuito {
  return {
    vueltas: Number(circuito.vueltas),
    macropausaSegundos: Number(circuito.macropausa),
    ejercicios: circuito.ejercicios.map((e) => objetivoAPedido(e, buscar(e.ejercicioId)!)),
  };
}
