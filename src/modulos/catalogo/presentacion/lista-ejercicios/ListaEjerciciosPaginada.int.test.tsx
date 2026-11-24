import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';
import type { Ejercicio } from '../../dominio/ejercicio/ejercicio.ts';

const URL_CONSULTA = 'http://localhost:3000/catalogo/ejercicios/consulta';
const TOTAL = 60; // con tamaño 20, son 3 páginas

const PLANCHA: Ejercicio = {
  id: 'e1',
  nombre: 'weighted front plank',
  descripcion: 'Tumbate boca abajo…',
  tipo: 'por tiempo',
  tipoCarga: 'Peso Corporal + Peso Extra',
  factorPesoCorporal: 100,
  musculoPrincipal: 'Abdominales',
  grupoMuscular: 'Core',
  musculoSecundario: 'Deltoides',
  urlGif:
    'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2135-VBAWRPG.gif',
  atribucion: '© Gym visual — https://gymvisual.com/',
};

const PRESS: Ejercicio = {
  id: 'e2',
  nombre: 'barbell bench press',
  descripcion: 'Acostado en el banco, bajá la barra hasta el pecho.',
  tipo: 'por repeticiones',
  tipoCarga: 'Peso Extra',
  factorPesoCorporal: 0,
  musculoPrincipal: 'Pectoral',
  grupoMuscular: 'Pecho',
  musculoSecundario: 'Tríceps',
  urlGif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0025.gif',
  atribucion: '© Gym visual — https://gymvisual.com/',
};

/** Query params de cada consulta que recibió el back falso, en orden. */
let pedidos: URLSearchParams[] = [];

function responderConsulta(items: Ejercicio[] = [PLANCHA, PRESS], total = TOTAL) {
  servidorRedFalsa.use(
    http.get(URL_CONSULTA, ({ request }) => {
      const parametros = new URL(request.url).searchParams;
      pedidos.push(parametros);
      return HttpResponse.json({
        items,
        total,
        pagina: Number(parametros.get('pagina') ?? '1'),
        tamanio: Number(parametros.get('tamanio') ?? '20'),
      });
    }),
  );
}

function ultimoPedido(): URLSearchParams {
  const ultimo = pedidos[pedidos.length - 1];
  if (!ultimo) throw new Error('El listado no pidió ninguna consulta');
  return ultimo;
}

function renderizarConSesion(rol: 'Admin' | 'Profesor', ruta: string) {
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol }));
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Aplicacion />
    </MemoryRouter>,
  );
}

async function esperarListado() {
  return screen.findByRole('list', { name: 'Catálogo de ejercicios' });
}

afterEach(() => {
  localStorage.clear();
  pedidos = [];
});

describe('RN-CAT-09 · cada ejercicio muestra su GIF en miniatura', () => {
  it('cada ejercicio muestra su GIF en miniatura (img con el urlGif)', async () => {
    responderConsulta();
    renderizarConSesion('Admin', '/admin/ejercicios');

    const lista = await esperarListado();
    const items = within(lista).getAllByRole('listitem');
    expect(items[0].querySelector('img')).toHaveAttribute('src', PLANCHA.urlGif);
    expect(items[1].querySelector('img')).toHaveAttribute('src', PRESS.urlGif);
  });
});

describe('T06 · el listado se pagina de a 20 por defecto y con el tamaño elegido', () => {
  it('arranca pidiendo tamanio=20 y muestra "Página 1 de 3"; "Por página" ofrece 5, 10, 20, 50 y 100', async () => {
    responderConsulta();
    renderizarConSesion('Admin', '/admin/ejercicios');
    await esperarListado();

    expect(ultimoPedido().get('pagina')).toBe('1');
    expect(ultimoPedido().get('tamanio')).toBe('20');
    expect(screen.getByText('Página 1 de 3')).toBeInTheDocument();

    const opciones = within(screen.getByLabelText('Por página'))
      .getAllByRole('option')
      .map((opcion) => opcion.textContent);
    expect(opciones).toEqual(['5', '10', '20', '50', '100']);
  });

  it('elegir 50 en "Por página" pide tamanio=50 y pagina=1', async () => {
    responderConsulta();
    const usuario = userEvent.setup();
    renderizarConSesion('Admin', '/admin/ejercicios');
    await esperarListado();
    await usuario.click(screen.getByRole('button', { name: 'Siguiente' }));
    await screen.findByText('Página 2 de 3');

    await usuario.selectOptions(screen.getByLabelText('Por página'), '50');

    await waitFor(() => {
      expect(ultimoPedido().get('tamanio')).toBe('50');
      expect(ultimoPedido().get('pagina')).toBe('1');
    });
  });

  it('"Siguiente" pide pagina=2', async () => {
    responderConsulta();
    const usuario = userEvent.setup();
    renderizarConSesion('Admin', '/admin/ejercicios');
    await esperarListado();

    await usuario.click(screen.getByRole('button', { name: 'Siguiente' }));

    await waitFor(() => expect(ultimoPedido().get('pagina')).toBe('2'));
  });

  it('el tamaño elegido se recuerda al volver a montar la pantalla', async () => {
    responderConsulta();
    const usuario = userEvent.setup();
    const { unmount } = renderizarConSesion('Admin', '/admin/ejercicios');
    await esperarListado();
    await usuario.selectOptions(screen.getByLabelText('Por página'), '50');
    await waitFor(() => expect(ultimoPedido().get('tamanio')).toBe('50'));
    unmount();

    renderizarConSesion('Admin', '/admin/ejercicios');
    await esperarListado();

    expect(ultimoPedido().get('tamanio')).toBe('50');
    expect(screen.getByLabelText('Por página')).toHaveValue('50');
  });
});

