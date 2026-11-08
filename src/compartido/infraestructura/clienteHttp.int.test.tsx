import { act, render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../pruebas/servidor-red-falsa.ts';
import { pedir } from './clienteHttp.ts';

afterEach(() => localStorage.clear());

describe('RN-UI-IDE-02 · un 401 del back cierra la sesión y lleva al ingreso', () => {
  it('con sesión Admin, una respuesta 401 borra la sesión y muestra la pantalla de ingreso', async () => {
    servidorRedFalsa.use(
      http.get('http://localhost:3000/algo', () =>
        HttpResponse.json(
          { codigo: 'RN-IDE-03', mensaje: 'Tenés que ingresar al sistema' },
          { status: 401 },
        ),
      ),
    );
    localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Admin' }));
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Aplicacion />
      </MemoryRouter>,
    );
    expect(await screen.findByRole('heading', { name: 'Panel del Admin' })).toBeInTheDocument();

    await act(async () => {
      await expect(pedir('/algo')).rejects.toMatchObject({
        codigo: 'RN-IDE-03',
        mensaje: 'Tenés que ingresar al sistema',
      });
    });

    expect(localStorage.getItem('cwgym.sesion')).toBeNull();
    expect(await screen.findByRole('heading', { name: 'Ingresar al sistema' })).toBeInTheDocument();
  });
});
