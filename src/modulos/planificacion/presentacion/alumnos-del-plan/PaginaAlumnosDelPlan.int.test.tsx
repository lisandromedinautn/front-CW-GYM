import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const base = 'http://localhost:3000';
const alumnos = [
  { id: 'a1', nombre: 'Ana', apellido: 'Pérez' },
  { id: 'a2', nombre: 'Luis', apellido: 'López' },
];
function iniciar(asignados: string[] = ['a1']) {
  let actuales = [...asignados];
  servidorRedFalsa.use(
    http.get(`${base}/identidad/alumnos`, () => HttpResponse.json(alumnos)),
    http.get(`${base}/planificacion/planes/p1/alumnos`, () =>
      HttpResponse.json({ alumnoIds: actuales }),
    ),
    http.post(`${base}/planificacion/planes/p1/alumnos`, async ({ request }) => {
      const body = (await request.json()) as { alumnoId: string };
      actuales = [...actuales, body.alumnoId];
      return new HttpResponse(null, { status: 201 });
    }),
    http.delete(`${base}/planificacion/planes/p1/alumnos/:alumnoId`, ({ params }) => {
      actuales = actuales.filter((id) => id !== params.alumnoId);
      return new HttpResponse(null, { status: 200 });
    }),
  );
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Profesor' }));
  render(
    <MemoryRouter initialEntries={['/profesor/planes/p1/alumnos']}>
      <Aplicacion />
    </MemoryRouter>,
  );
}

describe('US12 · alumnos del plan', () => {
  it('agrega un alumno y permite quitar al último', async () => {
    iniciar();
    const usuario = userEvent.setup();
    await usuario.click(await screen.findByRole('button', { name: 'Agregar a Luis López' }));
    await usuario.click(await screen.findByRole('button', { name: 'Quitar a Ana Pérez' }));
    await usuario.click(await screen.findByRole('button', { name: 'Quitar a Luis López' }));
    expect(await screen.findByText('Sin alumnos asignados.')).toBeVisible();
  });
  it('muestra el rechazo del servidor', async () => {
    iniciar();
    servidorRedFalsa.use(
      http.post(`${base}/planificacion/planes/p1/alumnos`, () =>
        HttpResponse.json(
          { codigo: 'RN-PLAN-14', mensaje: 'El alumno ya tiene un plan vigente' },
          { status: 409 },
        ),
      ),
    );
    await userEvent.click(await screen.findByRole('button', { name: 'Agregar a Luis López' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'El alumno ya tiene un plan vigente',
    );
  });
  it('ofrece Alumnos solo para el plan vigente', async () => {
    servidorRedFalsa.use(
      http.get(`${base}/identidad/alumnos`, () => HttpResponse.json(alumnos)),
      http.get(`${base}/planificacion/planes`, () =>
        HttpResponse.json({
          items: ['proximo', 'vigente', 'finalizado'].map((estado, i) => ({
            id: `p${i}`,
            fechaInicio: '2026-11-01',
            fechaFin: '2026-11-28',
            estado,
            alumnoIds: [],
            diasConRutina: 0,
            diasDeDescanso: 28,
          })),
          total: 3,
          pagina: 1,
          tamanio: 10,
        }),
      ),
    );
    localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Profesor' }));
    render(
      <MemoryRouter initialEntries={['/profesor/planes']}>
        <Aplicacion />
      </MemoryRouter>,
    );
    const lista = await screen.findByRole('list', { name: 'Planes' });
    expect(within(lista).getAllByRole('link', { name: 'Alumnos' })).toHaveLength(1);
  });
});
