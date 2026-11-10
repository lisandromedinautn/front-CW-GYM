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

/** Declara el catálogo y cuenta los POST a /planificacion/rutinas guardando su body. */
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

async function abrirEditorComoProfesor() {
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Profesor' }));
  render(
    <MemoryRouter initialEntries={['/profesor/rutinas']}>
      <Aplicacion />
    </MemoryRouter>,
  );
  return userEvent.setup();
}

async function agregarBloqueCon(usuario: ReturnType<typeof userEvent.setup>, nombre: string) {
  await usuario.click(await screen.findByRole('button', { name: 'Agregar bloque' }));
  const bloque = screen.getByRole('group', { name: 'Bloque 1' });
  await usuario.selectOptions(
    within(bloque).getByLabelText('Ejercicio'),
    await within(bloque).findByRole('option', { name: nombre }),
  );
  return bloque;
}

afterEach(() => localStorage.clear());

describe('RN-PLAN-01 · la rutina tiene al menos un bloque y su tipo se deriva', () => {
  it('sin bloques, "Guardar rutina" no envía y muestra "Agregá al menos un bloque"', async () => {
    const envios = prepararRed();
    const usuario = await abrirEditorComoProfesor();

    await usuario.click(await screen.findByRole('button', { name: 'Guardar rutina' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Agregá al menos un bloque');
    expect(envios).toHaveLength(0);
  });

  it('con un bloque muestra "Tipo de rutina: Bloques"', async () => {
    prepararRed();
    const usuario = await abrirEditorComoProfesor();

    await usuario.click(await screen.findByRole('button', { name: 'Agregar bloque' }));

    expect(screen.getByText('Tipo de rutina: Bloques')).toBeInTheDocument();
  });
});

describe('RN-PLAN-04 · según el tipo del ejercicio se pide repeticiones o tiempo, nunca los dos', () => {
  it('lever chest press (por repeticiones) pide "Repeticiones" y no "Tiempo (s)"', async () => {
    prepararRed();
    const usuario = await abrirEditorComoProfesor();

    const bloque = await agregarBloqueCon(usuario, 'lever chest press');

    expect(within(bloque).getByLabelText('Repeticiones')).toBeInTheDocument();
    expect(within(bloque).queryByLabelText('Tiempo (s)')).not.toBeInTheDocument();
  });

  it('weighted front plank (por tiempo) pide "Tiempo (s)" y no "Repeticiones"', async () => {
    prepararRed();
    const usuario = await abrirEditorComoProfesor();

    const bloque = await agregarBloqueCon(usuario, 'weighted front plank');

    expect(within(bloque).getByLabelText('Tiempo (s)')).toBeInTheDocument();
    expect(within(bloque).queryByLabelText('Repeticiones')).not.toBeInTheDocument();
  });
});

describe('RN-PLAN-05 · el peso solo aparece si el tipo de carga incluye Peso Extra', () => {
  it('lever chest press (Peso Extra) muestra "Peso (kg)" y 3/4 sit-up (Peso Corporal) no', async () => {
    prepararRed();
    const usuario = await abrirEditorComoProfesor();

    const bloque = await agregarBloqueCon(usuario, 'lever chest press');
    const conPress = within(bloque).queryByLabelText('Peso (kg)') !== null;
    await usuario.selectOptions(
      within(bloque).getByLabelText('Ejercicio'),
      within(bloque).getByRole('option', { name: '3/4 sit-up' }),
    );

    expect([conPress, within(bloque).queryByLabelText('Peso (kg)') !== null]).toEqual([
      true,
      false,
    ]);
  });
});

describe('RN-PLAN-02 · un bloque tiene al menos una serie', () => {
  it('con 0 series no envía y muestra "Mínimo 1 serie"', async () => {
    const envios = prepararRed();
    const usuario = await abrirEditorComoProfesor();

    const bloque = await agregarBloqueCon(usuario, 'lever chest press');
    await usuario.type(within(bloque).getByLabelText('Series'), '0');
    await usuario.type(within(bloque).getByLabelText('Repeticiones'), '10');
    await usuario.type(within(bloque).getByLabelText('Micropausa (s)'), '60');
    await usuario.type(within(bloque).getByLabelText('Macropausa (s)'), '120');
    await usuario.click(screen.getByRole('button', { name: 'Guardar rutina' }));

    expect(await within(bloque).findByText('Mínimo 1 serie')).toBeInTheDocument();
    expect(envios).toHaveLength(0);
  });
});

describe('RN-PLAN-01, 02, 04, 05 · el profesor guarda una rutina por bloques', () => {
  it('lever chest press con 3 series, 10 repeticiones, 40 kg, 60 s y 120 s envía ese body y muestra "Rutina creada"', async () => {
    const envios = prepararRed(() =>
      HttpResponse.json(
        {
          id: 'r1',
          tipo: 'Bloques',
          bloques: [
            {
              ejercicioId: 'e-press',
              series: 3,
              micropausaSegundos: 60,
              macropausaSegundos: 120,
              repeticiones: 10,
              segundos: null,
              pesoKg: 40,
            },
          ],
        },
        { status: 201 },
      ),
    );
    const usuario = await abrirEditorComoProfesor();

    const bloque = await agregarBloqueCon(usuario, 'lever chest press');
    await usuario.type(within(bloque).getByLabelText('Series'), '3');
    await usuario.type(within(bloque).getByLabelText('Repeticiones'), '10');
    await usuario.type(within(bloque).getByLabelText('Peso (kg)'), '40');
    await usuario.type(within(bloque).getByLabelText('Micropausa (s)'), '60');
    await usuario.type(within(bloque).getByLabelText('Macropausa (s)'), '120');
    await usuario.click(screen.getByRole('button', { name: 'Guardar rutina' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Rutina creada');
    expect(envios).toEqual([
      {
        bloques: [
          {
            ejercicioId: 'e-press',
            series: 3,
            micropausaSegundos: 60,
            macropausaSegundos: 120,
            repeticiones: 10,
            pesoKg: 40,
          },
        ],
      },
    ]);
  });
});

describe('RN-PLAN-06 · los ejercicios de la rutina tienen que existir en el catálogo', () => {
  it('si el back responde 404 RN-PLAN-06, muestra su mensaje en el alert', async () => {
    prepararRed(() =>
      HttpResponse.json(
        { codigo: 'RN-PLAN-06', mensaje: 'El ejercicio e-press no existe en el catálogo' },
        { status: 404 },
      ),
    );
    const usuario = await abrirEditorComoProfesor();

    const bloque = await agregarBloqueCon(usuario, 'lever chest press');
    await usuario.type(within(bloque).getByLabelText('Series'), '3');
    await usuario.type(within(bloque).getByLabelText('Repeticiones'), '10');
    await usuario.type(within(bloque).getByLabelText('Micropausa (s)'), '60');
    await usuario.type(within(bloque).getByLabelText('Macropausa (s)'), '120');
    await usuario.click(screen.getByRole('button', { name: 'Guardar rutina' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'El ejercicio e-press no existe en el catálogo',
    );
  });
});
