import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, type JsonBodyType } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import type { Rol } from '../../../../compartido/dominio/sesion/sesion.ts';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const PIERNAS = {
  id: 'piernas',
  nombre: 'Piernas',
  tipo: 'Bloques',
  bloques: [
    {
      ejercicioId: 'press',
      nombre: 'Press de pecho',
      series: 3,
      repeticiones: 10,
      segundos: null,
      pesoKg: 20,
      micropausaSegundos: 60,
      macropausaSegundos: 120,
    },
  ],
  circuitos: [],
};
const CIRCUITO = {
  id: 'circuito',
  nombre: 'Circuito',
  tipo: 'Circuitos',
  bloques: [],
  circuitos: [
    {
      vueltas: 3,
      macropausaSegundos: 90,
      ejercicios: [
        {
          ejercicioId: 'press',
          nombre: 'Press de pecho',
          repeticiones: 10,
          segundos: null,
          pesoKg: 20,
        },
        {
          ejercicioId: 'plancha',
          nombre: 'Plancha',
          repeticiones: null,
          segundos: 30,
          pesoKg: null,
        },
      ],
    },
  ],
};
const PLAN_COMPLETO = {
  estado: 'plan',
  fecha: '2026-11-14',
  plan: {
    id: 'plan-ana',
    fechaInicio: '2026-11-01',
    fechaFin: '2026-11-28',
    dias: Array.from({ length: 28 }, (_, indice) => ({
      numero: indice + 1,
      fecha: `2026-11-${String(indice + 1).padStart(2, '0')}`,
      rutina: indice === 0 ? PIERNAS : indice === 27 ? CIRCUITO : null,
    })),
  },
};

function prepararRed(respuesta: JsonBodyType = PLAN_COMPLETO, estadoHttp = 200) {
  servidorRedFalsa.use(
    http.get('http://localhost:3000/planificacion/mi-plan', () =>
      HttpResponse.json(respuesta, { status: estadoHttp }),
    ),
  );
}

function abrir(rol: Rol | null = 'Alumno', ruta = '/alumno/mi-plan') {
  if (rol) localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol }));
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Aplicacion />
    </MemoryRouter>,
  );
}

afterEach(() => localStorage.clear());

