import { fireEvent, render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const URL_API = 'http://localhost:3000';
const entrenamiento = {
  id: 'ent-1',
  inicio: '2026-11-20T23:59:00.000Z',
  rutina: { nombre: 'Fuerza' },
};
const rutinaDelDia = {
  estado: 'rutina',
  fecha: '2026-11-21',
  numeroDia: 2,
  rutina: { id: 'r1', nombre: 'Fuerza', tipo: 'Bloques', bloques: [], circuitos: [] },
};

function abrir(ruta: string) {
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Alumno' }));
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Aplicacion />
    </MemoryRouter>,
  );
}

function prepararRed(
  estado: 'en-curso' | 'abandonado' | 'sin-entrenamiento',
  rutina: { estado: string; fecha: string; numeroDia?: number } = rutinaDelDia,
) {
  servidorRedFalsa.use(
    http.get(`${URL_API}/planificacion/mi-rutina-del-dia`, () => HttpResponse.json(rutina)),
    http.get(`${URL_API}/entrenamiento/mi-entrenamiento-en-curso`, () =>
      HttpResponse.json(estado === 'sin-entrenamiento' ? { estado } : { estado, entrenamiento }),
    ),
    http.post(`${URL_API}/entrenamiento/entrenamientos`, () => {
      estado = 'en-curso';
      return HttpResponse.json(entrenamiento, { status: 201 });
    }),
  );
}

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('RN-ENT-01, RN-ENT-02 y RN-UI-ENT-02 · iniciar y retomar un entrenamiento', () => {
  it('inicia desde la rutina de hoy y, al recargar, usa la hora original del servidor', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(Date.parse('2026-11-20T23:59:42.000Z'));
    prepararRed('sin-entrenamiento', { ...rutinaDelDia, fecha: '2026-11-20' });
    const rutina = abrir('/alumno/rutina-del-dia');
    fireEvent.click(await screen.findByRole('button', { name: 'Iniciar entrenamiento' }));
    expect(await screen.findByRole('timer')).toHaveTextContent('00:00:42');

    rutina.unmount();
    abrir('/alumno/entrenamiento');
    expect(await screen.findByRole('timer')).toHaveTextContent('00:00:42');
    expect(screen.getByText('Fuerza')).toBeInTheDocument();
  });

  it('muestra el anterior como abandonado sin contador y no bloquea el inicio de hoy', async () => {
    prepararRed('abandonado');
    const rutina = abrir('/alumno/rutina-del-dia');
    expect(await screen.findByRole('button', { name: 'Iniciar entrenamiento' })).toBeEnabled();
    rutina.unmount();
    abrir('/alumno/entrenamiento');
    expect(await screen.findByText('Abandonado')).toBeInTheDocument();
    expect(screen.queryByRole('timer')).not.toBeInTheDocument();
  });

  it('ofrece retomar en lugar de volver a iniciar si ya empezó hoy', async () => {
    prepararRed('en-curso', { ...rutinaDelDia, fecha: '2026-11-20' });
    abrir('/alumno/rutina-del-dia');
    expect(await screen.findByRole('link', { name: 'Retomar entrenamiento' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Iniciar entrenamiento' })).not.toBeInTheDocument();
  });

  it.each(['descanso', 'sin-plan'])(
    'no ofrece iniciar cuando el día está en %s',
    async (estado) => {
      prepararRed('sin-entrenamiento', { estado, fecha: '2026-11-21', numeroDia: 2 });
      abrir('/alumno/rutina-del-dia');
      await screen.findByText(
        estado === 'descanso' ? 'Hoy es día de descanso.' : 'No tenés un plan vigente.',
      );
      expect(
        screen.queryByRole('button', { name: 'Iniciar entrenamiento' }),
      ).not.toBeInTheDocument();
    },
  );
});
