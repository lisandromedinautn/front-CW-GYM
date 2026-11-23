import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const base = 'http://localhost:3000';
const entrenamiento = {
  id: 'ent-1',
  inicio: '2026-11-22T10:00:00.000Z',
  rutina: { nombre: 'Fuerza' },
};
function abrir() {
  return render(
    <MemoryRouter initialEntries={['/alumno/entrenamiento']}>
      <Aplicacion />
    </MemoryRouter>,
  );
}
afterEach(() => localStorage.clear());

describe('RN-ENT-17 · resumen persistido', () => {
  it('muestra el volumen, los grupos y la duración al recargar', async () => {
    localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Alumno' }));
    servidorRedFalsa.use(
      http.get(`${base}/entrenamiento/mi-entrenamiento-en-curso`, () =>
        HttpResponse.json({
          estado: 'finalizado',
          entrenamiento: {
            ...entrenamiento,
            fin: '2026-11-22T10:30:00.000Z',
            resumen: {
              volumenKg: 540,
              duracionSegundos: 1800,
              gruposMusculares: ['Espalda', 'Brazos'],
            },
          },
        }),
      ),
    );
    abrir();
    expect(await screen.findByRole('heading', { name: 'Resumen del entrenamiento' })).toBeVisible();
    expect(screen.getByText(/540 kg/)).toBeVisible();
    expect(screen.getByText(/30 min/)).toBeVisible();
    expect(screen.getByText('Espalda')).toBeVisible();
    expect(screen.getByText('Brazos')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Finalizar entrenamiento' }),
    ).not.toBeInTheDocument();
  });
  it('muestra el error cuando el cierre es rechazado', async () => {
    localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Alumno' }));
    servidorRedFalsa.use(
      http.get(`${base}/entrenamiento/mi-entrenamiento-en-curso`, () =>
        HttpResponse.json({ estado: 'en-curso', entrenamiento }),
      ),
      http.post(`${base}/entrenamiento/entrenamientos/ent-1/finalizacion`, () =>
        HttpResponse.json(
          { codigo: 'RN-ENT-20', mensaje: 'El entrenamiento quedó abandonado' },
          { status: 409 },
        ),
      ),
    );
    abrir();
    await userEvent.click(await screen.findByRole('button', { name: 'Finalizar entrenamiento' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('El entrenamiento quedó abandonado');
  });
  it('sin sesión dirige al ingreso', async () => {
    localStorage.clear();
    abrir();
    expect(await screen.findByRole('heading', { name: 'Ingresar al sistema' })).toBeVisible();
  });
});
