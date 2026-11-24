import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const URL_API = 'http://localhost:3000';
const RUTA = '/profesor/notificaciones';

const sinMedir = { repeticiones: null, segundos: null, pesoKg: null };
const prescripta = { repeticiones: 10, segundos: null, pesoKg: 30 };
const serie = (numero: number, realizada: typeof prescripta | null) => ({
  orden: 2,
  numero,
  posicion: null,
  ejercicioId: 'press',
  nombre: 'lever chest press',
  prescripta,
  realizada: realizada === null ? null : { ...sinMedir, ...realizada },
});

// Notificación de referencia de la ficha (US21): grave, Medina, Santiago, rutina "Fuerza".
const referencia = {
  id: 'n1',
  creada: '2026-11-24T14:00:00.000Z',
  leida: false,
  gravedad: 'grave',
  alumno: { id: 'a1', nombre: 'Santiago', apellido: 'Medina' },
  entrenamiento: { id: 'e1', rutina: 'Fuerza', inicio: '2026-11-24T13:00:00.000Z' },
  totalSeries: 5,
  seriesPorDebajo: [
    serie(3, { repeticiones: 8, segundos: null, pesoKg: 30 }),
    serie(4, { repeticiones: 10, segundos: null, pesoKg: 25 }),
    serie(5, null),
  ],
  percepcion: null,
};

function preparar(
  opciones: {
    notificacion?: Record<string, unknown>;
    noLeidas?: number;
    total?: number;
    lectura?: () => Response;
  } = {},
) {
  const pedidos: string[] = [];
  servidorRedFalsa.use(
    http.get(`${URL_API}/notificaciones/mis-notificaciones`, ({ request }) => {
      const url = new URL(request.url);
      pedidos.push(url.search);
      return HttpResponse.json({
        items: [{ ...referencia, ...opciones.notificacion }],
        total: opciones.total ?? 1,
        pagina: Number(url.searchParams.get('pagina')),
        tamanio: Number(url.searchParams.get('tamanio')),
        noLeidas: opciones.noLeidas ?? 1,
      });
    }),
    http.get(`${URL_API}/notificaciones/mis-notificaciones/no-leidas`, () =>
      HttpResponse.json({ cantidad: opciones.noLeidas ?? 1 }),
    ),
    http.put(
      `${URL_API}/notificaciones/mis-notificaciones/:id/lectura`,
      () => opciones.lectura?.() ?? new HttpResponse(null, { status: 204 }),
    ),
  );
  return pedidos;
}

function abrir() {
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Profesor' }));
  render(
    <MemoryRouter initialEntries={[RUTA]}>
      <Aplicacion />
    </MemoryRouter>,
  );
}

afterEach(() => {
  localStorage.clear();
});

describe('RN-NOT-01 y RN-NOT-02 · la notificación muestra alumno, rutina, fecha, gravedad y series por debajo', () => {
  it('muestra la notificación', async () => {
    preparar();
    abrir();
    const tarjeta = within(await screen.findByRole('article'));

    expect(tarjeta.getByText('Grave')).toBeVisible();
    expect(tarjeta.getByText('Medina, Santiago')).toBeVisible();
    expect(tarjeta.getByText('Fuerza')).toBeVisible();
    expect(tarjeta.getByText('24/11/2026 10:00')).toBeVisible();
    expect(tarjeta.getByText('Series por debajo: 3 de 5')).toBeVisible();
    expect(
      tarjeta.getByRole('link', { name: 'Ver entrenamientos de Medina, Santiago' }),
    ).toHaveAttribute('href', '/profesor/entrenamientos?alumno=a1');

    const serieTres = within(tarjeta.getByText('Serie 3 · lever chest press').closest('li')!);
    expect(serieTres.getByText('Prescripto: 10 repeticiones · 30 kg')).toBeVisible();
    expect(serieTres.getByText('Realizado: 8 repeticiones · 30 kg')).toBeVisible();
    const serieCinco = within(tarjeta.getByText('Serie 5 · lever chest press').closest('li')!);
    expect(serieCinco.getByText('Realizado: Sin registrar')).toBeVisible();
  });

  it('gravedad leve', async () => {
    preparar({ notificacion: { gravedad: 'leve' } });
    abrir();
    expect(await screen.findByText('Leve')).toBeVisible();
    expect(screen.queryByText('Grave')).not.toBeInTheDocument();
  });
});

