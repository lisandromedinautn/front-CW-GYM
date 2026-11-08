import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const URL_CODIGO = 'http://localhost:3000/identidad/profesores/codigo';

function renderizarComoProfesor() {
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Profesor' }));
  return render(
    <MemoryRouter initialEntries={['/profesor/codigo']}>
      <Aplicacion />
    </MemoryRouter>,
  );
}

afterEach(() => localStorage.clear());

describe('RN-IDE-08 · el profesor genera y regenera su código de alta de alumnos', () => {
  it('sin código, muestra "Todavía no generaste tu código" y "Generar código" lo genera sin abrir dialog', async () => {
    servidorRedFalsa.use(
      http.get(URL_CODIGO, () => HttpResponse.json({ codigo: null })),
      http.post(URL_CODIGO, () => HttpResponse.json({ codigo: 'ABC234' }, { status: 201 })),
    );
    const usuario = userEvent.setup();
    renderizarComoProfesor();

    expect(await screen.findByText('Todavía no generaste tu código')).toBeInTheDocument();
    await usuario.click(screen.getByRole('button', { name: 'Generar código' }));

    expect(await screen.findByText('ABC234')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('con código existente, muestra el código y el botón "Regenerar código"', async () => {
    servidorRedFalsa.use(http.get(URL_CODIGO, () => HttpResponse.json({ codigo: 'ABC234' })));
    renderizarComoProfesor();

    expect(await screen.findByText('ABC234')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Regenerar código' })).toBeInTheDocument();
  });

  it('"Regenerar" en el dialog llama al POST y muestra el código nuevo', async () => {
    let llamadas = 0;
    servidorRedFalsa.use(
      http.get(URL_CODIGO, () => HttpResponse.json({ codigo: 'ABC234' })),
      http.post(URL_CODIGO, () => {
        llamadas += 1;
        return HttpResponse.json({ codigo: 'XYZ789' }, { status: 201 });
      }),
    );
    const usuario = userEvent.setup();
    renderizarComoProfesor();
    await screen.findByText('ABC234');

    await usuario.click(screen.getByRole('button', { name: 'Regenerar código' }));
    const dialog = await screen.findByRole('dialog', { name: 'Regenerar código' });
    expect(within(dialog).getByText('El código anterior deja de funcionar')).toBeInTheDocument();
    await usuario.click(within(dialog).getByRole('button', { name: 'Regenerar' }));

    expect(await screen.findByText('XYZ789')).toBeInTheDocument();
    expect(llamadas).toBe(1);
  });

  it('"Cancelar" en el dialog cierra sin llamar al POST', async () => {
    let llamadas = 0;
    servidorRedFalsa.use(
      http.get(URL_CODIGO, () => HttpResponse.json({ codigo: 'ABC234' })),
      http.post(URL_CODIGO, () => {
        llamadas += 1;
        return HttpResponse.json({ codigo: 'XYZ789' }, { status: 201 });
      }),
    );
    const usuario = userEvent.setup();
    renderizarComoProfesor();
    await screen.findByText('ABC234');

    await usuario.click(screen.getByRole('button', { name: 'Regenerar código' }));
    const dialog = await screen.findByRole('dialog', { name: 'Regenerar código' });
    await usuario.click(within(dialog).getByRole('button', { name: 'Cancelar' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(llamadas).toBe(0);
    expect(screen.getByText('ABC234')).toBeInTheDocument();
  });

  it('"Copiar" deja el código en el portapapeles y muestra "Código copiado"', async () => {
    servidorRedFalsa.use(http.get(URL_CODIGO, () => HttpResponse.json({ codigo: 'ABC234' })));
    const usuario = userEvent.setup();
    renderizarComoProfesor();
    await screen.findByText('ABC234');

    await usuario.click(screen.getByRole('button', { name: 'Copiar' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Código copiado');
    expect(await navigator.clipboard.readText()).toBe('ABC234');
  });
});
