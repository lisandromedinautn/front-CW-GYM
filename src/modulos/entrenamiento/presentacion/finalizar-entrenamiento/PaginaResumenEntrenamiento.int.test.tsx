import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

describe('RN-ENT-05, 06, 09, 17 · finalizar y ver el resumen', () => {
  it('finaliza una sesión sin series y muestra duración y resultado vacío', async () => {
    servidorRedFalsa.use(
      http.get('http://localhost:3000/entrenamiento/mi-entrenamiento-en-curso', () =>
        HttpResponse.json({
          estado: 'en-curso',
          entrenamiento: {
            id: 'ent-1',
            inicio: '2026-11-22T10:00:00.000Z',
            rutina: { nombre: 'Fuerza' },
          },
        }),
      ),
      http.post('http://localhost:3000/entrenamiento/entrenamientos/ent-1/finalizacion', () =>
        HttpResponse.json(
          { volumenKg: 0, duracionSegundos: 1800, gruposMusculares: [] },
          { status: 201 },
        ),
      ),
    );
    localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Alumno' }));
    render(
      <MemoryRouter initialEntries={['/alumno/entrenamiento']}>
        <Aplicacion />
      </MemoryRouter>,
    );
    await userEvent.click(await screen.findByRole('button', { name: 'Finalizar entrenamiento' }));
    expect(await screen.findByRole('heading', { name: 'Resumen del entrenamiento' })).toBeVisible();
    expect(screen.getByText(/0 kg/)).toBeVisible();
    expect(screen.getByText(/30 min/)).toBeVisible();
    expect(screen.getByText(/Sin grupos musculares/)).toBeVisible();
  });
});
