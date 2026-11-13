import { describe, expect, it } from 'vitest';
import { esFechaValida, etiquetaDeFecha, fechaFinDelPlan, fechasDeLosDias } from './plan.ts';

describe('RN-PLAN-09 · la fecha de fin se calcula sola (inicio + 27 días)', () => {
  it('con inicio 13/11/2026 el fin es 10/12/2026', () => {
    expect(fechaFinDelPlan('2026-11-13')).toBe('2026-12-10');
  });

  it("una fecha inexistente ('2026-02-30') no es válida", () => {
    expect(esFechaValida('2026-02-30')).toBe(false);
  });
});

describe('RN-PLAN-11 · cada día tiene su fecha', () => {
  it('devuelve 28 fechas, la primera es el inicio y la última el fin', () => {
    const fechas = fechasDeLosDias('2026-11-13');

    expect(fechas).toHaveLength(28);
    expect([fechas[0], fechas[27]]).toEqual(['2026-11-13', '2026-12-10']);
  });

  it("el día 13/11/2026 se muestra como 'viernes 13/11'", () => {
    expect(etiquetaDeFecha('2026-11-13')).toBe('viernes 13/11');
  });
});
