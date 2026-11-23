import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const URL_API = 'http://localhost:3000';
const GIF_PLANCHA = 'https://gifs.test/plancha.gif';

const plancha = {
  ejercicioId: 'plancha',
  nombre: 'weighted front plank',
  repeticiones: null,
  segundos: 30,
  pesoKg: null,
};
const press = { ejercicioId: 'press', nombre: 'lever chest press', pesoKg: null, segundos: null };

// Rutina "Fuerza" del e2e de US14 en el back: circuito orden 1 y bloque orden 2. Son 7 pasos:
// vuelta 1 (plancha, press), vuelta 2 (plancha, press) y las series 1 a 3 del bloque.
function rutina(gifPlancha: string | null) {
  return {
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
          { ...plancha, ...(gifPlancha && { urlGif: gifPlancha }) },
          { ...press, repeticiones: 8 },
        ],
      },
    ],
  };
}

function registrada(orden: number, numero: number, posicion: number | null, valor: number) {
  const esPlancha = posicion === 1;
  return {
    orden,
    numero,
    posicion,
    ejercicioId: esPlancha ? 'plancha' : 'press',
    nombre: esPlancha ? plancha.nombre : press.nombre,
    prescripta: {
      repeticiones: esPlancha ? null : 10,
      segundos: esPlancha ? 30 : null,
      pesoKg: orden === 2 ? 30 : null,
    },
    realizada: {
      repeticiones: esPlancha ? null : valor,
      segundos: esPlancha ? valor : null,
      pesoKg: orden === 2 ? 30 : null,
    },
  };
}

const serieTresRegistrada = registrada(2, 3, null, 8);
const pasosUnoASeis = [
  registrada(1, 1, 1, 25),
  registrada(1, 1, 2, 8),
  registrada(1, 2, 1, 30),
  registrada(1, 2, 2, 8),
  registrada(2, 1, null, 10),
  registrada(2, 2, null, 10),
];

function abrir(
  estado: 'en-curso' | 'abandonado',
  series: unknown[] = [],
  gifPlancha: string | null = GIF_PLANCHA,
) {
  const entrenamiento = {
    id: 'ent-1',
    alumnoId: 'a1',
    inicio: '2026-11-20T23:59:00.000Z',
    pesoCorporalKg: 80,
    rutina: rutina(gifPlancha),
    series,
  };
  servidorRedFalsa.use(
    http.get(`${URL_API}/entrenamiento/mi-entrenamiento-en-curso`, () =>
      HttpResponse.json({ estado, entrenamiento }),
    ),
  );
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Alumno' }));
  render(
    <MemoryRouter initialEntries={['/alumno/entrenamiento']}>
      <Aplicacion />
    </MemoryRouter>,
  );
}

/** Responde como el back: 201 con la serie, lo prescripto de la copia y lo realizado. */
function aceptarSeries() {
  const enviados: Record<string, number>[] = [];
  servidorRedFalsa.use(
    http.post(`${URL_API}/entrenamiento/entrenamientos/ent-1/series`, async ({ request }) => {
      const cuerpo = (await request.json()) as Record<string, number>;
      enviados.push(cuerpo);
      const serie = registrada(
        cuerpo.orden,
        cuerpo.numero,
        cuerpo.posicion ?? null,
        cuerpo.repeticiones ?? cuerpo.segundos,
      );
      return HttpResponse.json(serie, { status: 201 });
    }),
  );
  return enviados;
}

async function completar(campo: string, valor: string) {
  const usuario = userEvent.setup();
  const entrada = screen.getByLabelText(campo);
  await usuario.clear(entrada);
  if (valor) await usuario.type(entrada, valor);
  return usuario;
}

const paso = (texto: string) => screen.findByText(texto);
const titulo = (nombre: string) => screen.findByRole('heading', { name: nombre });
const boton = (nombre: string) => screen.getByRole('button', { name: nombre });

afterEach(() => {
  localStorage.clear();
});

