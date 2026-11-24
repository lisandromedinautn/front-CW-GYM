import { describe, expect, it } from 'vitest';
import { admitePeso, campoObjetivo, seriesValidas, tipoDeRutina } from './reglasBloque.ts';

describe('RN-PLAN-04 · según el tipo del ejercicio se pide repeticiones o tiempo, nunca los dos', () => {
  it('"por repeticiones" pide repeticiones', () => {
    expect(campoObjetivo('por repeticiones')).toBe('repeticiones');
  });

  it('"por tiempo" pide segundos', () => {
    expect(campoObjetivo('por tiempo')).toBe('segundos');
  });
});

describe('RN-PLAN-05 · el peso solo se pide si el tipo de carga incluye Peso Extra', () => {
  it.each([
    ['Peso Extra', true],
    ['Peso Corporal + Peso Extra', true],
    ['Peso Corporal', false],
    ['Sin Peso', false],
  ])('%s → %s', (tipoCarga, esperado) => {
    expect(admitePeso(tipoCarga)).toBe(esperado);
  });
});

describe('RN-PLAN-01 · el tipo de rutina se deriva de su contenido', () => {
  it('sin bloques no hay tipo de rutina', () => {
    expect(tipoDeRutina(0)).toBeNull();
  });

  it('con 2 bloques la rutina es de Bloques', () => {
    expect(tipoDeRutina(2)).toBe('Bloques');
  });
});

describe('RN-PLAN-02 · un bloque tiene al menos una serie', () => {
  it('0 series no es válido', () => {
    expect(seriesValidas(0)).toBe(false);
  });

  it('1 serie es válida', () => {
    expect(seriesValidas(1)).toBe(true);
  });
});
