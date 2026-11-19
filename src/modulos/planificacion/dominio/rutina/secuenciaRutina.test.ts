import { describe, expect, it } from 'vitest';
import { tipoDeRutina } from '../bloque/reglasBloque.ts';
import { mover } from './secuenciaRutina.ts';

describe('RN-PLAN-01 · una rutina mixta es una secuencia ordenada de bloques y circuitos', () => {
  it('con 1 bloque y 1 circuito el tipo es Mixta', () => {
    expect(tipoDeRutina(1, 1)).toBe('Mixta');
  });

  it('subir el tercero de [A, B, C] deja [A, C, B]', () => {
    expect(mover(['A', 'B', 'C'], 2, 'arriba')).toEqual(['A', 'C', 'B']);
  });

  it('subir el primero de [A, B] lo deja igual', () => {
    expect(mover(['A', 'B'], 0, 'arriba')).toEqual(['A', 'B']);
  });
});
