import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

const base = 'http://localhost:3000';
const URL_PERCEPCION = `${base}/entrenamiento/entrenamientos/ent-1/percepcion`;
const entrenamientoFinalizado = {
  id: 'ent-1',
  inicio: '2026-11-22T10:00:00.000Z',
  fin: '2026-11-22T10:30:00.000Z',
  rutina: { nombre: 'Fuerza', bloques: [] },
  resumen: { volumenKg: 540, duracionSegundos: 1800, gruposMusculares: ['Espalda'] },
};

function abrirFinalizado(percepcion?: { rpe: number; sensacionFuerza: number }) {
  localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Alumno' }));
  servidorRedFalsa.use(
    http.get(`${base}/entrenamiento/mi-entrenamiento-en-curso`, () =>
      HttpResponse.json({
        estado: 'finalizado',
        entrenamiento: { ...entrenamientoFinalizado, ...(percepcion && { percepcion }) },
      }),
    ),
  );
  render(
    <MemoryRouter initialEntries={['/alumno/entrenamiento']}>
      <Aplicacion />
    </MemoryRouter>,
  );
}

afterEach(() => localStorage.clear());

describe('RN-ENT-16 · la percepción se carga una sola vez en el resumen', () => {
  it('guarda la percepción: muestra el texto y el formulario desaparece', async () => {
    const cuerpos: unknown[] = [];
    servidorRedFalsa.use(
      http.post(URL_PERCEPCION, async ({ request }) => {
        cuerpos.push(await request.json());
        return HttpResponse.json({ rpe: 9, sensacionFuerza: 2 }, { status: 201 });
      }),
    );
    abrirFinalizado();
    const usuario = userEvent.setup();
    await usuario.type(await screen.findByLabelText('RPE (1 a 10)'), '9');
    await usuario.type(screen.getByLabelText('Sensación de fuerza (1 a 5)'), '2');
    await usuario.click(screen.getByRole('button', { name: 'Guardar percepción' }));

    expect(await screen.findByText('RPE: 9 · Sensación de fuerza: 2')).toBeVisible();
    expect(cuerpos).toEqual([{ rpe: 9, sensacionFuerza: 2 }]);
    expect(screen.queryByRole('button', { name: 'Guardar percepción' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText('RPE (1 a 10)')).not.toBeInTheDocument();
  });

  it('ya cargada: solo el texto, sin botón para guardar', async () => {
    abrirFinalizado({ rpe: 9, sensacionFuerza: 2 });
    expect(await screen.findByText('RPE: 9 · Sensación de fuerza: 2')).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Guardar percepción' })).not.toBeInTheDocument();
  });

  it('error del back (409 RN-ENT-16): muestra su mensaje en un alert', async () => {
    servidorRedFalsa.use(
      http.post(URL_PERCEPCION, () =>
        HttpResponse.json(
          { codigo: 'RN-ENT-16', mensaje: 'La percepción ya fue cargada' },
          { status: 409 },
        ),
      ),
    );
    abrirFinalizado();
    const usuario = userEvent.setup();
    await usuario.type(await screen.findByLabelText('RPE (1 a 10)'), '9');
    await usuario.type(screen.getByLabelText('Sensación de fuerza (1 a 5)'), '2');
    await usuario.click(screen.getByRole('button', { name: 'Guardar percepción' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('La percepción ya fue cargada');
  });
});

describe('RN-ENT-14, 15 · el RPE es de 1 a 10 y la sensación de fuerza de 1 a 5', () => {
  it('valida antes de enviar y no hace ningún POST', async () => {
    let posts = 0;
    servidorRedFalsa.use(
      http.post(URL_PERCEPCION, () => {
        posts += 1;
        return HttpResponse.json({ rpe: 1, sensacionFuerza: 1 }, { status: 201 });
      }),
    );
    abrirFinalizado();
    const usuario = userEvent.setup();
    const rpe = await screen.findByLabelText('RPE (1 a 10)');
    const fuerza = screen.getByLabelText('Sensación de fuerza (1 a 5)');
    const guardar = screen.getByRole('button', { name: 'Guardar percepción' });
    const mensajeRpe = 'El RPE es un entero de 1 a 10';
    const mensajeFuerza = 'La sensación de fuerza es un entero de 1 a 5';

    // RPE 11 con sensación 3: error solo en el RPE.
    await usuario.type(rpe, '11');
    await usuario.type(fuerza, '3');
    await usuario.click(guardar);
    expect(await screen.findByText(mensajeRpe)).toBeVisible();
    expect(screen.queryByText(mensajeFuerza)).not.toBeInTheDocument();
    expect(rpe).toHaveAttribute('aria-invalid', 'true');
    expect(rpe).toHaveAccessibleDescription(mensajeRpe);

    // RPE 5 con sensación 0: error solo en la sensación de fuerza.
    await usuario.clear(rpe);
    await usuario.type(rpe, '5');
    await usuario.clear(fuerza);
    await usuario.type(fuerza, '0');
    await usuario.click(guardar);
    expect(await screen.findByText(mensajeFuerza)).toBeVisible();
    expect(screen.queryByText(mensajeRpe)).not.toBeInTheDocument();
    expect(fuerza).toHaveAttribute('aria-invalid', 'true');
    expect(fuerza).toHaveAccessibleDescription(mensajeFuerza);

    // Los dos vacíos: los dos mensajes.
    await usuario.clear(rpe);
    await usuario.clear(fuerza);
    await usuario.click(guardar);
    expect(await screen.findByText(mensajeRpe)).toBeVisible();
    expect(screen.getByText(mensajeFuerza)).toBeVisible();

    expect(posts).toBe(0);
  });
});
