import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, type JsonBodyType } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const URL_ALUMNOS = 'http://localhost:3000/identidad/alumnos';
const URL_PLANES = 'http://localhost:3000/planificacion/planes';
const URL_RUTINAS = 'http://localhost:3000/planificacion/rutinas';

// Forma de GET /identidad/alumnos (back: listar-alumnos-del-profesor.caso-uso.ts).
const ALUMNOS = [
  { id: 'a1', nombre: 'Martín', apellido: 'Pérez' },
  { id: 'a2', nombre: 'Sofía', apellido: 'López' },
];

// Forma de ResumenPlan del back (GET /planificacion/planes), ya ordenados por fechaInicio desc.
const PLAN_PROXIMO = {
  id: 'p2',
  fechaInicio: '2026-12-01',
  fechaFin: '2026-12-28',
  estado: 'proximo',
  alumnoIds: ['a2'],
  diasConRutina: 28,
  diasDeDescanso: 0,
};
const PLAN_VIGENTE = {
  id: 'p1',
  fechaInicio: '2026-11-01',
  fechaFin: '2026-11-28',
  estado: 'vigente',
  alumnoIds: ['a1'],
  diasConRutina: 20,
  diasDeDescanso: 8,
};
const PLAN_FINALIZADO = {
  id: 'p3',
  fechaInicio: '2026-10-01',
  fechaFin: '2026-10-28',
  estado: 'finalizado',
  alumnoIds: [],
  diasConRutina: 15,
  diasDeDescanso: 13,
};
const PLANES = [PLAN_PROXIMO, PLAN_VIGENTE, PLAN_FINALIZADO];

// Forma de GET /planificacion/rutinas (lo pide PaginaCrearPlan al abrir "Nuevo plan").
const LISTADO_RUTINAS = {
  items: [
    {
      id: 'r1',
      nombre: 'Empuje',
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
    },
  ],
  total: 1,
  pagina: 1,
  tamanio: 100,
};

type Opciones = {
  /** Respuesta de GET /planificacion/planes según los query params. Por defecto, los tres planes. */
  listado?: (parametros: URLSearchParams) => JsonBodyType;
  /** Respuesta de error de GET /planificacion/planes, si se quiere simular una falla. */
  alListar?: () => Response;
};

/** Declara la red falsa y guarda los query params de cada pedido a /planificacion/planes. */
function prepararRed(opciones: Opciones = {}) {
  const consultas: URLSearchParams[] = [];
  servidorRedFalsa.use(
    http.get(URL_ALUMNOS, () => HttpResponse.json(ALUMNOS)),
    http.get(URL_RUTINAS, () => HttpResponse.json(LISTADO_RUTINAS)),
    http.get(URL_PLANES, ({ request }) => {
      const parametros = new URL(request.url).searchParams;
      consultas.push(parametros);
      if (opciones.alListar) return opciones.alListar();
      return HttpResponse.json(
        opciones.listado
          ? opciones.listado(parametros)
          : { items: PLANES, total: PLANES.length, pagina: 1, tamanio: 10 },
      );
    }),
  );
  return { consultas };
}

function ultimaConsulta(consultas: URLSearchParams[]): URLSearchParams {
  const ultima = consultas.at(-1);
  if (!ultima) throw new Error('El listado de planes no pidió ninguna consulta');
  return ultima;
}

async function abrirPaginaComoProfesor() {
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Profesor' }));
  render(
    <MemoryRouter initialEntries={['/profesor/planes']}>
      <Aplicacion />
    </MemoryRouter>,
  );
  const usuario = userEvent.setup();
  await screen.findByRole('list', { name: 'Planes' });
  return usuario;
}

/** La tarjeta (li) del listado que contiene el texto dado. Falla si no existe. */
function tarjetaCon(texto: string): HTMLElement {
  const lista = screen.getByRole('list', { name: 'Planes' });
  const tarjeta = within(lista)
    .getAllByRole('listitem')
    .find((item) => within(item).queryByText(texto) !== null);
  if (!tarjeta) throw new Error(`Ninguna tarjeta de plan muestra "${texto}"`);
  return tarjeta;
}

function cambiarFecha(etiqueta: 'Inicio desde' | 'Inicio hasta', fecha: string) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: fecha } });
}

afterEach(() => localStorage.clear());

describe('RN-PLAN-22 · el profesor ve sus planes con fechas, estado, alumnos y días', () => {
  it('cada plan muestra sus fechas, su estado, los alumnos por apellido y nombre y sus días', async () => {
    prepararRed();
    await abrirPaginaComoProfesor();

    const proximo = tarjetaCon('Del 01/12/2026 al 28/12/2026');
    expect(within(proximo).getByText('Próximo')).toBeInTheDocument();
    expect(within(proximo).getByText('López, Sofía')).toBeInTheDocument();
    expect(within(proximo).getByText('28 días con rutina · 0 de descanso')).toBeInTheDocument();

    const vigente = tarjetaCon('Del 01/11/2026 al 28/11/2026');
    expect(within(vigente).getByText('Vigente')).toBeInTheDocument();
    expect(within(vigente).getByText('Pérez, Martín')).toBeInTheDocument();
    expect(within(vigente).getByText('20 días con rutina · 8 de descanso')).toBeInTheDocument();

    const finalizado = tarjetaCon('Del 01/10/2026 al 28/10/2026');
    expect(within(finalizado).getByText('Finalizado')).toBeInTheDocument();
    expect(within(finalizado).getByText('Sin alumnos')).toBeInTheDocument();
    expect(within(finalizado).getByText('15 días con rutina · 13 de descanso')).toBeInTheDocument();
  });
});

