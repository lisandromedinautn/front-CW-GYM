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
  ejercicio('e-abdominales', '3/4 sit-up', 'por repeticiones', 'Peso Corporal'),
  ejercicio('e-press', 'lever chest press', 'por repeticiones', 'Peso Extra'),
  ejercicio('e-plancha', 'weighted front plank', 'por tiempo', 'Peso Corporal + Peso Extra'),
];

type Usuario = ReturnType<typeof userEvent.setup>;

/** Declara el catálogo y guarda el body de cada POST a /planificacion/rutinas. */
function prepararRed(respuesta: () => Response = () => HttpResponse.json({}, { status: 201 })) {
  const envios: unknown[] = [];
  servidorRedFalsa.use(
    http.get(URL_CATALOGO, () => HttpResponse.json(CATALOGO)),
    http.post(URL_RUTINAS, async ({ request }) => {
      envios.push(await request.json());
      return respuesta();
    }),
  );
  return envios;
}

/** Abre el editor como Profesor y agrega un circuito (arranca con 2 ejercicios vacíos). */
async function abrirConUnCircuito() {
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Profesor' }));
  render(
    <MemoryRouter initialEntries={['/profesor/rutinas']}>
      <Aplicacion />
    </MemoryRouter>,
  );
  const usuario = userEvent.setup();
  await usuario.click(await screen.findByRole('button', { name: 'Agregar circuito' }));
  return { usuario, circuito: screen.getByRole('group', { name: 'Circuito 1' }) };
}

async function elegir(usuario: Usuario, circuito: HTMLElement, posicion: number, nombre: string) {
  const grupo = within(circuito).getByRole('group', { name: `Ejercicio ${posicion}` });
  await usuario.selectOptions(
    within(grupo).getByLabelText('Ejercicio'),
    await within(grupo).findByRole('option', { name: nombre }),
  );
  return grupo;
}

async function completarPressYPlancha(usuario: Usuario, circuito: HTMLElement) {
  const press = await elegir(usuario, circuito, 1, 'lever chest press');
  await usuario.type(within(press).getByLabelText('Repeticiones'), '10');
  await usuario.type(within(press).getByLabelText('Peso (kg)'), '40');
  const plancha = await elegir(usuario, circuito, 2, 'weighted front plank');
  await usuario.type(within(plancha).getByLabelText('Tiempo (s)'), '45');
  await usuario.type(within(circuito).getByLabelText('Vueltas'), '3');
  await usuario.type(within(circuito).getByLabelText('Macropausa (s)'), '90');
}

afterEach(() => localStorage.clear());

describe('RN-PLAN-01 · el tipo de rutina se deriva de su contenido', () => {
  it('con un circuito muestra "Tipo de rutina: Circuitos"', async () => {
    prepararRed();
    await abrirConUnCircuito();

    expect(screen.getByText('Tipo de rutina: Circuitos')).toBeInTheDocument();
  });
});

