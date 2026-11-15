import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, type JsonBodyType } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const URL_ALUMNOS = 'http://localhost:3000/identidad/alumnos';
const URL_RUTINAS = 'http://localhost:3000/planificacion/rutinas';
const URL_PLANES = 'http://localhost:3000/planificacion/planes';

// Forma de GET /identidad/alumnos (back: listar-alumnos-del-profesor.caso-uso.ts).
const ALUMNOS = [
  { id: 'a1', nombre: 'Martín', apellido: 'Pérez' },
  { id: 'a2', nombre: 'Sofía', apellido: 'López' },
];

// Forma de GET /planificacion/rutinas (back: planificacion.controlador.ts).
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

const PLAN_CREADO = {
  id: 'p1',
  fechaInicio: '2026-11-13',
  fechaFin: '2026-12-10',
  dias: [],
  alumnoIds: ['a1'],
};

type Opciones = {
  /** Respuesta de GET /identidad/alumnos. Por defecto, dos alumnos vinculados. */
  alumnos?: () => JsonBodyType;
  /** Respuesta de GET /planificacion/rutinas. Por defecto, una rutina. */
  rutinas?: () => JsonBodyType;
  /** Respuesta de POST /planificacion/planes. Por defecto, 201 con el plan creado. */
  alCrear?: () => Response;
};

/** Declara la red falsa y guarda el body de cada POST a /planificacion/planes. */
function prepararRed(opciones: Opciones = {}) {
  const envios: unknown[] = [];
  servidorRedFalsa.use(
    http.get(URL_ALUMNOS, () => HttpResponse.json(opciones.alumnos?.() ?? ALUMNOS)),
    http.get(URL_RUTINAS, () => HttpResponse.json(opciones.rutinas?.() ?? LISTADO_RUTINAS)),
    http.post(URL_PLANES, async ({ request }) => {
      envios.push(await request.json());
      if (opciones.alCrear) return opciones.alCrear();
      return HttpResponse.json(PLAN_CREADO, { status: 201 });
    }),
  );
  return { envios };
}

function abrirPaginaComoProfesor() {
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Profesor' }));
  render(
    <MemoryRouter initialEntries={['/profesor/planes']}>
      <Aplicacion />
    </MemoryRouter>,
  );
  return userEvent.setup();
}

function elegirFecha(fecha: string) {
  fireEvent.change(screen.getByLabelText('Fecha de inicio'), { target: { value: fecha } });
}

afterEach(() => localStorage.clear());

describe('RN-PLAN-09 · al elegir la fecha de inicio se muestra la fecha de fin calculada', () => {
  it('con inicio 13/11/2026 muestra 10/12/2026 y los 28 días con su fecha', async () => {
    prepararRed();
    abrirPaginaComoProfesor();

    elegirFecha('2026-11-13');

    expect(await screen.findByText('Fecha de fin: 2026-12-10')).toBeInTheDocument();
    expect(screen.getAllByRole('combobox')).toHaveLength(28);
    expect(screen.getByText('Día 1 — viernes 13/11')).toBeInTheDocument();
    expect(screen.getByText('Día 28 — jueves 10/12')).toBeInTheDocument();
  });
});

describe('US07 · el profesor crea el plan con una rutina o descanso por día', () => {
  it('envía los 28 días: la rutina elegida en el día 1 y descanso en el resto', async () => {
    const { envios } = prepararRed();
    const usuario = abrirPaginaComoProfesor();

    elegirFecha('2026-11-13');
    await usuario.click(await screen.findByRole('checkbox', { name: 'Pérez, Martín' }));
    await usuario.selectOptions(screen.getByRole('combobox', { name: 'Rutina del día 1' }), 'r1');
    await usuario.click(screen.getByRole('button', { name: 'Crear plan' }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Plan creado del 2026-11-13 al 2026-12-10',
    );
    expect(envios).toEqual([
      {
        fechaInicio: '2026-11-13',
        dias: Array.from({ length: 28 }, (_, indice) => ({
          numero: indice + 1,
          rutinaId: indice === 0 ? 'r1' : null,
        })),
        alumnos: ['a1'],
      },
    ]);
  });
});

describe('RN-PLAN-12 · el plan se crea con al menos un alumno', () => {
  it('sin alumno avisa "Elegí al menos un alumno" y no envía nada', async () => {
    const { envios } = prepararRed();
    const usuario = abrirPaginaComoProfesor();

    await screen.findByRole('checkbox', { name: 'Pérez, Martín' });
    await usuario.click(screen.getByRole('button', { name: 'Crear plan' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Elegí al menos un alumno');
    expect(envios).toHaveLength(0);
  });
});

describe('RN-PLAN-14 · si el alumno ya tiene un plan vigente, se muestra el error del back', () => {
  it('con 409 RN-PLAN-14 muestra su mensaje', async () => {
    prepararRed({
      alCrear: () =>
        HttpResponse.json(
          { codigo: 'RN-PLAN-14', mensaje: 'El alumno ya tiene un plan vigente' },
          { status: 409 },
        ),
    });
    const usuario = abrirPaginaComoProfesor();

    await usuario.click(await screen.findByRole('checkbox', { name: 'Pérez, Martín' }));
    await usuario.click(screen.getByRole('button', { name: 'Crear plan' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'El alumno ya tiene un plan vigente',
    );
  });
});

describe('RN-PLAN-13 · solo se ofrecen alumnos vinculados al profesor', () => {
  it('sin alumnos vinculados muestra "No tenés alumnos vinculados todavía."', async () => {
    prepararRed({ alumnos: () => [] });
    abrirPaginaComoProfesor();

    expect(await screen.findByText('No tenés alumnos vinculados todavía.')).toBeInTheDocument();
  });
});
