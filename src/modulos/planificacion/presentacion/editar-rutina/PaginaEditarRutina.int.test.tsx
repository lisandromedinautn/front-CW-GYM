import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

// Casos confirmados por Martina el 24/11/2026 (US06, consultar y editar).
const URL_CATALOGO = 'http://localhost:3000/catalogo/ejercicios';
const URL_RUTINAS = 'http://localhost:3000/planificacion/rutinas';
const URL_RUTINA = 'http://localhost:3000/planificacion/rutinas/:id';

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

// Forma de RutinaRespuesta del back (GET y PUT /planificacion/rutinas/:id).
const EMPUJE = {
  id: 'r1',
  nombre: 'Empuje',
  tipo: 'Bloques',
  bloques: [
    {
      orden: 1,
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
};

/** Red falsa; guarda el body de cada PUT. `alEditar` cambia la respuesta del PUT. */
function prepararRed(alEditar?: () => Response) {
  const cambios: unknown[] = [];
  servidorRedFalsa.use(
    http.get(URL_CATALOGO, () => HttpResponse.json(CATALOGO)),
    http.get(URL_RUTINAS, () =>
      HttpResponse.json({ items: [EMPUJE], total: 1, pagina: 1, tamanio: 10 }),
    ),
    http.get(URL_RUTINA, () => HttpResponse.json(EMPUJE)),
    http.put(URL_RUTINA, async ({ request }) => {
      const cuerpo = (await request.json()) as { nombre?: string };
      cambios.push(cuerpo);
      return alEditar ? alEditar() : HttpResponse.json({ ...EMPUJE, nombre: cuerpo.nombre });
    }),
  );
  return cambios;
}

/** Entra al listado como Profesor y abre el detalle de "Empuje" con el lápiz de su tarjeta. */
async function abrirDetalleDeEmpuje() {
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Profesor' }));
  render(
    <MemoryRouter initialEntries={['/profesor/rutinas']}>
      <Aplicacion />
    </MemoryRouter>,
  );
  const usuario = userEvent.setup();
  await usuario.click(await screen.findByRole('link', { name: 'Editar rutina' }));
  return usuario;
}

afterEach(() => localStorage.clear());

describe('RN-PLAN-08 · el profesor ve el detalle de su rutina', () => {
  it('la tarjeta abre el editor con el nombre, el ejercicio, las series, las repeticiones y las pausas', async () => {
    prepararRed();
    await abrirDetalleDeEmpuje();

    const bloque = await screen.findByRole('group', { name: 'Bloque 1' });
    // El campo depende del tipo del ejercicio: aparece cuando llega el catálogo.
    await within(bloque).findByLabelText('Repeticiones');
    expect({
      nombre: (screen.getByRole('textbox', { name: 'Nombre' }) as HTMLInputElement).value,
      ejercicio: (within(bloque).getByLabelText('Ejercicio') as HTMLSelectElement).value,
      series: (within(bloque).getByLabelText('Series') as HTMLInputElement).value,
      repeticiones: (within(bloque).getByLabelText('Repeticiones') as HTMLInputElement).value,
      micropausa: (within(bloque).getByLabelText('Micropausa (s)') as HTMLInputElement).value,
      macropausa: (within(bloque).getByLabelText('Macropausa (s)') as HTMLInputElement).value,
    }).toEqual({
      nombre: 'Empuje',
      ejercicio: 'e-press',
      series: '3',
      repeticiones: '10',
      micropausa: '60',
      macropausa: '120',
    });
  });
});

describe('RN-PLAN-07 · una rutina se puede editar siempre', () => {
  it('cambiar las repeticiones a 12 y "Guardar cambios" envía el PUT con el contenido nuevo', async () => {
    const cambios = prepararRed();
    const usuario = await abrirDetalleDeEmpuje();

    const bloque = await screen.findByRole('group', { name: 'Bloque 1' });
    const repeticiones = await within(bloque).findByLabelText('Repeticiones');
    await usuario.clear(repeticiones);
    await usuario.type(repeticiones, '12');
    await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Cambios guardados');
    expect(cambios).toEqual([
      {
        nombre: 'Empuje',
        bloques: [
          {
            ejercicioId: 'e-press',
            series: 3,
            micropausaSegundos: 60,
            macropausaSegundos: 120,
            repeticiones: 12,
          },
        ],
      },
    ]);
  });
});

describe('RN-PLAN-21 · el nombre no repite el de otra rutina del profesor', () => {
  it('cambiar el nombre de "Empuje" a "Piernas" y "Guardar cambios" envía el PUT con el nombre y muestra "Piernas"', async () => {
    const cambios = prepararRed();
    const usuario = await abrirDetalleDeEmpuje();

    await screen.findByLabelText('Repeticiones');
    const nombre = screen.getByRole('textbox', { name: 'Nombre' });
    await usuario.clear(nombre);
    await usuario.type(nombre, 'Piernas');
    await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    expect(await screen.findByRole('heading', { name: 'Piernas' })).toBeInTheDocument();
    expect(cambios).toEqual([
      {
        nombre: 'Piernas',
        bloques: [
          {
            ejercicioId: 'e-press',
            series: 3,
            micropausaSegundos: 60,
            macropausaSegundos: 120,
            repeticiones: 10,
          },
        ],
      },
    ]);
  });

  it('si el back responde 409 RN-PLAN-21, muestra su mensaje en un alert', async () => {
    prepararRed(() =>
      HttpResponse.json(
        { codigo: 'RN-PLAN-21', mensaje: 'Ya tenés una rutina con ese nombre' },
        { status: 409 },
      ),
    );
    const usuario = await abrirDetalleDeEmpuje();

    const nombre = await screen.findByRole('textbox', { name: 'Nombre' });
    await usuario.clear(nombre);
    await usuario.type(nombre, 'Piernas');
    await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Ya tenés una rutina con ese nombre',
    );
  });
});