describe('RN-UI-LIS-02 y RN-UI-LIS-03 · los filtros se combinan con el buscador y vuelven a la página 1', () => {
  it('buscar, "Grupo muscular", "Músculo principal", "Tipo" y "Tipo de carga" viajan como busqueda, grupo, musculo, tipo y tipoCarga, y vuelven a pagina=1', async () => {
    responderConsulta();
    const usuario = userEvent.setup();
    renderizarConSesion('Admin', '/admin/ejercicios');
    await esperarListado();
    await usuario.click(screen.getByRole('button', { name: 'Siguiente' }));
    await screen.findByText('Página 2 de 3');

    await usuario.type(screen.getByLabelText('Buscar por nombre'), 'press');
    await waitFor(() => {
      expect(ultimoPedido().get('busqueda')).toBe('press');
      expect(ultimoPedido().get('pagina')).toBe('1');
    });

    await usuario.selectOptions(screen.getByLabelText('Grupo muscular'), 'Pecho');
    await waitFor(() => expect(ultimoPedido().get('grupo')).toBe('Pecho'));

    await usuario.selectOptions(screen.getByLabelText('Músculo principal'), 'Pectoral');
    await waitFor(() => expect(ultimoPedido().get('musculo')).toBe('Pectoral'));

    await usuario.selectOptions(screen.getByLabelText('Tipo'), 'por repeticiones');
    await waitFor(() => expect(ultimoPedido().get('tipo')).toBe('por repeticiones'));

    await usuario.selectOptions(screen.getByLabelText('Tipo de carga'), 'Peso Extra');
    await waitFor(() => expect(ultimoPedido().get('tipoCarga')).toBe('Peso Extra'));

    const pedido = ultimoPedido();
    expect(pedido.get('busqueda')).toBe('press');
    expect(pedido.get('grupo')).toBe('Pecho');
    expect(pedido.get('musculo')).toBe('Pectoral');
    expect(pedido.get('tipo')).toBe('por repeticiones');
    expect(pedido.get('tipoCarga')).toBe('Peso Extra');
    expect(pedido.get('pagina')).toBe('1');
  });
});

describe('RN-UI-LIS-01 · "Limpiar filtros" borra el buscador y los filtros', () => {
  it('"Limpiar filtros" borra todo y pide pagina=1 sin filtros', async () => {
    responderConsulta();
    const usuario = userEvent.setup();
    renderizarConSesion('Admin', '/admin/ejercicios');
    await esperarListado();
    await usuario.type(screen.getByLabelText('Buscar por nombre'), 'press');
    await usuario.selectOptions(screen.getByLabelText('Grupo muscular'), 'Pecho');
    await waitFor(() => expect(ultimoPedido().get('grupo')).toBe('Pecho'));

    await usuario.click(screen.getByRole('button', { name: 'Limpiar filtros' }));

    await waitFor(() => {
      const pedido = ultimoPedido();
      expect(pedido.get('pagina')).toBe('1');
      for (const filtro of ['busqueda', 'grupo', 'musculo', 'tipo', 'tipoCarga']) {
        expect(pedido.has(filtro)).toBe(false);
      }
    });
    expect(screen.getByLabelText('Buscar por nombre')).toHaveValue('');
    expect(screen.getByLabelText('Grupo muscular')).toHaveDisplayValue('Todos');
  });
});

describe('RN-UI-LIS-01 · sin resultados se avisa con los filtros aplicados', () => {
  it('una respuesta vacía muestra "No hay ejercicios con esos filtros"', async () => {
    responderConsulta();
    const usuario = userEvent.setup();
    renderizarConSesion('Admin', '/admin/ejercicios');
    await esperarListado();

    // La declaración más reciente tiene prioridad: desde acá el back responde vacío.
    responderConsulta([], 0);
    await usuario.type(screen.getByLabelText('Buscar por nombre'), 'zzz');

    expect(await screen.findByText('No hay ejercicios con esos filtros')).toBeInTheDocument();
  });
});
