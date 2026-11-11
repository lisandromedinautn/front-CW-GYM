import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const URL_EJERCICIOS = 'http://localhost:3000/catalogo/ejercicios/consulta';

const PLANCHA = {
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

const PRESS = {
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

/** Respuesta de la consulta paginada con la forma del contrato; filtra por busqueda como el back. */
function respuestaConsulta() {
  return http.get(URL_EJERCICIOS, ({ request }) => {
    const busqueda = (new URL(request.url).searchParams.get('busqueda') ?? '').toLowerCase();
    const items = [PLANCHA, PRESS].filter((e) => e.nombre.toLowerCase().includes(busqueda));
    return HttpResponse.json({ items, total: items.length, pagina: 1, tamanio: 20 });
  });
}

function renderizarConSesion(rol: 'Admin' | 'Profesor', ruta: string) {
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol }));
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Aplicacion />
    </MemoryRouter>,
  );
}

async function listaDeEjercicios() {
  return screen.findByRole('list', { name: 'Catálogo de ejercicios' });
}

afterEach(() => localStorage.clear());

describe('RN-CAT-01 · el catálogo se lista con sus datos principales', () => {
  it('como Admin, cada ejercicio muestra nombre, tipo, tipo de carga, músculo principal y grupo muscular', async () => {
    servidorRedFalsa.use(respuestaConsulta());
    renderizarConSesion('Admin', '/admin/ejercicios');

    const lista = await listaDeEjercicios();
    const items = within(lista).getAllByRole('listitem');
    expect(items).toHaveLength(2);

    const planchaLi = items[0];
    expect(within(planchaLi).getByText('weighted front plank')).toBeInTheDocument();
    expect(within(planchaLi).getByText('por tiempo')).toBeInTheDocument();
    expect(within(planchaLi).getByText('Peso Corporal + Peso Extra')).toBeInTheDocument();
    expect(within(planchaLi).getByText('Abdominales')).toBeInTheDocument();
    expect(within(planchaLi).getByText('Core')).toBeInTheDocument();

    expect(within(items[1]).getByText('barbell bench press')).toBeInTheDocument();
    expect(within(items[1]).getByText('por repeticiones')).toBeInTheDocument();
    expect(within(items[1]).getByText('Peso Extra')).toBeInTheDocument();
    expect(within(items[1]).getByText('Pectoral')).toBeInTheDocument();
    expect(within(items[1]).getByText('Pecho')).toBeInTheDocument();
  });

  it('como Profesor, en /profesor/ejercicios también ve la lista de ejercicios', async () => {
    servidorRedFalsa.use(respuestaConsulta());
    renderizarConSesion('Profesor', '/profesor/ejercicios');

    const lista = await listaDeEjercicios();
    expect(within(lista).getAllByRole('listitem')).toHaveLength(2);
    expect(within(lista).getByRole('button', { name: 'weighted front plank' })).toBeInTheDocument();
    expect(within(lista).getByRole('button', { name: 'barbell bench press' })).toBeInTheDocument();
  });

  it('el botón "Registrar ejercicio" está visible y deshabilitado (DT-06)', async () => {
    servidorRedFalsa.use(respuestaConsulta());
    renderizarConSesion('Admin', '/admin/ejercicios');
    await listaDeEjercicios();

    expect(screen.getByRole('button', { name: 'Registrar ejercicio' })).toBeDisabled();
  });

  it('escribir "press" en "Buscar por nombre" deja solo los ejercicios que contienen "press"', async () => {
    servidorRedFalsa.use(respuestaConsulta());
    const usuario = userEvent.setup();
    renderizarConSesion('Admin', '/admin/ejercicios');
    await listaDeEjercicios();

    await usuario.type(screen.getByLabelText('Buscar por nombre'), 'press');

    const lista = screen.getByRole('list', { name: 'Catálogo de ejercicios' });
    const items = within(lista).getAllByRole('listitem');
    expect(items).toHaveLength(1);
    expect(within(items[0]).getByText('barbell bench press')).toBeInTheDocument();
    expect(screen.queryByText('weighted front plank')).not.toBeInTheDocument();
  });
});

describe('RN-CAT-09 · el detalle del ejercicio muestra el GIF y su atribución', () => {
  it('al tocar el nombre del ejercicio se abre el dialog con la imagen y la atribución', async () => {
    servidorRedFalsa.use(respuestaConsulta());
    const usuario = userEvent.setup();
    renderizarConSesion('Admin', '/admin/ejercicios');
    const lista = await listaDeEjercicios();

    await usuario.click(within(lista).getByRole('button', { name: 'weighted front plank' }));

    const detalle = await screen.findByRole('dialog', { name: 'weighted front plank' });
    const imagen = within(detalle).getByRole('img', { name: 'weighted front plank' });
    expect(imagen).toHaveAttribute('src', PLANCHA.urlGif);
    expect(within(detalle).getByText('© Gym visual — https://gymvisual.com/')).toBeInTheDocument();
  });
});
