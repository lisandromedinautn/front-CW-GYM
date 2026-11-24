import { describe, expect, it } from 'vitest';
import { describirMedida, describirRealizada, tituloDeSerie } from './notificacion.ts';

describe('RN-NOT-01 · cada serie por debajo muestra lo prescripto y lo realizado', () => {
  it('serie por tiempo sin peso', () => {
    const prescripta = { repeticiones: null, segundos: 60, pesoKg: null };
    const realizada = { repeticiones: null, segundos: 45, pesoKg: null };

    expect([describirMedida(prescripta), describirRealizada(realizada)]).toEqual([
      '60 segundos',
      '45 segundos',
    ]);
  });

  it('serie de circuito', () => {
    const serie = {
      orden: 1,
      numero: 2,
      posicion: 2,
      ejercicioId: 'flexiones',
      nombre: 'flexiones',
      prescripta: { repeticiones: 10, segundos: null, pesoKg: null },
      realizada: null,
    };

    expect(tituloDeSerie(serie)).toBe('Vuelta 2 · flexiones');
  });

  it('peso con decimales', () => {
    expect(describirMedida({ repeticiones: 10, segundos: null, pesoKg: 30.5 })).toBe(
      '10 repeticiones · 30,5 kg',
    );
  });
});