describe('RN-PLAN-03 · un circuito tiene 2 o más ejercicios, vueltas y macropausa, sin micropausa', () => {
  it('el circuito pide "Vueltas" y "Macropausa (s)", y no "Micropausa (s)"', async () => {
    prepararRed();
    const { circuito } = await abrirConUnCircuito();

    expect([
      within(circuito).queryByLabelText('Vueltas') !== null,
      within(circuito).queryByLabelText('Macropausa (s)') !== null,
      within(circuito).queryByLabelText('Micropausa (s)') !== null,
    ]).toEqual([true, true, false]);
  });

  it('con un solo ejercicio no envía y muestra "Un circuito necesita 2 o más ejercicios"', async () => {
    const envios = prepararRed();
    const { usuario, circuito } = await abrirConUnCircuito();

    const segundo = within(circuito).getByRole('group', { name: 'Ejercicio 2' });
    await usuario.click(within(segundo).getByRole('button', { name: 'Quitar ejercicio' }));
    const press = await elegir(usuario, circuito, 1, 'lever chest press');
    await usuario.type(within(press).getByLabelText('Repeticiones'), '10');
    await usuario.type(within(circuito).getByLabelText('Vueltas'), '3');
    await usuario.type(within(circuito).getByLabelText('Macropausa (s)'), '90');
    await usuario.click(screen.getByRole('button', { name: 'Guardar rutina' }));

    expect(
      await within(circuito).findByText('Un circuito necesita 2 o más ejercicios'),
    ).toBeInTheDocument();
    expect(envios).toHaveLength(0);
  });

  it('con 0 vueltas no envía y muestra "Mínimo 1 vuelta"', async () => {
    const envios = prepararRed();
    const { usuario, circuito } = await abrirConUnCircuito();

    await completarPressYPlancha(usuario, circuito);
    await usuario.clear(within(circuito).getByLabelText('Vueltas'));
    await usuario.type(within(circuito).getByLabelText('Vueltas'), '0');
    await usuario.click(screen.getByRole('button', { name: 'Guardar rutina' }));

    expect(await within(circuito).findByText('Mínimo 1 vuelta')).toBeInTheDocument();
    expect(envios).toHaveLength(0);
  });

  it('si el back responde 400 RN-PLAN-03, muestra su mensaje en el alert', async () => {
    prepararRed(() =>
      HttpResponse.json(
        { codigo: 'RN-PLAN-03', mensaje: 'Un circuito tiene que tener 2 o más ejercicios' },
        { status: 400 },
      ),
    );
    const { usuario, circuito } = await abrirConUnCircuito();

    await completarPressYPlancha(usuario, circuito);
    await usuario.click(screen.getByRole('button', { name: 'Guardar rutina' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Un circuito tiene que tener 2 o más ejercicios',
    );
  });
});

describe('RN-PLAN-04 · en el circuito se pide repeticiones o tiempo según el ejercicio', () => {
  it('weighted front plank (por tiempo) pide "Tiempo (s)" y no "Repeticiones"', async () => {
    prepararRed();
    const { usuario, circuito } = await abrirConUnCircuito();

    const plancha = await elegir(usuario, circuito, 1, 'weighted front plank');

    expect([
      within(plancha).queryByLabelText('Tiempo (s)') !== null,
      within(plancha).queryByLabelText('Repeticiones') !== null,
    ]).toEqual([true, false]);
  });
});

describe('RN-PLAN-20 · un circuito no repite ejercicios', () => {
  it('lever chest press dos veces no envía y muestra "No repitas ejercicios en el circuito"', async () => {
    const envios = prepararRed();
    const { usuario, circuito } = await abrirConUnCircuito();

    const primero = await elegir(usuario, circuito, 1, 'lever chest press');
    await usuario.type(within(primero).getByLabelText('Repeticiones'), '10');
    const segundo = await elegir(usuario, circuito, 2, 'lever chest press');
    await usuario.type(within(segundo).getByLabelText('Repeticiones'), '8');
    await usuario.type(within(circuito).getByLabelText('Vueltas'), '3');
    await usuario.type(within(circuito).getByLabelText('Macropausa (s)'), '90');
    await usuario.click(screen.getByRole('button', { name: 'Guardar rutina' }));

    expect(
      await within(circuito).findByText('No repitas ejercicios en el circuito'),
    ).toBeInTheDocument();
    expect(envios).toHaveLength(0);
  });
});

describe('RN-PLAN-01, 03, 04, 05 · el profesor guarda una rutina por circuitos', () => {
  it('press (10 reps, 40 kg) y plancha (45 s), 3 vueltas y 90 s envía ese body y muestra "Rutina creada"', async () => {
    const envios = prepararRed(() =>
      HttpResponse.json(
        {
          id: 'r1',
          tipo: 'Circuitos',
          bloques: [],
          circuitos: [
            {
              vueltas: 3,
              macropausaSegundos: 90,
              ejercicios: [
                { ejercicioId: 'e-press', repeticiones: 10, segundos: null, pesoKg: 40 },
                { ejercicioId: 'e-plancha', repeticiones: null, segundos: 45, pesoKg: null },
              ],
            },
          ],
        },
        { status: 201 },
      ),
    );
    const { usuario, circuito } = await abrirConUnCircuito();

    await completarPressYPlancha(usuario, circuito);
    await usuario.click(screen.getByRole('button', { name: 'Guardar rutina' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Rutina creada');
    expect(envios).toEqual([
      {
        circuitos: [
          {
            vueltas: 3,
            macropausaSegundos: 90,
            ejercicios: [
              { ejercicioId: 'e-press', repeticiones: 10, pesoKg: 40 },
              { ejercicioId: 'e-plancha', segundos: 45 },
            ],
          },
        ],
      },
    ]);
  });
});
