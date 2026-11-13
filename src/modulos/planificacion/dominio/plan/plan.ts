/**
 * Plan de Entrenamiento del lado del front. Las reglas RN-PLAN viven en el back
 * (`src/modulos/planificacion/CLAUDE.md`); acá solo se calculan fechas para mostrarlas y se
 * arma el pedido con el contrato de `POST /planificacion/planes`.
 */

/** RN-PLAN-09: el plan siempre tiene 28 días. */
export const DIAS_DEL_PLAN = 28;

/** Un alumno vinculado al profesor, para asignarlo al plan (RN-PLAN-13). */
export interface AlumnoDelProfesor {
  id: string;
  nombre: string;
  apellido: string;
}

/** Un día del plan: `rutinaId` null significa descanso (RN-PLAN-10). */
export interface DiaDelPlan {
  numero: number;
  rutinaId: string | null;
}

/** Cuerpo de `POST /planificacion/planes` (back: crear-plan.dto.ts). */
export interface PedidoPlan {
  fechaInicio: string;
  dias: DiaDelPlan[];
  alumnos: string[];
}

/** Respuesta de `POST /planificacion/planes` (back: planificacion.controlador.ts). */
export interface PlanCreado {
  id: string;
  fechaInicio: string;
  fechaFin: string;
  dias: {
    numero: number;
    fecha: string;
    rutinaId: string | null;
    esDescanso: boolean;
  }[];
  alumnoIds: string[];
}

const PATRON_FECHA = /^\d{4}-\d{2}-\d{2}$/;

const dosDigitos = (numero: number): string => String(numero).padStart(2, '0');

const partes = (fecha: string): { anio: number; mes: number; dia: number } => ({
  anio: Number(fecha.slice(0, 4)),
  mes: Number(fecha.slice(5, 7)),
  dia: Number(fecha.slice(8, 10)),
});

/** `true` si el texto es una fecha `AAAA-MM-DD` que existe en el calendario. */
export function esFechaValida(fecha: string): boolean {
  if (!PATRON_FECHA.test(fecha)) return false;
  const { anio, mes, dia } = partes(fecha);
  const fechaUtc = new Date(Date.UTC(anio, mes - 1, dia));
  return (
    fechaUtc.getUTCFullYear() === anio &&
    fechaUtc.getUTCMonth() === mes - 1 &&
    fechaUtc.getUTCDate() === dia
  );
}

/** La fecha de un instante como `AAAA-MM-DD`, en UTC. */
export function fechaIso(fecha: Date): string {
  return `${fecha.getUTCFullYear()}-${dosDigitos(fecha.getUTCMonth() + 1)}-${dosDigitos(fecha.getUTCDate())}`;
}

/** La fecha de hoy como `AAAA-MM-DD`. */
export function hoyIso(): string {
  return fechaIso(new Date());
}

/** Suma (o resta, con un número negativo) días a una fecha `AAAA-MM-DD`. */
export function sumarDias(fecha: string, dias: number): string {
  const { anio, mes, dia } = partes(fecha);
  return fechaIso(new Date(Date.UTC(anio, mes - 1, dia + dias)));
}

/** RN-PLAN-09: la fecha de fin es el inicio + 27 días y no se edita. */
export function fechaFinDelPlan(fechaInicio: string): string {
  return sumarDias(fechaInicio, DIAS_DEL_PLAN - 1);
}

/** RN-PLAN-11: la fecha de cada día, del 1 al 28. */
export function fechasDeLosDias(fechaInicio: string): string[] {
  return Array.from({ length: DIAS_DEL_PLAN }, (_, indice) => sumarDias(fechaInicio, indice));
}

/** "Lunes 13/11" a partir de `AAAA-MM-DD`, para mostrar cada día sin depender del navegador. */
export function etiquetaDeFecha(fecha: string): string {
  if (!esFechaValida(fecha)) return fecha;
  const { anio, mes, dia } = partes(fecha);
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const diaDeLaSemana = new Date(Date.UTC(anio, mes - 1, dia)).getUTCDay();
  return `${dias[diaDeLaSemana]} ${dosDigitos(dia)}/${dosDigitos(mes)}`;
}
