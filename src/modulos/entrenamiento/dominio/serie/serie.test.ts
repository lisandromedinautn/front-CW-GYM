import { describe, expect, it } from 'vitest';
import { validarSerie } from './serie.ts';

describe('RN-ENT-03 · lo realizado es una medida entera de 0 o más y un peso opcional de 0 o más', () => {
  it.each([
    ['8', 8],
    ['0', 0],
  ])('acepta %s repeticiones', (valor, esperado) => {
    expect(validarSerie({ medida: 'repeticiones', valor, peso: '' })).toEqual({
      valida: true,
      cuerpo: { repeticiones: esperado },
    });
  });

  it('acepta 25 segundos', () => {
    expect(validarSerie({ medida: 'segundos', valor: '25', peso: '' })).toEqual({
      valida: true,
      cuerpo: { segundos: 25 },
    });
  });

  it.each(['-1', '2.5', ''])('rechaza la medida «%s»', (valor) => {
    expect(validarSerie({ medida: 'repeticiones', valor, peso: '' })).toEqual({
      valida: false,
      campo: 'medida',
      mensaje: 'Ingresá un número entero de 0 o más.',
    });
  });

  it('acepta un peso de 22,5 kg', () => {
    expect(validarSerie({ medida: 'repeticiones', valor: '8', peso: '22.5' })).toEqual({
      valida: true,
      cuerpo: { repeticiones: 8, pesoKg: 22.5 },
    });
  });

  it('rechaza un peso de -1 kg', () => {
    expect(validarSerie({ medida: 'repeticiones', valor: '8', peso: '-1' })).toEqual({
      valida: false,
      campo: 'peso',
      mensaje: 'Ingresá un peso de 0 o más.',
    });
  });
});