describe('RN-PLAN-11, 19 · el alumno consulta su plan completo', () => {
  it('muestra los 28 días ordenados con sus fechas, rutinas y descansos', async () => {
    prepararRed();
    abrir();

    const lista = await screen.findByRole('list', { name: 'Días del plan' });

    expect(
      within(lista)
        .getAllByRole('heading', { name: /^Día \d+ — / })
        .map((dia) => dia.textContent),
    ).toEqual([
      'Día 1 — domingo 01/11',
      'Día 2 — lunes 02/11',
      'Día 3 — martes 03/11',
      'Día 4 — miércoles 04/11',
      'Día 5 — jueves 05/11',
      'Día 6 — viernes 06/11',
      'Día 7 — sábado 07/11',
      'Día 8 — domingo 08/11',
      'Día 9 — lunes 09/11',
      'Día 10 — martes 10/11',
      'Día 11 — miércoles 11/11',
      'Día 12 — jueves 12/11',
      'Día 13 — viernes 13/11',
      'Día 14 — sábado 14/11',
      'Día 15 — domingo 15/11',
      'Día 16 — lunes 16/11',
      'Día 17 — martes 17/11',
      'Día 18 — miércoles 18/11',
      'Día 19 — jueves 19/11',
      'Día 20 — viernes 20/11',
      'Día 21 — sábado 21/11',
      'Día 22 — domingo 22/11',
      'Día 23 — lunes 23/11',
      'Día 24 — martes 24/11',
      'Día 25 — miércoles 25/11',
      'Día 26 — jueves 26/11',
      'Día 27 — viernes 27/11',
      'Día 28 — sábado 28/11',
    ]);
    expect(screen.getByText('2026-11-01')).toHaveAttribute('datetime', '2026-11-01');
    expect(screen.getByText('2026-11-28')).toHaveAttribute('datetime', '2026-11-28');
    expect(screen.getAllByText('Descanso')).toHaveLength(26);
    expect(screen.getByLabelText('Ver rutina del día 1: Piernas')).toBeInTheDocument();
    expect(screen.getByLabelText('Ver rutina del día 28: Circuito')).toBeInTheDocument();
  });
  it('despliega ejercicios, objetivos y pausas de cada rutina', async () => {
    prepararRed();
    abrir();
    const usuario = userEvent.setup();
    const primero = await screen.findByRole('listitem', { name: 'Día 1 — domingo 01/11' });
    const ultimo = screen.getByRole('listitem', { name: 'Día 28 — sábado 28/11' });

    await usuario.click(within(primero).getByLabelText('Ver rutina del día 1: Piernas'));

    expect(within(primero).getByText('Press de pecho')).toBeVisible();
    expect(within(primero).getByText('Día 1 de 28')).toBeVisible();
    expect(within(primero).getByText('3 series × 10 repeticiones · 20 kg')).toBeVisible();
    expect(
      within(primero).getByText(
        'Micropausa entre series: 60 s · Macropausa al terminar el bloque: 120 s',
      ),
    ).toBeVisible();

    await usuario.click(within(ultimo).getByLabelText('Ver rutina del día 28: Circuito'));

    expect(within(ultimo).getByText('Día 28 de 28')).toBeVisible();
    expect(within(ultimo).getByText('3 vueltas')).toBeVisible();
    expect(within(ultimo).getByText('Press de pecho')).toBeVisible();
    expect(within(ultimo).getByText('10 repeticiones · 20 kg')).toBeVisible();
    expect(within(ultimo).getByText('Plancha')).toBeVisible();
    expect(within(ultimo).getByText('30 segundos')).toBeVisible();
    expect(within(ultimo).getByText('Macropausa al terminar cada vuelta: 90 s')).toBeVisible();

    await usuario.click(within(primero).getByLabelText('Ver rutina del día 1: Piernas'));

    expect(within(primero).getByText('Press de pecho')).not.toBeVisible();
  });

  it.each(['2026-10-31', '2026-11-29'])(
    'sin plan vigente muestra el aviso para %s (RN-PLAN-15)',
    async (fecha) => {
      prepararRed({ estado: 'sin-plan', fecha });
      abrir();

      expect(await screen.findByText('No tenés un plan vigente.')).toBeInTheDocument();
      expect(screen.queryByRole('list', { name: 'Días del plan' })).not.toBeInTheDocument();
    },
  );

  it('muestra el error de la consulta', async () => {
    prepararRed({ codigo: 'ERROR-RED', mensaje: 'No se pudo consultar el plan' }, 500);
    abrir();

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo consultar el plan');
  });

  it('abre el plan desde el menú', async () => {
    prepararRed();
    abrir('Alumno', '/alumno');
    const usuario = userEvent.setup();

    await usuario.click(screen.getByRole('link', { name: 'Mi plan' }));

    expect(await screen.findByRole('list', { name: 'Días del plan' })).toBeInTheDocument();
  });

  it('abre el plan completo desde la rutina del día (RN-PLAN-18)', async () => {
    prepararRed();
    servidorRedFalsa.use(
      http.get('http://localhost:3000/planificacion/mi-rutina-del-dia', () =>
        HttpResponse.json({ estado: 'descanso', fecha: '2026-11-14', numeroDia: 14 }),
      ),
    );
    abrir('Alumno', '/alumno/rutina-del-dia');
    const usuario = userEvent.setup();
    expect(await screen.findByText('Hoy es día de descanso.')).toBeInTheDocument();

    await usuario.click(screen.getByRole('link', { name: 'Ver mi plan completo' }));

    expect(await screen.findByRole('list', { name: 'Días del plan' })).toBeInTheDocument();
  });

  describe('RN-IDE-03 · solo un Alumno autenticado abre su plan', () => {
    it('sin sesión lleva al ingreso', async () => {
      abrir(null);

      expect(
        await screen.findByRole('heading', { name: 'Ingresar al sistema' }),
      ).toBeInTheDocument();
    });

    it('un Profesor no puede abrir el plan del alumno', async () => {
      abrir('Profesor');

      expect(await screen.findByText('No tenés acceso a esta sección')).toBeInTheDocument();
    });
  });
});
