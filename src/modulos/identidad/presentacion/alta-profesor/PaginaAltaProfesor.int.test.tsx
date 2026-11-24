import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const URL_ALTA_PROFESOR = 'http://localhost:3000/identidad/profesores';

function renderizarComoAdmin(ruta: string) {
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Admin' }));
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Aplicacion />
    </MemoryRouter>,
  );
}

async function completarFormulario(
  usuario: ReturnType<typeof userEvent.setup>,
  { legajo = 'P-001' }: { legajo?: string } = {},
) {
  await usuario.type(screen.getByLabelText('Nombre'), 'Laura');
  await usuario.type(screen.getByLabelText('Apellido'), 'Gómez');
  await usuario.type(screen.getByLabelText('Número de documento'), '30111222');
  if (legajo !== '') await usuario.type(screen.getByLabelText('Legajo'), legajo);
  await usuario.type(screen.getByLabelText('Email'), 'laura@cwgym.test');
  await usuario.type(screen.getByLabelText('Contraseña inicial'), 'Inicial123');
}

afterEach(() => localStorage.clear());

describe('RN-IDE-04 · el legajo de profesor es único', () => {
  it('con los 7 campos completos envía el alta con ese body y muestra "Profesor P-001 dado de alta"', async () => {
    let cuerpo: unknown;
    servidorRedFalsa.use(
      http.post(URL_ALTA_PROFESOR, async ({ request }) => {
        cuerpo = await request.json();
        return HttpResponse.json({ id: 'p1', legajo: 'P-001' }, { status: 201 });
      }),
    );
    const usuario = userEvent.setup();
    renderizarComoAdmin('/admin/profesores');

    await completarFormulario(usuario);
    await usuario.click(screen.getByRole('button', { name: 'Dar de alta' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Profesor P-001 dado de alta');
    expect(cuerpo).toEqual({
      nombre: 'Laura',
      apellido: 'Gómez',
      tipoDocumento: 'DNI',
      numeroDocumento: '30111222',
      legajo: 'P-001',
      email: 'laura@cwgym.test',
      contrasenia: 'Inicial123',
    });
    expect(screen.getByLabelText('Legajo')).toHaveValue('');
  });

  it('con el legajo P-001 ya usado, muestra el mensaje del back en el alert y el campo Legajo conserva "P-001"', async () => {
    servidorRedFalsa.use(
      http.post(URL_ALTA_PROFESOR, () =>
        HttpResponse.json(
          { codigo: 'RN-IDE-04', mensaje: 'Ya existe un profesor con el legajo P-001' },
          { status: 409 },
        ),
      ),
    );
    const usuario = userEvent.setup();
    renderizarComoAdmin('/admin/profesores');

    await completarFormulario(usuario);
    await usuario.click(screen.getByRole('button', { name: 'Dar de alta' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Ya existe un profesor con el legajo P-001',
    );
    expect(screen.getByLabelText('Legajo')).toHaveValue('P-001');
  });
});

describe('RN-IDE-06 · el documento de una persona es único', () => {
  it('con un documento ya usado, muestra el mensaje del back en el alert y el campo Legajo conserva "P-001"', async () => {
    servidorRedFalsa.use(
      http.post(URL_ALTA_PROFESOR, () =>
        HttpResponse.json(
          { codigo: 'RN-IDE-06', mensaje: 'Ya existe una persona con el documento DNI 30111222' },
          { status: 409 },
        ),
      ),
    );
    const usuario = userEvent.setup();
    renderizarComoAdmin('/admin/profesores');

    await completarFormulario(usuario);
    await usuario.click(screen.getByRole('button', { name: 'Dar de alta' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Ya existe una persona con el documento DNI 30111222',
    );
    expect(screen.getByLabelText('Legajo')).toHaveValue('P-001');
  });
});

describe('RN-IDE-13 · el email de un usuario es único', () => {
  it('con un email ya usado, muestra el mensaje del back en el alert y el campo Legajo conserva "P-001"', async () => {
    servidorRedFalsa.use(
      http.post(URL_ALTA_PROFESOR, () =>
        HttpResponse.json(
          { codigo: 'RN-IDE-13', mensaje: 'Ya existe un usuario con el email laura@cwgym.test' },
          { status: 409 },
        ),
      ),
    );
    const usuario = userEvent.setup();
    renderizarComoAdmin('/admin/profesores');

    await completarFormulario(usuario);
    await usuario.click(screen.getByRole('button', { name: 'Dar de alta' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Ya existe un usuario con el email laura@cwgym.test',
    );
    expect(screen.getByLabelText('Legajo')).toHaveValue('P-001');
  });
});

describe('RN-IDE-04 · el legajo es obligatorio en el front', () => {
  it('con Legajo vacío no envía nada y marca el campo con "Completá este campo"', async () => {
    let llamadas = 0;
    servidorRedFalsa.use(
      http.post(URL_ALTA_PROFESOR, () => {
        llamadas += 1;
        return HttpResponse.json({ id: 'p1', legajo: 'P-001' }, { status: 201 });
      }),
    );
    const usuario = userEvent.setup();
    renderizarComoAdmin('/admin/profesores');

    await completarFormulario(usuario, { legajo: '' });
    await usuario.click(screen.getByRole('button', { name: 'Dar de alta' }));

    expect(await screen.findByText('Completá este campo')).toBeInTheDocument();
    expect(screen.getByLabelText('Legajo')).toHaveAttribute('aria-invalid', 'true');
    expect(llamadas).toBe(0);
  });

  it('con Legajo de solo espacios ("   ") no envía nada y marca el campo con "Completá este campo"', async () => {
    let llamadas = 0;
    servidorRedFalsa.use(
      http.post(URL_ALTA_PROFESOR, () => {
        llamadas += 1;
        return HttpResponse.json({ id: 'p1', legajo: 'P-001' }, { status: 201 });
      }),
    );
    const usuario = userEvent.setup();
    renderizarComoAdmin('/admin/profesores');

    await completarFormulario(usuario, { legajo: '   ' });
    await usuario.click(screen.getByRole('button', { name: 'Dar de alta' }));

    expect(await screen.findByText('Completá este campo')).toBeInTheDocument();
    expect(screen.getByLabelText('Legajo')).toHaveAttribute('aria-invalid', 'true');
    expect(llamadas).toBe(0);
  });
});
