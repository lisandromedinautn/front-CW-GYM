import { render, screen, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const URL_API = 'http://localhost:3000';

const alerta = {
  id: 'n9',
  tipo: 'alerta-incumplimiento',
  creada: '2026-11-24T14:00:00.000Z',
  leida: false,
  gravedad: 'grave',
  alumno: { id: 'a7', nombre: 'Martín', apellido: 'Pérez' },
  entrenamiento: { id: 'e3', rutina: 'Piernas', inicio: '2026-11-24T13:00:00.000Z' },
  entrenamientos: [
    { id: 'e1', fecha: '2026-11-20T13:00:00.000Z', rutina: 'Fuerza' },
    { id: 'e2', fecha: '2026-11-22T13:00:00.000Z', rutina: 'Torso' },
    { id: 'e3', fecha: '2026-11-24T13:00:00.000Z', rutina: 'Piernas' },
  ],
  totalSeries: 0,
  seriesPorDebajo: [],
  percepcion: null,
};

afterEach(() => {
  localStorage.clear();
});

describe('RN-NOT-08 · la alerta de incumplimiento se muestra con sus tres entrenamientos', () => {
  it('F1 · alerta con alumno, tres fechas y enlace a sus entrenamientos', async () => {
    servidorRedFalsa.use(
      http.get(`${URL_API}/notificaciones/mis-notificaciones`, () =>
        HttpResponse.json({ items: [alerta], total: 1, pagina: 1, tamanio: 10, noLeidas: 1 }),
      ),
      http.get(`${URL_API}/notificaciones/mis-notificaciones/no-leidas`, () =>
        HttpResponse.json({ cantidad: 1 }),
      ),
    );
    localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Profesor' }));
    render(
      <MemoryRouter initialEntries={['/profesor/notificaciones']}>
        <Aplicacion />
      </MemoryRouter>,
    );

    const tarjeta = within(await screen.findByRole('article'));
    expect(
      tarjeta.getByText('Pérez, Martín: 3 entrenamientos seguidos por debajo de lo prescripto'),
    ).toBeVisible();
    expect(tarjeta.getByText('20/11/2026 · Fuerza')).toBeVisible();
    expect(tarjeta.getByText('22/11/2026 · Torso')).toBeVisible();
    expect(tarjeta.getByText('24/11/2026 · Piernas')).toBeVisible();
    expect(tarjeta.getByRole('link', { name: 'Ver entrenamientos' })).toHaveAttribute(
      'href',
      '/profesor/entrenamientos?alumno=a7',
    );
    expect(tarjeta.queryByText('Percepción mala')).toBeNull();
  });
});
