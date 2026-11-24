import type { RutinaDelDiaDetalle } from './rutinaDelDia.ts';

/** US11: contrato de GET /planificacion/mi-plan; la vigencia la resuelve el back. */
export type ResultadoMiPlan =
  | { estado: 'sin-plan'; fecha: string }
  | {
      estado: 'plan';
      fecha: string;
      plan: {
        id: string;
        fechaInicio: string;
        fechaFin: string;
        dias: { numero: number; fecha: string; rutina: RutinaDelDiaDetalle | null }[];
      };
    };
