import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const URL_API = 'http://localhost:3000';
const RUTA = '/profesor/entrenamientos';

const alumnos = [
  { id: 'a1', nombre: 'Martín', apellido: 'Pérez' },
  { id: 'a2', nombre: 'Sofía', apellido: 'López' },
];

const press = { ejercicioId: 'press', nombre: 'lever chest press', segundos: null };
// Rutina "Fuerza" de US14: circuito de 2 vueltas con 2 ejercicios y bloque de 3 series = 7 pasos.
const rutina = {
  id: 'r1',
  nombre: 'Fuerza',
  tipo: 'Mixta',
  bloques: [
    {
      ...press,
      repeticiones: 10,
      pesoKg: 30,
      orden: 2,
      series: 3,
      micropausaSegundos: 20,
      macropausaSegundos: 60,
    },
  ],
  circuitos: [
    {
      orden: 1,
      vueltas: 2,
      macropausaSegundos: 45,
      ejercicios: [
        {
          ejercicioId: 'plancha',
          nombre: 'weighted front plank',
          repeticiones: null,
          segundos: 30,
          pesoKg: null,
        },
        { ...press, repeticiones: 8, pesoKg: null },
      ],
    },
  ],
};

const e2 = {
  id: 'e2',
  alumnoId: 'a1',
  inicio: '2026-11-21T13:00:00.000Z',
  pesoCorporalKg: 80,
  rutina,
  estado: 'en-curso',
  series: [
    {
      orden: 2,
      numero: 3,
      posicion: null,
      ejercicioId: 'press',
      nombre: 'lever chest press',
      prescripta: { repeticiones: 10, segundos: null, pesoKg: 30 },
      realizada: { repeticiones: 8, segundos: null, pesoKg: 30 },
    },
  ],
};
const e1 = {
  ...e2,
  id: 'e1',
  inicio: '2026-11-20T23:59:00.000Z',
  estado: 'abandonado',
  series: [],
};

function preparar(opciones: { alumnos?: unknown[]; pagina?: (url: URL) => Response } = {}) {
  const pedidos: string[] = [];
  servidorRedFalsa.use(
    http.get(`${URL_API}/identidad/alumnos`, () => HttpResponse.json(opciones.alumnos ?? alumnos)),
    // Cualquier pedido bajo /alumnos/ se registra, incluso uno sin alumno (`/alumnos//...`).
    http.get(`${URL_API}/entrenamiento/alumnos/*`, ({ request }) => {
      const url = new URL(request.url);
      pedidos.push(url.pathname + url.search);
      return (
        opciones.pagina?.(url) ??
        HttpResponse.json({ items: [e2, e1], total: 2, pagina: 1, tamanio: 10 })
      );
    }),
  );
  return pedidos;
}

function abrir(ruta = RUTA) {
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Profesor' }));
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Aplicacion />
    </MemoryRouter>,
  );
}

async function elegirAlumno(nombre: string) {
  const usuario = userEvent.setup();
  await usuario.selectOptions(await screen.findByLabelText('Alumno'), nombre);
  return usuario;
}

const titulos = () =>
  screen.getAllByRole('heading', { level: 2 }).map((titulo) => titulo.textContent);

afterEach(() => {
  localStorage.clear();
});

describe('RN-UI-ENT-04 · el profesor elige un alumno vinculado para ver sus entrenamientos', () => {
  it('sin alumno elegido ofrece López, Sofía y Pérez, Martín y no pide entrenamientos', async () => {
    const pedidos = preparar();
    abrir();
    const selector = await screen.findByLabelText('Alumno');
    expect(
      within(selector)
        .getAllByRole('option')
        .map((opcion) => opcion.textContent)
        .slice(1),
    ).toEqual(['López, Sofía', 'Pérez, Martín']);
    expect(screen.getByText('Elegí un alumno para ver sus entrenamientos.')).toBeVisible();
    expect(pedidos).toEqual([]);
  });

  it('sin alumnos vinculados lo informa y no muestra el selector', async () => {
    preparar({ alumnos: [] });
    abrir();
    expect(await screen.findByText('Todavía no tenés alumnos vinculados.')).toBeVisible();
    expect(screen.queryByLabelText('Alumno')).not.toBeInTheDocument();
  });

  it('un alumno sin entrenamientos muestra que todavía no tiene', async () => {
    preparar({ pagina: () => HttpResponse.json({ items: [], total: 0, pagina: 1, tamanio: 10 }) });
    abrir();
    await elegirAlumno('Pérez, Martín');
    expect(await screen.findByText('Este alumno todavía no tiene entrenamientos.')).toBeVisible();
  });
});

