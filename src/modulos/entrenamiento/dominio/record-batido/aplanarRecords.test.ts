import { describe, expect, it } from 'vitest';
import { aplanarRecords } from './aplanarRecords.ts';
import type { RecordBatido } from './record-batido.ts';

function record(parcial: Partial<RecordBatido> & Pick<RecordBatido, 'tipo'>): RecordBatido {
  return {
    ejercicioId: 'sentadilla',
    nombre: 'Sentadilla',
    valorAnterior: 1,
    valorNuevo: 2,
    ...parcial,
  };
}

describe('RN-ENT-13 · los récords batidos se muestran planos en el resumen', () => {
  it('sin récords no hay filas', () => {
    expect(aplanarRecords([])).toEqual([]);
  });

  it('un récord produce una fila con etiqueta y unidad', () => {
    expect(
      aplanarRecords([record({ tipo: 'repeticiones', valorAnterior: 8, valorNuevo: 10 })]),
    ).toEqual([
      {
        nombre: 'Sentadilla',
        etiqueta: 'Repeticiones',
        valorAnterior: 8,
        valorNuevo: 10,
        unidad: '',
      },
    ]);
  });

  it('varios tipos del mismo ejercicio producen una fila por tipo', () => {
    const filas = aplanarRecords([
      record({ tipo: 'repeticiones', valorAnterior: 8, valorNuevo: 10 }),
      record({ tipo: 'volumen', valorAnterior: 240, valorNuevo: 300 }),
      record({ tipo: '1rm', valorAnterior: 38, valorNuevo: 40 }),
    ]);

    expect(filas.map((f) => f.etiqueta)).toEqual(['Repeticiones', 'Volumen', '1RM']);
    expect(filas.map((f) => f.nombre)).toEqual(['Sentadilla', 'Sentadilla', 'Sentadilla']);
    expect(filas.map((f) => f.valorNuevo)).toEqual([10, 300, 40]);
  });

  it('varios ejercicios mantienen el orden de entrada', () => {
    const filas = aplanarRecords([
      record({
        ejercicioId: 'press',
        nombre: 'Press banca',
        tipo: 'repeticiones',
        valorAnterior: 8,
        valorNuevo: 10,
      }),
      record({
        ejercicioId: 'sentadilla',
        nombre: 'Sentadilla',
        tipo: 'repeticiones',
        valorAnterior: 5,
        valorNuevo: 6,
      }),
    ]);

    expect(filas.map((f) => f.nombre)).toEqual(['Press banca', 'Sentadilla']);
  });

  it('etiqueta por tipo', () => {
    const filas = aplanarRecords([
      record({ tipo: 'repeticiones' }),
      record({ tipo: 'volumen' }),
      record({ tipo: '1rm' }),
      record({ tipo: 'tiempo' }),
    ]);

    expect(filas.map((f) => f.etiqueta)).toEqual(['Repeticiones', 'Volumen', '1RM', 'Tiempo']);
  });

  it('unidad por tipo', () => {
    const filas = aplanarRecords([
      record({ tipo: 'repeticiones' }),
      record({ tipo: 'volumen' }),
      record({ tipo: '1rm' }),
      record({ tipo: 'tiempo' }),
    ]);

    expect(filas.map((f) => f.unidad)).toEqual(['', 'kg', 'kg', 's']);
  });
});
