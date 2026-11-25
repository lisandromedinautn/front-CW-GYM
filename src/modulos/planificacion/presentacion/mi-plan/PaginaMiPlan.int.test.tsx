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
        .getAllByRole('button')
        .map((dia) => dia.textContent),
    ).toEqual([
      '1 · Día 1 — domingo 01/11: Piernas',
      '2 · Día 2 — lunes 02/11: Descanso',
      '3 · Día 3 — martes 03/11: Descanso',
      '4 · Día 4 — miércoles 04/11: Descanso',
      '5 · Día 5 — jueves 05/11: Descanso',
      '6 · Día 6 — viernes 06/11: Descanso',
      '7 · Día 7 — sábado 07/11: Descanso',
      '8 · Día 8 — domingo 08/11: Descanso',
      '9 · Día 9 — lunes 09/11: Descanso',
      '10 · Día 10 — martes 10/11: Descanso',
      '11 · Día 11 — miércoles 11/11: Descanso',
      '12 · Día 12 — jueves 12/11: Descanso',
      '13 · Día 13 — viernes 13/11: Descanso',
      '14 · Día 14 — sábado 14/11: Descanso',
      '15 · Día 15 — domingo 15/11: Descanso',
      '16 · Día 16 — lunes 16/11: Descanso',
      '17 · Día 17 — martes 17/11: Descanso',
      '18 · Día 18 — miércoles 18/11: Descanso',
      '19 · Día 19 — jueves 19/11: Descanso',
      '20 · Día 20 — viernes 20/11: Descanso',
      '21 · Día 21 — sábado 21/11: Descanso',
      '22 · Día 22 — domingo 22/11: Descanso',
      '23 · Día 23 — lunes 23/11: Descanso',
      '24 · Día 24 — martes 24/11: Descanso',
      '25 · Día 25 — miércoles 25/11: Descanso',
      '26 · Día 26 — jueves 26/11: Descanso',
      '27 · Día 27 — viernes 27/11: Descanso',
      '28 · Día 28 — sábado 28/11: Circuito',
    ]);
    expect(screen.getByText('2026-11-01')).toHaveAttribute('datetime', '2026-11-01');
    expect(screen.getByText('2026-11-28')).toHaveAttribute('datetime', '2026-11-28');
    expect(screen.getAllByText('Descanso')).toHaveLength(26);
    expect(
      screen.getByRole('button', { name: '1 · Día 1 — domingo 01/11: Piernas' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '28 · Día 28 — sábado 28/11: Circuito' }),
    ).toBeInTheDocument();
  });
  it('muestra debajo del calendario el detalle del día elegido', async () => {
    prepararRed();
    abrir();
    const usuario = userEvent.setup();
    const primero = await screen.findByRole('button', {
      name: '1 · Día 1 — domingo 01/11: Piernas',
    });
    const ultimo = screen.getByRole('button', { name: '28 · Día 28 — sábado 28/11: Circuito' });

    await usuario.click(primero);

    const detallePrimero = screen.getByRole('region', { name: 'Día 1 — domingo 01/11' });
    expect(within(detallePrimero).getByText('Press de pecho')).toBeVisible();
    expect(within(detallePrimero).getByText('Día 1 de 28')).toBeVisible();
    expect(within(detallePrimero).getByText('3 series × 10 repeticiones · 20 kg')).toBeVisible();
    expect(
      within(detallePrimero).getByText(
        'Micropausa entre series: 60 s · Macropausa al terminar el bloque: 120 s',
      ),
    ).toBeVisible();

    await usuario.click(ultimo);

    const detalleUltimo = screen.getByRole('region', { name: 'Día 28 — sábado 28/11' });
    expect(within(detalleUltimo).getByText('Día 28 de 28')).toBeVisible();
    expect(within(detalleUltimo).getByText('3 vueltas')).toBeVisible();
    expect(within(detalleUltimo).getByText('Press de pecho')).toBeVisible();
    expect(within(detalleUltimo).getByText('10 repeticiones · 20 kg')).toBeVisible();
    expect(within(detalleUltimo).getByText('Plancha')).toBeVisible();
    expect(within(detalleUltimo).getByText('30 segundos')).toBeVisible();
    expect(
      within(detalleUltimo).getByText('Macropausa al terminar cada vuelta: 90 s'),
    ).toBeVisible();

    expect(screen.queryByRole('region', { name: 'Día 1 — domingo 01/11' })).not.toBeInTheDocument();
    expect(ultimo).toHaveAttribute('aria-pressed', 'true');
    expect(primero).toHaveAttribute('aria-pressed', 'false');
  });

  it('la leyenda nombra cada rutina del plan una vez, en el orden en que aparece', async () => {
    const dias = PLAN_COMPLETO.plan.dias.map((dia) =>
      dia.numero === 3 ? { ...dia, rutina: PIERNAS } : dia,
    );
    prepararRed({ ...PLAN_COMPLETO, plan: { ...PLAN_COMPLETO.plan, dias } });
    abrir();

    const leyenda = await screen.findByRole('list', { name: 'Rutinas del plan' });

    expect(
      within(leyenda)
        .getAllByRole('listitem')
        .map((rutina) => rutina.textContent),
    ).toEqual(['Piernas', 'Circuito']);
  });

  it('al entrar elige y marca el día de hoy que informa el back', async () => {
    prepararRed();
    abrir();

    const hoy = await screen.findByRole('button', {
      name: '14 · Día 14 — sábado 14/11: Descanso',
    });

    expect(hoy).toHaveAttribute('aria-current', 'date');
    expect(hoy).toHaveAttribute('aria-pressed', 'true');
    const detalle = screen.getByRole('region', { name: 'Día 14 — sábado 14/11' });
    expect(within(detalle).getByText('Día de descanso')).toBeInTheDocument();
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
