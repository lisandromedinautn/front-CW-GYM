import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../Aplicacion.tsx';

function renderizarEn(ruta: string) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Aplicacion />
    </MemoryRouter>,
  );
}

afterEach(() => localStorage.clear());

describe('RN-IDE-03 · las rutas de cada rol están protegidas', () => {
  it('sin sesión, la ruta /admin lleva a la pantalla de ingreso', async () => {
    renderizarEn('/admin');

    expect(await screen.findByRole('heading', { name: 'Ingresar al sistema' })).toBeInTheDocument();
  });

  it('con sesión de Profesor, la ruta /admin muestra que no tiene acceso', async () => {
    localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Profesor' }));
    renderizarEn('/admin');

    expect(await screen.findByText('No tenés acceso a esta sección')).toBeInTheDocument();
  });
});
