import { describe, expect, it } from 'vitest';
import { fechaHora } from './entrenamientosDeAlumnos.ts';

describe('RN-UI-ENT-04 · el inicio del entrenamiento se muestra en fecha y hora de Argentina', () => {
  it('2026-11-20T23:59:00.000Z se muestra 20/11/2026 20:59', () => {
    expect(fechaHora('2026-11-20T23:59:00.000Z')).toBe('20/11/2026 20:59');
  });
});
