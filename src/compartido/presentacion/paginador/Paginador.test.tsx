import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Paginador } from './Paginador.tsx';

describe('T06 · el paginador se mueve entre páginas y elige el tamaño', () => {
  it('en la página 1, "Anterior" está deshabilitado', () => {
    render(
      <Paginador
        pagina={1}
        total={60}
        tamanio={20}
        alCambiarPagina={vi.fn()}
        alCambiarTamanio={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
  });

  it('en la última página, "Siguiente" está deshabilitado', () => {
    render(
      <Paginador
        pagina={3}
        total={60}
        tamanio={20}
        alCambiarPagina={vi.fn()}
        alCambiarTamanio={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled();
  });

  it('muestra "Página 2 de 3"', () => {
    render(
      <Paginador
        pagina={2}
        total={60}
        tamanio={20}
        alCambiarPagina={vi.fn()}
        alCambiarTamanio={vi.fn()}
      />,
    );

    expect(screen.getByText('Página 2 de 3')).toBeInTheDocument();
  });

  it('cambiar "Por página" llama alCambiarTamanio con el número', async () => {
    const alCambiarTamanio = vi.fn();
    const usuario = userEvent.setup();
    render(
      <Paginador
        pagina={1}
        total={60}
        tamanio={20}
        alCambiarPagina={vi.fn()}
        alCambiarTamanio={alCambiarTamanio}
      />,
    );

    await usuario.selectOptions(screen.getByLabelText('Por página'), '50');

    expect(alCambiarTamanio).toHaveBeenCalledWith(50);
  });
});
