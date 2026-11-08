import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../Aplicacion.tsx';

function renderizarConSesion(rol: 'Admin' | 'Profesor' | 'Alumno', ruta: string) {
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol }));
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Aplicacion />
    </MemoryRouter>,
  );
}

async function menuPrincipal() {
  return screen.findByRole('navigation', { name: 'Menú principal' });
}

afterEach(() => localStorage.clear());

describe('RN-UI-IDE-01 · el menú muestra solo las opciones del rol de la sesión', () => {
  it('Admin ve "Profesores" y "Ejercicios", y no ve "Mi código" ni "Vincularme con mi profesor"', async () => {
    renderizarConSesion('Admin', '/admin');
    const menu = await menuPrincipal();

    expect(within(menu).getByRole('link', { name: 'Profesores' })).toBeInTheDocument();
    expect(within(menu).getByRole('link', { name: 'Ejercicios' })).toBeInTheDocument();
    expect(within(menu).queryByRole('link', { name: 'Mi código' })).not.toBeInTheDocument();
    expect(
      within(menu).queryByRole('link', { name: 'Vincularme con mi profesor' }),
    ).not.toBeInTheDocument();
  });

  it('Profesor ve "Mi código" y "Ejercicios", y no ve "Profesores"', async () => {
    renderizarConSesion('Profesor', '/profesor');
    const menu = await menuPrincipal();

    expect(within(menu).getByRole('link', { name: 'Mi código' })).toBeInTheDocument();
    expect(within(menu).getByRole('link', { name: 'Ejercicios' })).toBeInTheDocument();
    expect(within(menu).queryByRole('link', { name: 'Profesores' })).not.toBeInTheDocument();
  });

  it('Alumno ve "Vincularme con mi profesor", y no ve "Profesores" ni "Mi código"', async () => {
    renderizarConSesion('Alumno', '/alumno');
    const menu = await menuPrincipal();

    expect(
      within(menu).getByRole('link', { name: 'Vincularme con mi profesor' }),
    ).toBeInTheDocument();
    expect(within(menu).queryByRole('link', { name: 'Profesores' })).not.toBeInTheDocument();
    expect(within(menu).queryByRole('link', { name: 'Mi código' })).not.toBeInTheDocument();
  });
});