describe('RN-NOT-03 · no leídas arriba y listado paginado', () => {
  it('no leídas y paginado', async () => {
    const pedidos = preparar({ noLeidas: 2, total: 12 });
    abrir();
    expect(await screen.findByText('No leídas: 2')).toBeVisible();
    expect(pedidos).toEqual(['?pagina=1&tamanio=10']);

    const usuario = userEvent.setup();
    await usuario.click(
      within(screen.getByRole('navigation', { name: 'Paginación' })).getByRole('button', {
        name: 'Siguiente',
      }),
    );
    await screen.findByText('Página 2 de 2');
    expect(pedidos).toEqual(['?pagina=1&tamanio=10', '?pagina=2&tamanio=10']);
  });
});

describe('RN-NOT-04 · marcar una notificación como leída', () => {
  it('marcar como leída', async () => {
    preparar({ noLeidas: 2 });
    abrir();
    expect(await screen.findByText('No leídas: 2')).toBeVisible();
    const usuario = userEvent.setup();
    await usuario.click(screen.getByRole('button', { name: 'Marcar como leída' }));

    expect(await screen.findByText('No leídas: 1')).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Marcar como leída' })).not.toBeInTheDocument();
  });

  it('error al marcar', async () => {
    preparar({
      lectura: () =>
        HttpResponse.json(
          { codigo: 'RN-NOT-04', mensaje: 'La notificación no existe' },
          { status: 404 },
        ),
    });
    abrir();
    const usuario = userEvent.setup();
    await usuario.click(await screen.findByRole('button', { name: 'Marcar como leída' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('La notificación no existe');
  });
});

describe('RN-UI-NOT-02 · el enlace lleva a los entrenamientos del alumno de la notificación', () => {
  it('enlace a los entrenamientos del alumno', async () => {
    const pedidosEntrenamientos: string[] = [];
    preparar();
    servidorRedFalsa.use(
      http.get(`${URL_API}/identidad/alumnos`, () =>
        HttpResponse.json([
          { id: 'a2', nombre: 'Sofía', apellido: 'López' },
          { id: 'a1', nombre: 'Santiago', apellido: 'Medina' },
        ]),
      ),
      http.get(`${URL_API}/entrenamiento/alumnos/*`, ({ request }) => {
        const url = new URL(request.url);
        pedidosEntrenamientos.push(url.pathname + url.search);
        return HttpResponse.json({ items: [], total: 0, pagina: 1, tamanio: 10 });
      }),
    );
    abrir();
    const usuario = userEvent.setup();
    await usuario.click(
      await screen.findByRole('link', { name: 'Ver entrenamientos de Medina, Santiago' }),
    );

    expect(await screen.findByDisplayValue('Medina, Santiago')).toBeVisible();
    expect(await screen.findByText('Este alumno todavía no tiene entrenamientos.')).toBeVisible();
    expect(pedidosEntrenamientos).toEqual([
      '/entrenamiento/alumnos/a1/entrenamientos?pagina=1&tamanio=10',
    ]);
  });
});

describe('RN-NOT-05, 06 · la percepción se muestra; sin series por debajo, la notificación es por percepción mala', () => {
  it('muestra la percepción', async () => {
    preparar({ notificacion: { percepcion: { rpe: 10, sensacionFuerza: 1 } } });
    abrir();
    const tarjeta = within(await screen.findByRole('article'));

    expect(tarjeta.getByText('RPE: 10 · Sensación de fuerza: 1')).toBeVisible();
  });

  it('solo por percepción mala', async () => {
    preparar({
      notificacion: { seriesPorDebajo: [], percepcion: { rpe: 10, sensacionFuerza: 1 } },
    });
    abrir();
    const tarjeta = within(await screen.findByRole('article'));

    expect(tarjeta.getByText('Percepción mala')).toBeVisible();
    expect(tarjeta.getByText('RPE: 10 · Sensación de fuerza: 1')).toBeVisible();
    expect(tarjeta.queryByText(/Series por debajo/)).not.toBeInTheDocument();
    expect(tarjeta.queryByText(/Serie 3 · lever chest press/)).not.toBeInTheDocument();
  });
});