describe('RN-ENT-18 y RN-UI-ENT-04 · entrenamientos del alumno, del más nuevo al más viejo', () => {
  it('al elegir a Pérez pide su primera página y lista el en curso del 21/11 antes que el abandonado del 20/11', async () => {
    const pedidos = preparar();
    abrir();
    await elegirAlumno('Pérez, Martín');

    await screen.findByText('21/11/2026 10:00 · Fuerza · En curso');
    expect(titulos()).toEqual([
      '21/11/2026 10:00 · Fuerza · En curso',
      '20/11/2026 20:59 · Fuerza · Abandonado',
    ]);
    expect(pedidos).toEqual(['/entrenamiento/alumnos/a1/entrenamientos?pagina=1&tamanio=10']);
  });

  it('si el back responde 403 RN-ENT-18 muestra su mensaje', async () => {
    preparar({
      pagina: () =>
        HttpResponse.json(
          { codigo: 'RN-ENT-18', mensaje: 'Solo podés ver los entrenamientos de tus alumnos' },
          { status: 403 },
        ),
    });
    abrir();
    await elegirAlumno('Pérez, Martín');
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Solo podés ver los entrenamientos de tus alumnos',
    );
  });
});

describe('RN-ENT-03 y RN-UI-ENT-04 · cada entrenamiento muestra sus series junto a lo prescripto', () => {
  it('el del 21/11 muestra 80 kg, 1 de 7 series y la serie 3; el del 20/11 no tiene series', async () => {
    preparar();
    abrir();
    await elegirAlumno('Pérez, Martín');
    const [enCurso, abandonado] = await screen.findAllByRole('article');

    const delVeintiuno = within(enCurso as HTMLElement);
    expect(delVeintiuno.getByText('Peso del día: 80 kg')).toBeVisible();
    expect(delVeintiuno.getByText('Series registradas: 1 de 7')).toBeVisible();
    expect(delVeintiuno.getByText('Serie 3 · lever chest press')).toBeVisible();
    expect(delVeintiuno.getByText('Prescripto: 10 repeticiones · 30 kg')).toBeVisible();
    expect(delVeintiuno.getByText('Realizado: 8 repeticiones · 30 kg')).toBeVisible();
    expect(within(abandonado as HTMLElement).getByText('Sin series registradas')).toBeVisible();
  });
});

describe('RN-UI-LIS-03 · paginado; cambiar de alumno vuelve a la página 1', () => {
  it('con 12 entrenamientos pide la página 2 y, al elegir a López, su página 1', async () => {
    const pedidos = preparar({
      pagina: (url) => {
        const pagina = Number(url.searchParams.get('pagina'));
        const items = Array.from({ length: pagina === 1 ? 10 : 2 }, (_, i) => ({
          ...e1,
          id: `p${pagina}-${i}`,
        }));
        return HttpResponse.json({ items, total: 12, pagina, tamanio: 10 });
      },
    });
    abrir();
    const usuario = await elegirAlumno('Pérez, Martín');
    expect(await screen.findByText('Página 1 de 2')).toBeVisible();
    await usuario.click(
      within(screen.getByRole('navigation', { name: 'Paginación' })).getByRole('button', {
        name: 'Siguiente',
      }),
    );
    await screen.findByText('Página 2 de 2');
    await usuario.selectOptions(screen.getByLabelText('Alumno'), 'López, Sofía');
    await screen.findByText('Página 1 de 2');

    expect(pedidos).toEqual([
      '/entrenamiento/alumnos/a1/entrenamientos?pagina=1&tamanio=10',
      '/entrenamiento/alumnos/a1/entrenamientos?pagina=2&tamanio=10',
      '/entrenamiento/alumnos/a2/entrenamientos?pagina=1&tamanio=10',
    ]);
  });
});

describe('RN-UI-IDE-01 · el menú del Profesor ofrece sus entrenamientos de alumnos', () => {
  it('tiene el link Entrenamientos a /profesor/entrenamientos', async () => {
    preparar();
    abrir('/profesor');
    const menu = await screen.findByRole('navigation', { name: /menú/i });
    expect(within(menu).getByRole('link', { name: 'Entrenamientos' })).toHaveAttribute(
      'href',
      RUTA,
    );
  });
});
