import { describe, expect, it } from 'vitest';
import { tipoDeRutina } from '../bloque/reglasBloque.ts';
import { ejerciciosSuficientes, tieneRepetidos, vueltasValidas } from './reglasCircuito.ts';

describe('RN-PLAN-03 · un circuito tiene 2 o más ejercicios y al menos una vuelta', () => {
  it('1 ejercicio no alcanza', () => {
    expect(ejerciciosSuficientes(1)).toBe(false);
  });

  it('2 ejercicios alcanzan', () => {
    expect(ejerciciosSuficientes(2)).toBe(true);
  });

  it('0 vueltas no es válido', () => {
    expect(vueltasValidas(0)).toBe(false);
  });

  it('1 vuelta es válida', () => {
    expect(vueltasValidas(1)).toBe(true);
  });
});

describe('RN-PLAN-20 · un circuito no repite ejercicios', () => {
  it('press, plancha, press tiene repetidos', () => {
    expect(tieneRepetidos(['e-press', 'e-plancha', 'e-press'])).toBe(true);
  });

  it('press y plancha no tiene repetidos', () => {
    expect(tieneRepetidos(['e-press', 'e-plancha'])).toBe(false);
  });
});

describe('RN-PLAN-01 · el tipo de rutina se deriva de su contenido', () => {
  it('0 bloques y 1 circuito: la rutina es de Circuitos', () => {
    expect(tipoDeRutina(0, 1)).toBe('Circuitos');
  });
});