describe('RN-UI-LIS-03 · al cambiar un filtro el listado vuelve a la página 1', () => {
  it('estando en la página 2, cambiar "Estado" pide pagina=1 y estado=vigente', async () => {
    const { consultas } = prepararRed({
      listado: (parametros) => ({
        items: PLANES,
        total: 11,
        pagina: Number(parametros.get('pagina') ?? '1'),
        tamanio: 10,
      }),
    });
    const usuario = await abrirPaginaComoProfesor();
    await usuario.click(screen.getByRole('button', { name: 'Siguiente' }));
    await waitFor(() => expect(ultimaConsulta(consultas).get('pagina')).toBe('2'));

    await usuario.selectOptions(screen.getByLabelText('Estado'), 'Vigente');

    await waitFor(() => {
      expect(ultimaConsulta(consultas).get('pagina')).toBe('1');
      expect(ultimaConsulta(consultas).get('estado')).toBe('vigente');
    });
  });
});

describe('RN-UI-LIS-02 · los filtros se combinan con Y lógico', () => {
  it('estado, alumno e inicio desde/hasta viajan juntos en la misma consulta', async () => {
    const { consultas } = prepararRed();
    const usuario = await abrirPaginaComoProfesor();
    await screen.findByRole('option', { name: 'Pérez, Martín' });

    await usuario.selectOptions(screen.getByLabelText('Estado'), 'Vigente');
    await usuario.selectOptions(screen.getByLabelText('Alumno'), 'Pérez, Martín');
    cambiarFecha('Inicio desde', '2026-11-01');
    cambiarFecha('Inicio hasta', '2026-11-30');

    await waitFor(() => {
      const pedido = ultimaConsulta(consultas);
      expect(pedido.get('pagina')).toBe('1');
      expect(pedido.get('estado')).toBe('vigente');
      expect(pedido.get('alumnoId')).toBe('a1');
      expect(pedido.get('inicioDesde')).toBe('2026-11-01');
      expect(pedido.get('inicioHasta')).toBe('2026-11-30');
    });
  });
});

describe('RN-UI-LIS-01 · "Limpiar filtros" borra todos los filtros y pide el listado sin ellos', () => {
  it('tras elegir filtros, "Limpiar filtros" los vacía y la consulta vuelve a pagina=1 sin filtros', async () => {
    const { consultas } = prepararRed();
    const usuario = await abrirPaginaComoProfesor();
    await screen.findByRole('option', { name: 'Pérez, Martín' });
    await usuario.selectOptions(screen.getByLabelText('Estado'), 'Vigente');
    await usuario.selectOptions(screen.getByLabelText('Alumno'), 'Pérez, Martín');
    cambiarFecha('Inicio desde', '2026-11-01');
    cambiarFecha('Inicio hasta', '2026-11-30');
    await waitFor(() => expect(ultimaConsulta(consultas).get('inicioHasta')).toBe('2026-11-30'));

    await usuario.click(screen.getByRole('button', { name: 'Limpiar filtros' }));

    await waitFor(() => {
      const pedido = ultimaConsulta(consultas);
      expect(pedido.get('pagina')).toBe('1');
      for (const filtro of ['estado', 'alumnoId', 'inicioDesde', 'inicioHasta']) {
        expect(pedido.has(filtro)).toBe(false);
      }
    });
    expect(screen.getByLabelText('Estado')).toHaveDisplayValue('Todos');
    expect(screen.getByLabelText('Alumno')).toHaveDisplayValue('Todos');
    expect(screen.getByLabelText('Inicio desde')).toHaveValue('');
    expect(screen.getByLabelText('Inicio hasta')).toHaveValue('');
  });
});

describe('RN-PLAN-22 · sin planes, el listado lo dice; con filtros sin resultados, lo avisa', () => {
  it('sin planes y sin filtros muestra "Todavía no creaste planes."', async () => {
    prepararRed({ listado: () => ({ items: [], total: 0, pagina: 1, tamanio: 10 }) });
    await abrirPaginaComoProfesor();

    expect(await screen.findByText('Todavía no creaste planes.')).toBeInTheDocument();
  });

  it('con un filtro que no trae resultados muestra "No hay planes con esos filtros."', async () => {
    prepararRed({
      listado: (parametros) =>
        parametros.has('estado')
          ? { items: [], total: 0, pagina: 1, tamanio: 10 }
          : { items: PLANES, total: PLANES.length, pagina: 1, tamanio: 10 },
    });
    const usuario = await abrirPaginaComoProfesor();

    await usuario.selectOptions(screen.getByLabelText('Estado'), 'Vigente');

    expect(await screen.findByText('No hay planes con esos filtros.')).toBeInTheDocument();
  });
});

describe('RN-PLAN-22 · "Nuevo plan" abre la pantalla de creación', () => {
  it('el botón "Nuevo plan" muestra el encabezado "Nuevo plan" y el campo "Fecha de inicio"', async () => {
    prepararRed();
    const usuario = await abrirPaginaComoProfesor();

    await usuario.click(screen.getByRole('button', { name: 'Nuevo plan' }));

    expect(await screen.findByRole('heading', { name: 'Nuevo plan' })).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha de inicio')).toBeInTheDocument();
  });
});

describe('RN-PLAN-22 · si el back falla al listar, el error se muestra en un alert', () => {
  it('con 500 y un mensaje del back, muestra ese mensaje en un alert', async () => {
    prepararRed({
      alListar: () =>
        HttpResponse.json(
          { codigo: 'ERR-INTERNO', mensaje: 'No se pudieron cargar los planes' },
          { status: 500 },
        ),
    });
    localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Profesor' }));
    render(
      <MemoryRouter initialEntries={['/profesor/planes']}>
        <Aplicacion />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudieron cargar los planes');
  });
});
