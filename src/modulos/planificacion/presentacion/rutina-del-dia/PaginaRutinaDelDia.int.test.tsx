import { render, screen } from '@testing-library/react';
import { http, HttpResponse, type JsonBodyType } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const URL_RUTINA = 'http://localhost:3000/planificacion/mi-rutina-del-dia';

// Forma de GET /planificacion/mi-rutina-del-dia (back: consultar-rutina-del-dia.caso-uso.ts).
const RUTINA_COMPLETA = {
  estado: 'rutina',
  fecha: '2026-11-13',
  numeroDia: 4,
  rutina: {
    id: 'r1',
    nombre: 'Piernas',
    tipo: 'Mixta',
    bloques: [
      {
        ejercicioId: 'e-press',
        nombre: 'lever chest press',
        series: 3,
        micropausaSegundos: 60,
        macropausaSegundos: 120,
        repeticiones: 10,
        segundos: null,
        pesoKg: 20,
      },
    ],
    circuitos: [
      {
        vueltas: 3,
        macropausaSegundos: 90,
        ejercicios: [
          {
            ejercicioId: 'e-sentadilla',
            nombre: 'sentadilla',
            repeticiones: 12,
            segundos: null,
            pesoKg: null,
          },
          {
            ejercicioId: 'e-plancha',
            nombre: 'plancha',
            repeticiones: null,
            segundos: 30,
            pesoKg: null,
          },
        ],
      },
    ],
  },
};

type Opciones = {
  /** Respuesta de GET /planificacion/mi-rutina-del-dia. Por defecto, la rutina del día 4. */
  respuesta?: () => JsonBodyType;
  /** Código HTTP de la respuesta. Por defecto, 200. */
  estadoHttp?: number;
};

function prepararRed(opciones: Opciones = {}) {
  servidorRedFalsa.use(
    http.get(URL_RUTINA, () =>
      HttpResponse.json(opciones.respuesta?.() ?? RUTINA_COMPLETA, {
        status: opciones.estadoHttp ?? 200,
      }),
    ),
  );
}

function abrirPaginaComoAlumno() {
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Alumno' }));
  render(
    <MemoryRouter initialEntries={['/alumno/rutina-del-dia']}>
      <Aplicacion />
    </MemoryRouter>,
  );
}

afterEach(() => localStorage.clear());

describe('RN-PLAN-18 · sin plan vigente se informa que no hay plan', () => {
  it('muestra "No tenés un plan vigente."', async () => {
    prepararRed({ respuesta: () => ({ estado: 'sin-plan', fecha: '2026-11-13' }) });
    abrirPaginaComoAlumno();

    expect(await screen.findByText('No tenés un plan vigente.')).toBeInTheDocument();
  });
});

describe('RN-PLAN-18 · un día de descanso se informa como descanso', () => {
  it('muestra "Hoy es día de descanso." y el día del plan', async () => {
    prepararRed({
      respuesta: () => ({ estado: 'descanso', fecha: '2026-11-14', numeroDia: 2 }),
    });
    abrirPaginaComoAlumno();

    expect(await screen.findByText('Hoy es día de descanso.')).toBeInTheDocument();
    expect(screen.getByText('Día 2 de 28')).toBeInTheDocument();
  });
});

describe('RN-PLAN-11, 18 · la rutina del día muestra el nombre y el objetivo de cada ejercicio', () => {
  it('muestra la rutina, el bloque con sus series y el circuito con sus vueltas', async () => {
    prepararRed();
    abrirPaginaComoAlumno();

    expect(await screen.findByRole('heading', { name: 'Piernas' })).toBeInTheDocument();
    expect(screen.getByText('Día 4 de 28')).toBeInTheDocument();
    expect(screen.getByText('lever chest press')).toBeInTheDocument();
    expect(screen.getByText('3 series × 10 repeticiones · 20 kg')).toBeInTheDocument();
    expect(screen.getByText('3 vueltas')).toBeInTheDocument();
    expect(screen.getByText('sentadilla')).toBeInTheDocument();
    expect(screen.getByText('12 repeticiones')).toBeInTheDocument();
    expect(screen.getByText('plancha')).toBeInTheDocument();
    expect(screen.getByText('30 segundos')).toBeInTheDocument();
  });
});

describe('US08 · si el back falla se muestra su mensaje', () => {
  it('con 500 muestra el mensaje en un alert', async () => {
    prepararRed({
      respuesta: () => ({ codigo: 'ERROR-RED', mensaje: 'No se pudo cargar la rutina del día' }),
      estadoHttp: 500,
    });
    abrirPaginaComoAlumno();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudo cargar la rutina del día',
    );
  });
});
