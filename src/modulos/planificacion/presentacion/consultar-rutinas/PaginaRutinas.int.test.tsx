import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, type JsonBodyType } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const URL_CATALOGO = 'http://localhost:3000/catalogo/ejercicios';
const URL_RUTINAS = 'http://localhost:3000/planificacion/rutinas';
const URL_NOMBRE = 'http://localhost:3000/planificacion/rutinas/:id/nombre';

// Forma exacta de GET /catalogo/ejercicios (back: catalogo.controlador.ts).
const CATALOGO = [
  {
    id: 'e-press',
    nombre: 'lever chest press',
    descripcion: 'descripción',
    tipo: 'por repeticiones',
    tipoCarga: 'Peso Extra',
    factorPesoCorporal: null,
    musculoPrincipal: 'Pectoral',
    grupoMuscular: 'Pecho',
    musculoSecundario: null,
    urlGif: 'https://ejemplo.test/gif.gif',
    atribucion: '© Gym visual — https://gymvisual.com/',
  },
];

// Forma de RutinaRespuesta del back (planificación): con `nombre`.
const rutina = (id: string, nombre: string) => ({
  id,
  nombre,
  tipo: 'Bloques',
  bloques: [
    {
      ejercicioId: 'e-press',
      series: 3,
      micropausaSegundos: 60,
      macropausaSegundos: 120,
      repeticiones: 10,
      segundos: null,
      pesoKg: null,
    },
  ],
  circuitos: [],
});

type Opciones = {
  /** Respuesta de GET /planificacion/rutinas según la página y el tamaño pedidos. */
  listado: (pagina: number, tamanio: number) => JsonBodyType;
  /** Respuesta de PATCH /planificacion/rutinas/:id/nombre. Por defecto, 200 con el nombre nuevo. */
  alRenombrar?: () => Response;
};

/** Declara la red falsa y guarda los query params de cada listado y los body de cada PATCH. */
function prepararRed(opciones: Opciones) {
  const consultas: URLSearchParams[] = [];
  const cambios: unknown[] = [];
  servidorRedFalsa.use(
    http.get(URL_CATALOGO, () => HttpResponse.json(CATALOGO)),
    http.get(URL_RUTINAS, ({ request }) => {
      const parametros = new URL(request.url).searchParams;
      consultas.push(parametros);
      return HttpResponse.json(
        opciones.listado(Number(parametros.get('pagina')), Number(parametros.get('tamanio'))),
      );
    }),
    http.patch(URL_NOMBRE, async ({ params, request }) => {
      const cuerpo = await request.json();
      cambios.push(cuerpo);
      if (opciones.alRenombrar) return opciones.alRenombrar();
      return HttpResponse.json(rutina(String(params.id), (cuerpo as { nombre: string }).nombre));
    }),
  );
  return { consultas, cambios };
}

async function abrirPaginaComoProfesor() {
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Profesor' }));
  render(
    <MemoryRouter initialEntries={['/profesor/rutinas']}>
      <Aplicacion />
    </MemoryRouter>,
  );
  return userEvent.setup();
}

afterEach(() => localStorage.clear());

describe('RN-PLAN-21 · la rutina se puede renombrar siempre', () => {
  it('la tarjeta muestra el nombre; "Editar nombre" abre el campo y "Guardar" envía el PATCH y muestra el nombre nuevo', async () => {
    const { cambios } = prepararRed({
      listado: () => ({ items: [rutina('r1', 'Empuje')], total: 1, pagina: 1, tamanio: 10 }),
    });
    const usuario = await abrirPaginaComoProfesor();

    expect(await screen.findByRole('heading', { name: 'Empuje' })).toBeInTheDocument();
    await usuario.click(screen.getByRole('button', { name: 'Editar nombre' }));
    const campo = screen.getByRole('textbox', { name: 'Nombre de la rutina' });
    await usuario.clear(campo);
    await usuario.type(campo, 'Piernas');
    await usuario.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(await screen.findByRole('heading', { name: 'Piernas' })).toBeInTheDocument();
    expect(cambios).toEqual([{ nombre: 'Piernas' }]);
  });

  it('"Cancelar" no envía nada y deja el nombre anterior', async () => {
    const { cambios } = prepararRed({
      listado: () => ({ items: [rutina('r1', 'Empuje')], total: 1, pagina: 1, tamanio: 10 }),
    });
    const usuario = await abrirPaginaComoProfesor();

    expect(await screen.findByRole('heading', { name: 'Empuje' })).toBeInTheDocument();
    await usuario.click(screen.getByRole('button', { name: 'Editar nombre' }));
    const campo = screen.getByRole('textbox', { name: 'Nombre de la rutina' });
    await usuario.clear(campo);
    await usuario.type(campo, 'Piernas');
    await usuario.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.getByRole('heading', { name: 'Empuje' })).toBeInTheDocument();
    expect(cambios).toHaveLength(0);
  });

  it('si el back responde 409 RN-PLAN-21, muestra su mensaje en un alert', async () => {
    prepararRed({
      listado: () => ({ items: [rutina('r1', 'Empuje')], total: 1, pagina: 1, tamanio: 10 }),
      alRenombrar: () =>
        HttpResponse.json(
          { codigo: 'RN-PLAN-21', mensaje: 'Ya tenés una rutina con ese nombre' },
          { status: 409 },
        ),
    });
    const usuario = await abrirPaginaComoProfesor();

    expect(await screen.findByRole('heading', { name: 'Empuje' })).toBeInTheDocument();
    await usuario.click(screen.getByRole('button', { name: 'Editar nombre' }));
    const campo = screen.getByRole('textbox', { name: 'Nombre de la rutina' });
    await usuario.clear(campo);
    await usuario.type(campo, 'Piernas');
    await usuario.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Ya tenés una rutina con ese nombre',
    );
  });
});

describe('RN-PLAN-08 · el profesor ve sus rutinas; sin ninguna, lo invita a crear la primera', () => {
  it('con total 0 muestra "Creá tu primera rutina" y el link "Nueva rutina"', async () => {
    prepararRed({ listado: () => ({ items: [], total: 0, pagina: 1, tamanio: 10 }) });
    await abrirPaginaComoProfesor();

    expect(await screen.findByText('Creá tu primera rutina')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Nueva rutina' })).toBeInTheDocument();
  });
});

describe('T06 · el listado se pagina y el profesor elige cuántas rutinas ver por página', () => {
  it('con 11 rutinas y tamaño 10 muestra "Página 1 de 2"; "Siguiente" pide la página 2; "Por página" ofrece 5, 10, 20, 50 y 100', async () => {
    const { consultas } = prepararRed({
      listado: (pagina, tamanio) => ({
        items: Array.from({ length: 10 }, (_, i) => rutina(`r${i}`, `Rutina ${i + 1}`)),
        total: 11,
        pagina,
        tamanio,
      }),
    });
    const usuario = await abrirPaginaComoProfesor();

    expect(await screen.findByText('Página 1 de 2')).toBeInTheDocument();
    await usuario.click(screen.getByRole('button', { name: 'Siguiente' }));
    await waitFor(() => expect(consultas.at(-1)?.get('pagina')).toBe('2'));

    const select = screen.getByRole('combobox', { name: 'Por página' });
    expect(
      within(select)
        .getAllByRole('option')
        .map((o) => o.textContent),
    ).toEqual(['5', '10', '20', '50', '100']);
  });
});
