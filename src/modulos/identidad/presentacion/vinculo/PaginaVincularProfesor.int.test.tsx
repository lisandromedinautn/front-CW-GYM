import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const URL_VINCULO = 'http://localhost:3000/identidad/alumnos/vinculo';

function renderizarComoAlumno() {
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Alumno' }));
  return render(
    <MemoryRouter initialEntries={['/alumno/vinculo']}>
      <Aplicacion />
    </MemoryRouter>,
  );
}

afterEach(() => localStorage.clear());

describe('RN-IDE-09 · el alumno se vincula con su profesor usando el código', () => {
  it('con un código válido envía { codigo } y muestra "Quedaste vinculado con Laura Gómez"', async () => {
    let cuerpo: unknown;
    servidorRedFalsa.use(
      http.post(URL_VINCULO, async ({ request }) => {
        cuerpo = await request.json();
        return HttpResponse.json(
          { profesor: { nombre: 'Laura', apellido: 'Gómez' } },
          { status: 200 },
        );
      }),
    );
    const usuario = userEvent.setup();
    renderizarComoAlumno();

    await usuario.type(screen.getByLabelText('Código de profesor'), 'ABC234');
    await usuario.click(screen.getByRole('button', { name: 'Vincularme' }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Quedaste vinculado con Laura Gómez',
    );
    expect(cuerpo).toEqual({ codigo: 'ABC234' });
  });
});

describe('RN-IDE-11 · el código de profesor debe ser válido', () => {
  it('con un código inválido muestra el mensaje del back en el alert y el campo sigue visible', async () => {
    servidorRedFalsa.use(
      http.post(URL_VINCULO, () =>
        HttpResponse.json(
          { codigo: 'RN-IDE-11', mensaje: 'El código de profesor no es válido' },
          { status: 400 },
        ),
      ),
    );
    const usuario = userEvent.setup();
    renderizarComoAlumno();

    await usuario.type(screen.getByLabelText('Código de profesor'), 'ZZZ999');
    await usuario.click(screen.getByRole('button', { name: 'Vincularme' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'El código de profesor no es válido',
    );
    expect(screen.getByLabelText('Código de profesor')).toBeInTheDocument();
  });
});

describe('RN-IDE-10 · el alumno no puede tener más de un profesor', () => {
  it('si ya está vinculado, muestra el mensaje del back y el formulario desaparece', async () => {
    servidorRedFalsa.use(
      http.post(URL_VINCULO, () =>
        HttpResponse.json(
          {
            codigo: 'RN-IDE-10',
            mensaje: 'Ya estás vinculado con un profesor: no podés vincularte con otro',
          },
          { status: 409 },
        ),
      ),
    );
    const usuario = userEvent.setup();
    renderizarComoAlumno();

    await usuario.type(screen.getByLabelText('Código de profesor'), 'ABC234');
    await usuario.click(screen.getByRole('button', { name: 'Vincularme' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Ya estás vinculado con un profesor: no podés vincularte con otro',
    );
    expect(screen.queryByLabelText('Código de profesor')).not.toBeInTheDocument();
  });
});
