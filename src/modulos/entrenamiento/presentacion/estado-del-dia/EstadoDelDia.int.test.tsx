import { render, screen, within } from '@testing-library/react';
import { http, HttpResponse, type JsonBodyType } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const URL_API = 'http://localhost:3000';
const RUTINA_HOY = {
  estado: 'rutina',
  fecha: '2026-11-21',
  numeroDia: 2,
  rutina: { id: 'r1', nombre: 'Fuerza', tipo: 'Bloques', bloques: [], circuitos: [] },
};
const ENTRENAMIENTO = {
  id: 'ent-1',
  inicio: '2026-11-21T13:00:00.000Z',
  rutina: { nombre: 'Fuerza', bloques: [] },
};

function prepararRed(
  rutinaDelDia: JsonBodyType,
  entrenamiento: JsonBodyType = { estado: 'sin-entrenamiento' },
  estadoHttp = 200,
) {
  servidorRedFalsa.use(
    http.get(`${URL_API}/planificacion/mi-rutina-del-dia`, () =>
      HttpResponse.json(rutinaDelDia, { status: estadoHttp }),
    ),
    http.get(`${URL_API}/entrenamiento/mi-entrenamiento-en-curso`, () =>
      HttpResponse.json(entrenamiento),
    ),
  );
}

function abrirInicio() {
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Alumno' }));
  render(
    <MemoryRouter initialEntries={['/alumno']}>
      <Aplicacion />
    </MemoryRouter>,
  );
}

async function seccionHoy() {
  return within(await screen.findByRole('region', { name: 'Hoy' }));
}

afterEach(() => localStorage.clear());

describe('RN-UI-ENT-06 · el inicio del Alumno muestra el estado de su entrenamiento de hoy', () => {
  it('con la rutina pendiente ofrece ver la rutina del día', async () => {
    prepararRed(RUTINA_HOY);
    abrirInicio();
    const hoy = await seccionHoy();

    expect(await hoy.findByText('Tenés un entrenamiento pendiente hoy')).toBeInTheDocument();
    expect(hoy.getByText('Fuerza')).toBeInTheDocument();
    expect(hoy.getByRole('link', { name: 'Ver mi rutina del día: Fuerza' })).toHaveAttribute(
      'href',
      '/alumno/rutina-del-dia',
    );
  });

  it('muestra la fecha de hoy que informa el back', async () => {
    prepararRed(RUTINA_HOY);
    abrirInicio();
    const hoy = await seccionHoy();

    expect(await hoy.findByText('sábado 21/11')).toBeInTheDocument();
  });

  it('un entrenamiento abandonado deja la rutina pendiente', async () => {
    prepararRed(RUTINA_HOY, { estado: 'abandonado', entrenamiento: ENTRENAMIENTO });
    abrirInicio();
    const hoy = await seccionHoy();

    expect(await hoy.findByText('Tenés un entrenamiento pendiente hoy')).toBeInTheDocument();
    expect(hoy.getByRole('link', { name: 'Ver mi rutina del día: Fuerza' })).toHaveAttribute(
      'href',
      '/alumno/rutina-del-dia',
    );
  });

  it('con un entrenamiento en curso ofrece retomarlo', async () => {
    prepararRed(RUTINA_HOY, { estado: 'en-curso', entrenamiento: ENTRENAMIENTO });
    abrirInicio();
    const hoy = await seccionHoy();

    expect(await hoy.findByRole('link', { name: 'Retomar entrenamiento: Fuerza' })).toHaveAttribute(
      'href',
      '/alumno/entrenamiento',
    );
    expect(hoy.getByText('Tenés un entrenamiento en curso')).toBeInTheDocument();
    expect(hoy.queryByText('Tenés un entrenamiento pendiente hoy')).not.toBeInTheDocument();
  });

  it('si ya entrenó hoy ofrece ver el resumen', async () => {
    prepararRed(RUTINA_HOY, { estado: 'finalizado', entrenamiento: ENTRENAMIENTO });
    abrirInicio();
    const hoy = await seccionHoy();

    expect(await hoy.findByText('Ya entrenaste hoy')).toBeInTheDocument();
    expect(
      hoy.getByRole('link', { name: 'Ver resumen del entrenamiento: Fuerza' }),
    ).toHaveAttribute('href', '/alumno/entrenamiento');
  });

  it('en un día de descanso lo dice y ofrece ver el plan', async () => {
    prepararRed({ estado: 'descanso', fecha: '2026-11-21', numeroDia: 3 });
    abrirInicio();
    const hoy = await seccionHoy();

    expect(await hoy.findByText('Hoy es día de descanso.')).toBeInTheDocument();
    expect(hoy.getByRole('link', { name: 'Ver mi plan completo' })).toHaveAttribute(
      'href',
      '/alumno/mi-plan',
    );
  });

  it('sin plan vigente lo dice, sin accesos', async () => {
    prepararRed({ estado: 'sin-plan', fecha: '2026-11-21' });
    abrirInicio();
    const hoy = await seccionHoy();

    expect(await hoy.findByText('No tenés un plan vigente.')).toBeInTheDocument();
    expect(hoy.queryByRole('link')).not.toBeInTheDocument();
  });

  it('muestra el error de la consulta', async () => {
    prepararRed({ codigo: 'ERROR-PRUEBA', mensaje: 'Falla del servidor' }, undefined, 500);
    abrirInicio();
    const hoy = await seccionHoy();

    expect(await hoy.findByRole('alert')).toHaveTextContent('Falla del servidor');
  });
});
