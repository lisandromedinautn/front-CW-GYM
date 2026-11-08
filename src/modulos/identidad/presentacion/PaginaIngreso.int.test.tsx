import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../pruebas/servidor-red-falsa.ts';

const URL_INGRESO = 'http://localhost:3000/identidad/ingreso';

function renderizarEn(ruta: string) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Aplicacion />
    </MemoryRouter>,
  );
}

afterEach(() => localStorage.clear());

describe('RN-IDE-01 · ingreso con email y contraseña', () => {
  it.each([
    { rol: 'Admin', inicio: 'Panel del Admin' },
    { rol: 'Profesor', inicio: 'Panel del Profesor' },
    { rol: 'Alumno', inicio: 'Panel del Alumno' },
  ])(
    'con credenciales válidas de un $rol guarda la sesión y lleva a "$inicio"',
    async ({ rol, inicio }) => {
      servidorRedFalsa.use(
        http.post(URL_INGRESO, () => HttpResponse.json({ token: 'tok', rol }, { status: 200 })),
      );
      const usuario = userEvent.setup();
      renderizarEn('/ingreso');

      await usuario.type(screen.getByLabelText('Email'), 'usuario@gimnasio.test');
      await usuario.type(screen.getByLabelText('Contraseña'), 'clave-de-prueba');
      await usuario.click(screen.getByRole('button', { name: 'Ingresar' }));

      expect(await screen.findByRole('heading', { name: inicio })).toBeInTheDocument();
      expect(JSON.parse(localStorage.getItem('cwgym.sesion') ?? 'null')).toEqual({
        token: 'tok',
        rol,
      });
    },
  );

  it('con credenciales inválidas muestra el mensaje genérico y se queda en el ingreso', async () => {
    servidorRedFalsa.use(
      http.post(URL_INGRESO, () =>
        HttpResponse.json(
          { codigo: 'RN-IDE-01', mensaje: 'Email o contraseña incorrectos' },
          { status: 401 },
        ),
      ),
    );
    const usuario = userEvent.setup();
    renderizarEn('/ingreso');

    await usuario.type(screen.getByLabelText('Email'), 'usuario@gimnasio.test');
    await usuario.type(screen.getByLabelText('Contraseña'), 'clave-incorrecta');
    await usuario.click(screen.getByRole('button', { name: 'Ingresar' }));

    const alerta = await screen.findByRole('alert');
    expect(alerta).toHaveTextContent('Email o contraseña incorrectos');
    expect(screen.getByRole('heading', { name: 'Ingresar al sistema' })).toBeInTheDocument();
  });
});
