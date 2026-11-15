import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import type { Rol } from '../../../../compartido/dominio/sesion/sesion.ts';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const RUTINA = {
  estado: 'rutina',
  fecha: '2026-11-01',
  numeroDia: 1,
  rutina: {
    id: 'r1',
    nombre: 'Empuje',
    tipo: 'Mixta',
    bloques: [
      {
        ejercicioId: 'press',
        nombre: 'Press de pecho',
        series: 3,
        repeticiones: 10,
        segundos: null,
        pesoKg: 20,
        micropausaSegundos: 60,
        macropausaSegundos: 120,
      },
    ],
    circuitos: [
      {
        vueltas: 3,
        macropausaSegundos: 90,
        ejercicios: [
          {
            ejercicioId: 'sentadilla',
            nombre: 'Sentadilla',
            repeticiones: 12,
            segundos: null,
            pesoKg: null,
          },
          {
            ejercicioId: 'plancha',
            nombre: 'Plancha',
            repeticiones: null,
            segundos: 30,
            pesoKg: null,
          },
        ],
      },
    ],
  },
};

function prepararRed(respuesta = RUTINA) {
  servidorRedFalsa.use(
    http.get('http://localhost:3000/planificacion/mi-rutina-del-dia', () =>
      HttpResponse.json(respuesta),
    ),
  );
}

function abrir(rol: Rol | null = 'Alumno', ruta = '/alumno/rutina-del-dia') {
  if (rol) localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol }));
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Aplicacion />
    </MemoryRouter>,
  );
}

afterEach(() => localStorage.clear());

describe('RN-PLAN-11, 18 · la rutina del día muestra la fecha concreta del back', () => {
  it('abre desde el menú y muestra la fecha del back', async () => {
    prepararRed();
    abrir('Alumno', '/alumno');
    const usuario = userEvent.setup();

    await usuario.click(screen.getByRole('link', { name: 'Mi rutina del día' }));

    expect(await screen.findByText('2026-11-01')).toHaveAttribute('datetime', '2026-11-01');
  });
});

describe('RN-PLAN-02, 03, 18 · el alumno ve las pausas prescriptas', () => {
  it('muestra las pausas del bloque', async () => {
    prepararRed();
    abrir();

    expect(
      await screen.findByText(
        'Micropausa entre series: 60 s · Macropausa al terminar el bloque: 120 s',
      ),
    ).toBeInTheDocument();
  });

  it('muestra la pausa de cada vuelta', async () => {
    prepararRed();
    abrir();

    expect(await screen.findByText('Macropausa al terminar cada vuelta: 90 s')).toBeInTheDocument();
  });

  it('muestra también las pausas de cero segundos', async () => {
    const sinPausas = structuredClone(RUTINA);
    sinPausas.rutina.bloques[0].micropausaSegundos = 0;
    sinPausas.rutina.bloques[0].macropausaSegundos = 0;
    sinPausas.rutina.circuitos[0].macropausaSegundos = 0;
    prepararRed(sinPausas);
    abrir();

    expect(
      await screen.findByText(
        'Micropausa entre series: 0 s · Macropausa al terminar el bloque: 0 s',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Macropausa al terminar cada vuelta: 0 s')).toBeInTheDocument();
  });
});

describe('RN-IDE-03 · solo un Alumno autenticado abre su rutina del día', () => {
  it('sin sesión lleva al ingreso', async () => {
    abrir(null);

    expect(await screen.findByRole('heading', { name: 'Ingresar al sistema' })).toBeInTheDocument();
  });

  it('un profesor no puede abrir la rutina del alumno', async () => {
    abrir('Profesor');

    expect(await screen.findByText('No tenés acceso a esta sección')).toBeInTheDocument();
  });
});
