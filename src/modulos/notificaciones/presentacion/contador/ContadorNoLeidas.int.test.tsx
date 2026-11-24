import { act, render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const URL_API = 'http://localhost:3000';

function preparar(cantidades: number[]) {
  let consulta = 0;
  servidorRedFalsa.use(
    http.get(`${URL_API}/notificaciones/mis-notificaciones/no-leidas`, () =>
      HttpResponse.json({ cantidad: cantidades[Math.min(consulta++, cantidades.length - 1)] }),
    ),
  );
}

function abrir() {
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Profesor' }));
  render(
    <MemoryRouter initialEntries={['/profesor']}>
      <Aplicacion />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
});

describe('RN-UI-NOT-01 · el menú del Profesor muestra la cantidad de notificaciones no leídas', () => {
  it('muestra 2 y a los 60 segundos muestra 3', async () => {
    preparar([2, 3]);
    abrir();

    expect(await screen.findByRole('link', { name: 'Notificaciones (2)' })).toBeVisible();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000);
    });

    expect(await screen.findByRole('link', { name: 'Notificaciones (3)' })).toBeVisible();
  });

  it('con 0 no muestra número', async () => {
    preparar([0]);
    abrir();

    expect(await screen.findByRole('link', { name: 'Notificaciones' })).toBeVisible();
    expect(screen.queryByRole('link', { name: /Notificaciones \(/ })).not.toBeInTheDocument();
  });
});
