import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const URL_API = 'http://localhost:3000';

// Rutina "Fuerza" del e2e de US14 en el back: circuito orden 1 y bloque orden 2.
const rutina = {
  id: 'r1',
  nombre: 'Fuerza',
  tipo: 'Mixta',
  bloques: [
    {
      ejercicioId: 'press',
      nombre: 'lever chest press',
      repeticiones: 10,
      segundos: null,
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
        {
          ejercicioId: 'press',
          nombre: 'lever chest press',
          repeticiones: 8,
          segundos: null,
          pesoKg: null,
        },
      ],
    },
  ],
};

const serieTresRegistrada = {
  orden: 2,
  numero: 3,
  posicion: null,
  ejercicioId: 'press',
  nombre: 'lever chest press',
  prescripta: { repeticiones: 10, segundos: null, pesoKg: 30 },
  realizada: { repeticiones: 8, segundos: null, pesoKg: 30 },
};

function entrenamiento(series: unknown[] = []) {
  return {
    id: 'ent-1',
    alumnoId: 'a1',
    inicio: '2026-11-20T23:59:00.000Z',
    pesoCorporalKg: 80,
    rutina,
    series,
  };
}

function abrir(estado: 'en-curso' | 'abandonado', series: unknown[] = []) {
  servidorRedFalsa.use(
    http.get(`${URL_API}/entrenamiento/mi-entrenamiento-en-curso`, () =>
      HttpResponse.json({ estado, entrenamiento: entrenamiento(series) }),
    ),
  );
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Alumno' }));
  render(
    <MemoryRouter initialEntries={['/alumno/entrenamiento']}>
      <Aplicacion />
    </MemoryRouter>,
  );
}

const fila = (nombre: string) => screen.findByRole('group', { name: nombre });

afterEach(() => {
  localStorage.clear();
});

describe('RN-ENT-03 · cada serie muestra lo prescripto al lado de lo realizado', () => {
  it('la serie 3 del bloque muestra 10 repeticiones · 30 kg y la vuelta 2 de la plancha 30 s', async () => {
    abrir('en-curso');
    expect(await fila('Serie 3 de lever chest press')).toHaveTextContent(
      'Prescripto: 10 repeticiones · 30 kg',
    );
    expect(await fila('Vuelta 2 de weighted front plank')).toHaveTextContent('Prescripto: 30 s');
  });
});

describe('RN-UI-ENT-02 · al retomar se ven las series ya registradas', () => {
  it('la serie 3 del bloque registrada con 8 repeticiones y 30 kg se muestra como registrada', async () => {
    abrir('en-curso', [serieTresRegistrada]);
    expect(await fila('Serie 3 de lever chest press')).toHaveTextContent(
      'Registrada: 8 repeticiones · 30 kg',
    );
  });
});

/** Responde como el back: 201 con la serie, lo prescripto de la copia y lo realizado. */
function aceptarSeries() {
  const enviados: Record<string, number>[] = [];
  servidorRedFalsa.use(
    http.post(`${URL_API}/entrenamiento/entrenamientos/ent-1/series`, async ({ request }) => {
      const cuerpo = (await request.json()) as Record<string, number>;
      enviados.push(cuerpo);
      return HttpResponse.json(
        {
          ...serieTresRegistrada,
          orden: cuerpo.orden,
          numero: cuerpo.numero,
          posicion: cuerpo.posicion ?? null,
          realizada: {
            repeticiones: cuerpo.repeticiones ?? null,
            segundos: cuerpo.segundos ?? null,
            pesoKg: cuerpo.pesoKg ?? null,
          },
        },
        { status: 201 },
      );
    }),
  );
  return enviados;
}

async function completar(serie: HTMLElement, campo: string, valor: string) {
  const usuario = userEvent.setup();
  const entrada = within(serie).getByLabelText(campo);
  await usuario.clear(entrada);
  if (valor) await usuario.type(entrada, valor);
  return usuario;
}

describe('RN-ENT-03 y RN-UI-ENT-01 · registrar una serie en la misma pantalla y con un clic', () => {
  it('serie 3 del bloque con 8 repeticiones y 30 kg: envía la serie y la muestra registrada', async () => {
    const enviados = aceptarSeries();
    abrir('en-curso');
    const serieTres = await fila('Serie 3 de lever chest press');
    const usuario = await completar(serieTres, 'Repeticiones', '8');
    await usuario.click(within(serieTres).getByRole('button', { name: 'Registrar' }));

    expect(await within(serieTres).findByText('Registrada: 8 repeticiones · 30 kg')).toBeVisible();
    expect(enviados).toEqual([{ orden: 2, numero: 3, repeticiones: 8, pesoKg: 30 }]);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('vuelta 2 de la plancha con 25 segundos: envía orden 1, número 2 y posición 1', async () => {
    const enviados = aceptarSeries();
    abrir('en-curso');
    const plancha = await fila('Vuelta 2 de weighted front plank');
    const usuario = await completar(plancha, 'Segundos', '25');
    await usuario.click(within(plancha).getByRole('button', { name: 'Registrar' }));

    expect(await within(plancha).findByText('Registrada: 25 s')).toBeVisible();
    expect(enviados).toEqual([{ orden: 1, numero: 2, posicion: 1, segundos: 25 }]);
  });

  it('corregir la serie 3 ya registrada con 9 repeticiones la reemplaza', async () => {
    const enviados = aceptarSeries();
    abrir('en-curso', [serieTresRegistrada]);
    const serieTres = await fila('Serie 3 de lever chest press');
    const usuario = await completar(serieTres, 'Repeticiones', '9');
    await usuario.click(within(serieTres).getByRole('button', { name: 'Registrar' }));

    expect(await within(serieTres).findByText('Registrada: 9 repeticiones · 30 kg')).toBeVisible();
    expect(enviados).toEqual([{ orden: 2, numero: 3, repeticiones: 9, pesoKg: 30 }]);
  });

  it('con las repeticiones vacías no envía nada y marca el campo', async () => {
    const enviados = aceptarSeries();
    abrir('en-curso');
    const serieUno = await fila('Serie 1 de lever chest press');
    const usuario = await completar(serieUno, 'Repeticiones', '');
    await usuario.click(within(serieUno).getByRole('button', { name: 'Registrar' }));

    const repeticiones = within(serieUno).getByLabelText('Repeticiones');
    expect(repeticiones).toHaveAttribute('aria-invalid', 'true');
    expect(repeticiones).toHaveAccessibleDescription('Ingresá un número entero de 0 o más.');
    expect(enviados).toEqual([]);
  });
});

describe('RN-ENT-20 · un entrenamiento abandonado no admite series', () => {
  it('muestra la rutina y la serie registrada, sin ningún botón Registrar', async () => {
    abrir('abandonado', [serieTresRegistrada]);
    const serieTres = await fila('Serie 3 de lever chest press');
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
    const serieTres = await fila('Serie 3 de lever chest press');
    await userEvent.setup().click(within(serieTres).getByRole('button', { name: 'Registrar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('El entrenamiento quedó abandonado');
    expect(screen.queryAllByRole('button', { name: 'Registrar' })).toHaveLength(0);
  });
});
