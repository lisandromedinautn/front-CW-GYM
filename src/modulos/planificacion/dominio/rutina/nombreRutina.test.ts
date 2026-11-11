import { describe, expect, it } from 'vitest';
import { validarNombreRutina } from './nombreRutina.ts';

describe('RN-PLAN-21 · el nombre de la rutina tiene de 1 a 60 caracteres, sin contar los espacios de los extremos', () => {
  it('vacío no vale y pide completarlo', () => {
    expect(validarNombreRutina('')).toBe('Completá el nombre');
  });

  it('solo espacios no vale y pide completarlo', () => {
    expect(validarNombreRutina('   ')).toBe('Completá el nombre');
  });

  it('más de 60 caracteres no vale', () => {
    expect(validarNombreRutina('a'.repeat(61))).toBe('Máximo 60 caracteres');
  });

  it('un nombre corto vale (devuelve null)', () => {
    expect(validarNombreRutina('Piernas')).toBeNull();
  });
});
