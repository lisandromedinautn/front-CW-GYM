import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';
import type { Ejercicio } from '../../dominio/ejercicio/ejercicio.ts';

const URL_CONSULTA = 'http://localhost:3000/catalogo/ejercicios/consulta';
const TOTAL = 60;

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

/** Lista cerrada de músculos de RN-CAT-05, en el orden de la tabla. */
const MUSCULOS_RN_CAT_05 = [
  'Cuádriceps',
  'Isquiotibiales',
  'Glúteos',
  'Gemelos',
  'Sóleo',
  'Aductores',
  'Abductores',
  'Pectoral',
  'Serrato',
  'Dorsal',
  'Trapecio',
  'Lumbar',
  'Elevador de la escápula',
  'Deltoides',
  'Bíceps',
  'Tríceps',
  'Antebrazo',
  'Abdominales',
  'Oblicuos',
  'Cardiovascular',
];

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

function opcionesDe(select: HTMLElement): (string | null)[] {
  return within(select)
    .getAllByRole('option')
    .map((opcion) => opcion.textContent);
}

afterEach(() => {
  localStorage.clear();
  pedidos = [];
});

describe('RN-CAT-05 y RN-UI-LIS-04 · el músculo principal depende del grupo muscular', () => {
  it('D1 · con grupo "Pecho", "Músculo principal" ofrece exactamente Todos, Pectoral y Serrato', async () => {
    responderConsulta();
    const usuario = userEvent.setup();
    renderizarConSesion('Admin', '/admin/ejercicios');
    await esperarListado();

    await usuario.selectOptions(screen.getByLabelText('Grupo muscular'), 'Pecho');
    await waitFor(() => expect(ultimoPedido().get('grupo')).toBe('Pecho'));

    expect(opcionesDe(screen.getByLabelText('Músculo principal'))).toEqual([
      'Todos',
      'Pectoral',
      'Serrato',
    ]);
  });

  it('D2 · con grupo "Todos", "Músculo principal" ofrece Todos más todos los músculos de la lista cerrada', async () => {
    responderConsulta();
    renderizarConSesion('Admin', '/admin/ejercicios');
    await esperarListado();

    expect(screen.getByLabelText('Grupo muscular')).toHaveDisplayValue('Todos');
    expect(opcionesDe(screen.getByLabelText('Músculo principal'))).toEqual([
      'Todos',
      ...MUSCULOS_RN_CAT_05,
    ]);
  });

  it('D3 · con músculo "Cuádriceps" y después grupo "Pecho", "Músculo principal" vuelve a Todos y el pedido lleva grupo=Pecho sin musculo', async () => {
    responderConsulta();
    const usuario = userEvent.setup();
    renderizarConSesion('Admin', '/admin/ejercicios');
    await esperarListado();

    await usuario.selectOptions(screen.getByLabelText('Músculo principal'), 'Cuádriceps');
    await waitFor(() => expect(ultimoPedido().get('musculo')).toBe('Cuádriceps'));

    await usuario.selectOptions(screen.getByLabelText('Grupo muscular'), 'Pecho');
    await waitFor(() => expect(ultimoPedido().get('grupo')).toBe('Pecho'));

    expect(screen.getByLabelText('Músculo principal')).toHaveDisplayValue('Todos');
    expect(ultimoPedido().get('grupo')).toBe('Pecho');
    expect(ultimoPedido().has('musculo')).toBe(false);
  });

  it('D4 · con músculo "Cuádriceps" y después grupo "Piernas", el músculo sigue en Cuádriceps y el pedido lleva grupo=Piernas y musculo=Cuádriceps', async () => {
    responderConsulta();
    const usuario = userEvent.setup();
    renderizarConSesion('Admin', '/admin/ejercicios');
    await esperarListado();

    await usuario.selectOptions(screen.getByLabelText('Músculo principal'), 'Cuádriceps');
    await waitFor(() => expect(ultimoPedido().get('musculo')).toBe('Cuádriceps'));

    await usuario.selectOptions(screen.getByLabelText('Grupo muscular'), 'Piernas');
    await waitFor(() => expect(ultimoPedido().get('grupo')).toBe('Piernas'));

    expect(screen.getByLabelText('Músculo principal')).toHaveDisplayValue('Cuádriceps');
    expect(ultimoPedido().get('grupo')).toBe('Piernas');
    expect(ultimoPedido().get('musculo')).toBe('Cuádriceps');
  });
});
