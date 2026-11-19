import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const URL_CATALOGO = 'http://localhost:3000/catalogo/ejercicios';
const URL_RUTINAS = 'http://localhost:3000/planificacion/rutinas';

const ejercicio = (id: string, nombre: string, tipo: string, tipoCarga: string) => ({
  id,
  nombre,
  descripcion: 'descripción',
  tipo,
  tipoCarga,
  factorPesoCorporal: null,
  musculoPrincipal: 'Pectoral',
  grupoMuscular: 'Pecho',
  musculoSecundario: null,
  urlGif: 'https://ejemplo.test/gif.gif',
  atribucion: '© Gym visual — https://gymvisual.com/',
});

// Forma exacta de GET /catalogo/ejercicios (back: catalogo.controlador.ts).
const CATALOGO = [
  ejercicio('e-press', 'lever chest press', 'por repeticiones', 'Peso Extra'),
  ejercicio('e-plancha', 'weighted front plank', 'por tiempo', 'Peso Corporal + Peso Extra'),
];

type Usuario = ReturnType<typeof userEvent.setup>;

// Lo que el editor envía para el bloque y el circuito de los ejemplos (sin `orden`).
const BLOQUE = {
  ejercicioId: 'e-press',
  series: 3,
  micropausaSegundos: 60,
  macropausaSegundos: 120,
  repeticiones: 10,
};
const CIRCUITO = {
  vueltas: 3,
  macropausaSegundos: 90,
  ejercicios: [
    { ejercicioId: 'e-press', repeticiones: 10 },
    { ejercicioId: 'e-plancha', segundos: 45 },
  ],
};

/** Declara el catálogo y guarda el body de cada POST a /planificacion/rutinas. */
function prepararRed() {
  const envios: unknown[] = [];
  servidorRedFalsa.use(
    http.get(URL_CATALOGO, () => HttpResponse.json(CATALOGO)),
    http.post(URL_RUTINAS, async ({ request }) => {
      envios.push(await request.json());
      return HttpResponse.json(
        { id: 'r1', nombre: 'Rutina 1', tipo: 'Mixta', bloques: [], circuitos: [] },
        { status: 201 },
      );
    }),
  );
  return envios;
}

async function abrirEditor() {
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Profesor' }));
  render(
    <MemoryRouter initialEntries={['/profesor/rutinas/nueva']}>
      <Aplicacion />
    </MemoryRouter>,
  );
  const usuario = userEvent.setup();
  await screen.findByRole('button', { name: 'Agregar bloque' });
  return usuario;
}

const agregar = (usuario: Usuario, que: 'bloque' | 'circuito') =>
  usuario.click(screen.getByRole('button', { name: `Agregar ${que}` }));

async function elegir(usuario: Usuario, grupo: HTMLElement, nombre: string) {
  await usuario.selectOptions(
    within(grupo).getByLabelText('Ejercicio'),
    await within(grupo).findByRole('option', { name: nombre }),
  );
}

/** Bloque 1: lever chest press, 3 series de 10, micropausa 60 s y macropausa 120 s. */
async function completarBloque(usuario: Usuario) {
  const bloque = screen.getByRole('group', { name: 'Bloque 1' });
  await elegir(usuario, bloque, 'lever chest press');
  await usuario.type(within(bloque).getByLabelText('Repeticiones'), '10');
  await usuario.type(within(bloque).getByLabelText('Series'), '3');
  await usuario.type(within(bloque).getByLabelText('Micropausa (s)'), '60');
  await usuario.type(within(bloque).getByLabelText('Macropausa (s)'), '120');
}

/** Circuito 1: press 10 repeticiones y plancha 45 s, 3 vueltas y macropausa 90 s. */
async function completarCircuito(usuario: Usuario) {
  const circuito = screen.getByRole('group', { name: 'Circuito 1' });
  const press = within(circuito).getByRole('group', { name: 'Ejercicio 1' });
  await elegir(usuario, press, 'lever chest press');
  await usuario.type(within(press).getByLabelText('Repeticiones'), '10');
  const plancha = within(circuito).getByRole('group', { name: 'Ejercicio 2' });
  await elegir(usuario, plancha, 'weighted front plank');
  await usuario.type(within(plancha).getByLabelText('Tiempo (s)'), '45');
  await usuario.type(within(circuito).getByLabelText('Vueltas'), '3');
  await usuario.type(within(circuito).getByLabelText('Macropausa (s)'), '90');
}

afterEach(() => localStorage.clear());

describe('RN-PLAN-01 · una rutina mixta combina bloques y circuitos en orden', () => {
  it('con un bloque, "Agregar circuito" sigue habilitado y al agregarlo muestra "Tipo de rutina: Mixta"', async () => {
    prepararRed();
    const usuario = await abrirEditor();

    await agregar(usuario, 'bloque');
    const habilitado = screen
      .getByRole('button', { name: 'Agregar circuito' })
      .hasAttribute('disabled');
    await agregar(usuario, 'circuito');

    expect([habilitado, screen.queryByText('Tipo de rutina: Mixta') !== null]).toEqual([
      false,
      true,
    ]);
  });

  it('bloque y después circuito envía el bloque con orden 1 y el circuito con orden 2, y muestra "Rutina creada (tipo Mixta)"', async () => {
    const envios = prepararRed();
    const usuario = await abrirEditor();

    await agregar(usuario, 'bloque');
    await agregar(usuario, 'circuito');
    await completarBloque(usuario);
    await completarCircuito(usuario);
    await usuario.click(screen.getByRole('button', { name: 'Guardar rutina' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Rutina creada (tipo Mixta)');
    expect(envios).toEqual([
      { bloques: [{ orden: 1, ...BLOQUE }], circuitos: [{ orden: 2, ...CIRCUITO }] },
    ]);
  });

  it('circuito y después bloque envía el circuito con orden 1 y el bloque con orden 2', async () => {
    const envios = prepararRed();
    const usuario = await abrirEditor();

    await agregar(usuario, 'circuito');
    await agregar(usuario, 'bloque');
    await completarBloque(usuario);
    await completarCircuito(usuario);
    await usuario.click(screen.getByRole('button', { name: 'Guardar rutina' }));

    await screen.findByRole('status');
    expect(envios).toEqual([
      { bloques: [{ orden: 2, ...BLOQUE }], circuitos: [{ orden: 1, ...CIRCUITO }] },
    ]);
  });

  it('con bloque y circuito, "Subir" en el circuito envía el circuito con orden 1 y el bloque con orden 2', async () => {
    const envios = prepararRed();
    const usuario = await abrirEditor();

    await agregar(usuario, 'bloque');
    await agregar(usuario, 'circuito');
    await completarBloque(usuario);
    await completarCircuito(usuario);
    const circuito = screen.getByRole('group', { name: 'Circuito 1' });
    await usuario.click(within(circuito).getByRole('button', { name: 'Subir' }));
    await usuario.click(screen.getByRole('button', { name: 'Guardar rutina' }));

    await screen.findByRole('status');
    expect(envios).toEqual([
      { bloques: [{ orden: 2, ...BLOQUE }], circuitos: [{ orden: 1, ...CIRCUITO }] },
    ]);
  });
});
