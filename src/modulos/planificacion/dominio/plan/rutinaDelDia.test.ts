import { describe, expect, it } from 'vitest';
import { etiquetaDelDia, objetivoDeEjercicio } from './rutinaDelDia.ts';

describe('US08 · la rutina del día se muestra con el objetivo de cada ejercicio', () => {
  it('con repeticiones y peso muestra "10 repeticiones · 20 kg"', () => {
    expect(objetivoDeEjercicio({ repeticiones: 10, segundos: null, pesoKg: 20 })).toBe(
      '10 repeticiones · 20 kg',
    );
  });

  it('con tiempo y sin peso muestra "30 segundos"', () => {
    expect(objetivoDeEjercicio({ repeticiones: null, segundos: 30, pesoKg: null })).toBe(
      '30 segundos',
    );
  });

  it('el número de día se muestra como "Día 1 de 28"', () => {
    expect(etiquetaDelDia(1)).toBe('Día 1 de 28');
  });
});
