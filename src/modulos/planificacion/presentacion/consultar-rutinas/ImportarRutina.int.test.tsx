import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';
import { PaginaRutinas } from './PaginaRutinas.tsx';

const base = 'http://localhost:3000/planificacion/rutinas';
const rutina = (id: string, nombre: string) => ({
  id,
  nombre,
  tipo: 'Bloques',
  bloques: [],
  circuitos: [],
});
afterEach(() => localStorage.clear());

describe('RN-PLAN-08 · importar una rutina propia', () => {
  it('crea una copia y actualiza el listado', async () => {
    let creada = false;
    servidorRedFalsa.use(
      http.get('http://localhost:3000/catalogo/ejercicios', () => HttpResponse.json([])),
      http.get(base, () =>
        HttpResponse.json({
          items: creada
            ? [rutina('copia', 'Piernas - Copia'), rutina('original', 'Piernas')]
            : [rutina('original', 'Piernas')],
          total: creada ? 2 : 1,
          pagina: 1,
          tamanio: 10,
        }),
      ),
      http.post(`${base}/:id/importacion`, () => {
        creada = true;
        return HttpResponse.json(rutina('copia', 'Piernas - Copia'), { status: 201 });
      }),
    );
    render(
      <MemoryRouter>
        <PaginaRutinas />
      </MemoryRouter>,
    );
    const usuario = userEvent.setup();
    await screen.findByRole('heading', { name: 'Piernas' });
    await usuario.click(screen.getByRole('button', { name: 'Importar como copia' }));
    expect(await screen.findByRole('heading', { name: 'Piernas - Copia' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Piernas' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Piernas - Copia');
  });

  it('informa el error y permite reintentar sin ocultar la rutina', async () => {
    servidorRedFalsa.use(
      http.get('http://localhost:3000/catalogo/ejercicios', () => HttpResponse.json([])),
      http.get(base, () =>
        HttpResponse.json({
          items: [rutina('original', 'Piernas')],
          total: 1,
          pagina: 1,
          tamanio: 10,
        }),
      ),
      http.post(`${base}/:id/importacion`, () =>
        HttpResponse.json(
          { codigo: 'RN-PLAN-08', mensaje: 'No se pudo importar' },
          { status: 404 },
        ),
      ),
    );
    render(
      <MemoryRouter>
        <PaginaRutinas />
      </MemoryRouter>,
    );
    const usuario = userEvent.setup();
    const titulo = await screen.findByRole('heading', { name: 'Piernas' });
    const tarjeta = titulo.closest('li');
    if (!tarjeta) throw new Error('Falta la tarjeta');
    await usuario.click(within(tarjeta).getByRole('button', { name: 'Importar como copia' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo importar');
    expect(screen.getByRole('heading', { name: 'Piernas' })).toBeInTheDocument();
    expect(within(tarjeta).getByRole('button', { name: 'Importar como copia' })).toBeEnabled();
  });

  it('vuelve a la primera página luego de importar desde la segunda', async () => {
    let creada = false;
    servidorRedFalsa.use(
      http.get('http://localhost:3000/catalogo/ejercicios', () => HttpResponse.json([])),
      http.get(base, ({ request }) => {
        const pagina = Number(new URL(request.url).searchParams.get('pagina'));
        return HttpResponse.json({
          items:
            pagina === 2
              ? [rutina('original', 'Piernas')]
              : [rutina('copia', creada ? 'Piernas - Copia' : 'Otra')],
          total: creada ? 12 : 11,
          pagina,
          tamanio: 10,
        });
      }),
      http.post(`${base}/:id/importacion`, () => {
        creada = true;
        return HttpResponse.json(rutina('copia', 'Piernas - Copia'), { status: 201 });
      }),
    );
    render(
      <MemoryRouter>
        <PaginaRutinas />
      </MemoryRouter>,
    );
    const usuario = userEvent.setup();
    await screen.findByRole('heading', { name: 'Otra' });
    await usuario.click(screen.getByRole('button', { name: 'Siguiente' }));
    await screen.findByRole('heading', { name: 'Piernas' });
    await usuario.click(screen.getByRole('button', { name: 'Importar como copia' }));
    expect(await screen.findByRole('heading', { name: 'Piernas - Copia' })).toBeInTheDocument();
    expect(screen.getByText('Página 1 de 2')).toBeInTheDocument();
  });

  it('deshabilita la importación mientras espera la respuesta', async () => {
    let resolver: (() => void) | undefined;
    let pedidos = 0;
    servidorRedFalsa.use(
      http.get('http://localhost:3000/catalogo/ejercicios', () => HttpResponse.json([])),
      http.get(base, () =>
        HttpResponse.json({
          items: [rutina('original', 'Piernas')],
          total: 1,
          pagina: 1,
          tamanio: 10,
        }),
      ),
      http.post(`${base}/:id/importacion`, async () => {
        pedidos += 1;
        await new Promise<void>((resolve) => {
          resolver = resolve;
        });
        return HttpResponse.json(rutina('copia', 'Piernas - Copia'), { status: 201 });
      }),
    );
    render(
      <MemoryRouter>
        <PaginaRutinas />
      </MemoryRouter>,
    );
    const usuario = userEvent.setup();
    await screen.findByRole('heading', { name: 'Piernas' });
    const boton = screen.getByRole('button', { name: 'Importar como copia' });
    await usuario.click(boton);
    expect(boton).toBeDisabled();
    await usuario.click(boton);
    expect(pedidos).toBe(1);
    resolver?.();
    expect(await screen.findByRole('status')).toHaveTextContent('Piernas - Copia');
  });

  it('sin rutinas no ofrece importar', async () => {
    servidorRedFalsa.use(
      http.get('http://localhost:3000/catalogo/ejercicios', () => HttpResponse.json([])),
      http.get(base, () => HttpResponse.json({ items: [], total: 0, pagina: 1, tamanio: 10 })),
    );
    render(
      <MemoryRouter>
        <PaginaRutinas />
      </MemoryRouter>,
    );
    expect(await screen.findByText('Creá tu primera rutina')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Importar como copia' })).not.toBeInTheDocument();
  });
});
