import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const base = 'http://localhost:3000';

// Hoy fijo: 24/11/2026. Plan del 21/11 al 18/12; los días 1 a 3 son anteriores a hoy.
const RUTINAS = ['Empuje', 'Tracción'].map((nombre, i) => ({
  id: `r${i + 1}`,
  nombre,
  tipo: 'Bloques',
  bloques: [],
  circuitos: [],
}));

function fechaDelDia(numero: number): string {
  return new Date(Date.UTC(2026, 10, 21 + numero - 1)).toISOString().slice(0, 10);
}

// Forma de GET /planificacion/planes/:id (contrato RN-PLAN-23): 28 días.
function planConDias() {
  return {
    id: 'p1',
    fechaInicio: '2026-11-21',
    fechaFin: '2026-12-18',
    estado: 'vigente',
    dias: Array.from({ length: 28 }, (_, i) => ({
      numero: i + 1,
      fecha: fechaDelDia(i + 1),
      rutinaId: i + 1 === 2 ? 'r2' : i + 1 === 5 ? 'r1' : null,
      esDescanso: !(i + 1 === 2 || i + 1 === 5),
    })),
  };
}

function iniciar(alGuardar?: (numero: number, cuerpo: unknown) => Response) {
  const guardados: { numero: number; cuerpo: unknown }[] = [];
  servidorRedFalsa.use(
    http.get(`${base}/planificacion/planes/p1`, () => HttpResponse.json(planConDias())),
    http.get(`${base}/planificacion/rutinas`, () =>
      HttpResponse.json({ items: RUTINAS, total: 2, pagina: 1, tamanio: 100 }),
    ),
    http.put(`${base}/planificacion/planes/p1/dias/:numero`, async ({ request, params }) => {
      const cuerpo = (await request.json()) as { rutinaId: string | null };
      const numero = Number(params.numero);
      guardados.push({ numero, cuerpo });
      if (alGuardar) return alGuardar(numero, cuerpo);
      return HttpResponse.json({
        numero,
        fecha: fechaDelDia(numero),
        rutinaId: cuerpo.rutinaId,
        esDescanso: cuerpo.rutinaId === null,
      });
    }),
  );
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Profesor' }));
  render(
    <MemoryRouter initialEntries={['/profesor/planes/p1/dias']}>
      <Aplicacion />
    </MemoryRouter>,
  );
  return guardados;
}

/** El elemento de la grilla del día dado (se identifica por su texto "Día N"). */
async function dia(numero: number): Promise<HTMLElement> {
  const lista = await screen.findByRole('list', { name: 'Días del plan' });
  const item = within(lista)
    .getAllByRole('listitem')
    .find((li) => within(li).queryByText(`Día ${numero}`) !== null);
  if (!item) throw new Error(`No hay tarjeta del día ${numero}`);
  return item;
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true, now: new Date('2026-11-24T12:00:00Z') });
});
afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
});

describe('RN-PLAN-23 · el profesor edita los días de un plan', () => {
  it('F1 · muestra los 28 días con su rutina o "Descanso" y sin selector los anteriores a hoy', async () => {
    iniciar();

    const lista = await screen.findByRole('list', { name: 'Días del plan' });
    expect(within(lista).getAllByRole('listitem')).toHaveLength(28);

    const dia2 = await dia(2);
    expect(within(dia2).getByText('Tracción', { ignore: 'option' })).toBeVisible();
    expect(within(dia2).queryByRole('combobox')).toBeNull();
    expect(within(await dia(1)).getByText('Descanso', { ignore: 'option' })).toBeVisible();
    expect(within(await dia(1)).queryByRole('combobox')).toBeNull();
    expect(within(await dia(3)).queryByRole('combobox')).toBeNull();

    // El día 4 es hoy (24/11): editable.
    expect(within(await dia(4)).getByRole('combobox')).toBeVisible();
    expect(within(await dia(5)).getByText('Empuje', { ignore: 'option' })).toBeVisible();
    expect(within(await dia(28)).getByRole('combobox')).toBeVisible();
    expect(within(await dia(10)).getByText(/30\/11/)).toBeVisible();
  });

  it('F2 · guarda la rutina de un día y un día de descanso, y los muestra', async () => {
    const guardados = iniciar();
    const usuario = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    const dia10 = await dia(10);
    await usuario.selectOptions(within(dia10).getByRole('combobox'), 'Empuje');
    await usuario.click(within(dia10).getByRole('button', { name: 'Guardar' }));
    expect(await within(await dia(10)).findByText('Empuje', { ignore: 'option' })).toBeVisible();

    const dia12 = await dia(12);
    await usuario.selectOptions(within(dia12).getByRole('combobox'), 'Descanso');
    await usuario.click(within(dia12).getByRole('button', { name: 'Guardar' }));
    expect(await within(await dia(12)).findByText('Descanso', { ignore: 'option' })).toBeVisible();

    expect(guardados).toEqual([
      { numero: 10, cuerpo: { rutinaId: 'r1' } },
      { numero: 12, cuerpo: { rutinaId: null } },
    ]);
  });

  it('F3 · muestra en un alert el mensaje del back si rechaza el cambio (409 RN-PLAN-23)', async () => {
    iniciar(() =>
      HttpResponse.json(
        { codigo: 'RN-PLAN-23', mensaje: 'No se puede modificar un día que ya pasó' },
        { status: 409 },
      ),
    );
    const usuario = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    const dia10 = await dia(10);
    await usuario.selectOptions(within(dia10).getByRole('combobox'), 'Empuje');
    await usuario.click(within(dia10).getByRole('button', { name: 'Guardar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se puede modificar un día que ya pasó',
    );
  });
});