describe('RN-UI-ENT-03 · un paso por vez, con el contador siempre visible', () => {
  it('sin series registradas abre en el paso 1 de 7: la vuelta 1 de la plancha, 30 s', async () => {
    abrir('en-curso');
    expect(await paso('Paso 1 de 7')).toBeVisible();
    expect(await titulo('Vuelta 1 · weighted front plank')).toBeVisible();
    expect(screen.getByText('Prescripto: 30 s')).toBeVisible();
    expect(screen.getByRole('timer')).toBeVisible();
    expect(screen.getAllByText(/^Prescripto:/)).toHaveLength(1);
  });

  it('Siguiente pasa al paso 2 sin enviar nada', async () => {
    const enviados = aceptarSeries();
    abrir('en-curso');
    await paso('Paso 1 de 7');
    await userEvent.setup().click(boton('Siguiente'));

    expect(await paso('Paso 2 de 7')).toBeVisible();
    expect(enviados).toEqual([]);
  });

  it('el paso 1 muestra el GIF de la plancha con su atribución', async () => {
    abrir('en-curso');
    const gif = await screen.findByRole('img', { name: 'weighted front plank' });
    expect(gif).toHaveAttribute('src', GIF_PLANCHA);
    expect(screen.getByText('GIF © Gym visual')).toBeVisible();
  });

  it('un entrenamiento iniciado sin GIF en la copia no muestra imagen', async () => {
    abrir('en-curso', [], null);
    await paso('Paso 1 de 7');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});

describe('RN-ENT-03, RN-UI-ENT-01 y RN-UI-ENT-03 · registrar avanza al paso siguiente', () => {
  it('paso 1 con 25 s: envía la vuelta 1, posición 1, y pasa al press de la vuelta 1', async () => {
    const enviados = aceptarSeries();
    abrir('en-curso');
    await paso('Paso 1 de 7');
    const usuario = await completar('Segundos', '25');
    await usuario.click(boton('Registrar'));

    expect(await paso('Paso 2 de 7')).toBeVisible();
    expect(await titulo('Vuelta 1 · lever chest press')).toBeVisible();
    expect(screen.getByText('Prescripto: 8 repeticiones')).toBeVisible();
    expect(enviados).toEqual([{ orden: 1, numero: 1, posicion: 1, segundos: 25 }]);
  });

  it('con los pasos 1 a 6 registrados retoma en la serie 3 y la registra con 8 repeticiones y 30 kg', async () => {
    const enviados = aceptarSeries();
    abrir('en-curso', pasosUnoASeis);
    expect(await paso('Paso 7 de 7')).toBeVisible();
    expect(await titulo('Serie 3 · lever chest press')).toBeVisible();
    expect(screen.getByText('Prescripto: 10 repeticiones · 30 kg')).toBeVisible();
    const usuario = await completar('Repeticiones', '8');
    await usuario.click(boton('Registrar'));

    expect(await screen.findByText('Registrada: 8 repeticiones · 30 kg')).toBeVisible();
    expect(enviados).toEqual([{ orden: 2, numero: 3, repeticiones: 8, pesoKg: 30 }]);
  });

  it('Anterior vuelve al paso 1 registrado con 25 s y corregirlo a 20 s lo reemplaza', async () => {
    const enviados = aceptarSeries();
    abrir('en-curso', [registrada(1, 1, 1, 25)]);
    await paso('Paso 2 de 7');
    await userEvent.setup().click(boton('Anterior'));
    expect(await paso('Paso 1 de 7')).toBeVisible();
    expect(screen.getByText('Registrada: 25 s')).toBeVisible();
    const usuario = await completar('Segundos', '20');
    await usuario.click(boton('Registrar'));

    expect(await paso('Paso 2 de 7')).toBeVisible();
    expect(enviados).toEqual([{ orden: 1, numero: 1, posicion: 1, segundos: 20 }]);
  });

  it('con los segundos vacíos no envía nada, marca el campo y se queda en el paso 1', async () => {
    const enviados = aceptarSeries();
    abrir('en-curso');
    await paso('Paso 1 de 7');
    const usuario = await completar('Segundos', '');
    await usuario.click(boton('Registrar'));

    const segundos = screen.getByLabelText('Segundos');
    expect(segundos).toHaveAttribute('aria-invalid', 'true');
    expect(segundos).toHaveAccessibleDescription('Ingresá un número entero de 0 o más.');
    expect(screen.getByText('Paso 1 de 7')).toBeVisible();
    expect(enviados).toEqual([]);
  });
});

describe('RN-ENT-20 · un entrenamiento abandonado no admite series', () => {
  it('muestra la rutina y la serie registrada, sin ningún botón Registrar', async () => {
    abrir('abandonado', [serieTresRegistrada]);
    const serieTres = await screen.findByRole('group', { name: 'Serie 3 de lever chest press' });
    expect(serieTres).toHaveTextContent('Registrada: 8 repeticiones · 30 kg');
    expect(within(serieTres).queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryAllByRole('button', { name: 'Registrar' })).toHaveLength(0);
  });

  it('si al registrar el back responde 409 RN-ENT-20, muestra su mensaje y deja de ofrecer registrar', async () => {
    servidorRedFalsa.use(
      http.post(`${URL_API}/entrenamiento/entrenamientos/ent-1/series`, () =>
        HttpResponse.json(
          { codigo: 'RN-ENT-20', mensaje: 'El entrenamiento quedó abandonado' },
          { status: 409 },
        ),
      ),
    );
    abrir('en-curso');
    await paso('Paso 1 de 7');
    await userEvent.setup().click(boton('Registrar'));

    expect(await screen.findByRole('alert')).toHaveTextContent('El entrenamiento quedó abandonado');
    expect(screen.queryAllByRole('button', { name: 'Registrar' })).toHaveLength(0);
  });
});
