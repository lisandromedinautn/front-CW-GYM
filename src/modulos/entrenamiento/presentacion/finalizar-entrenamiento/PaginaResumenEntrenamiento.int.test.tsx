import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { Aplicacion } from '../../../../Aplicacion.tsx';
import { servidorRedFalsa } from '../../../../pruebas/servidor-red-falsa.ts';

describe('RN-ENT-05, 06, 09, 17 · finalizar y ver el resumen', () => {
  it('finaliza una sesión sin series y muestra duración y resultado vacío', async () => {
    servidorRedFalsa.use(
      http.get('http://localhost:3000/entrenamiento/mi-entrenamiento-en-curso', () =>
        HttpResponse.json({
          estado: 'en-curso',
          entrenamiento: {
            id: 'ent-1',
            inicio: '2026-11-22T10:00:00.000Z',
            // Un bloque de una serie: el único paso es el último, donde está «Finalizar».
            rutina: {
              nombre: 'Fuerza',
              bloques: [
                {
                  ejercicioId: 'press',
                  nombre: 'lever chest press',
                  repeticiones: 10,
                  segundos: null,
                  pesoKg: null,
                  orden: 1,
                  series: 1,
                  micropausaSegundos: 0,
                  macropausaSegundos: 0,
                },
              ],
            },
          },
        }),
      ),
      http.post('http://localhost:3000/entrenamiento/entrenamientos/ent-1/finalizacion', () =>
        HttpResponse.json(
          { volumenKg: 0, duracionSegundos: 1800, gruposMusculares: [] },
          { status: 201 },
        ),
      ),
    );
    localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Alumno' }));
    render(
      <MemoryRouter initialEntries={['/alumno/entrenamiento']}>
        <Aplicacion />
      </MemoryRouter>,
    );
    await userEvent.click(await screen.findByRole('button', { name: 'Finalizar entrenamiento' }));
    expect(await screen.findByRole('heading', { name: 'Resumen del entrenamiento' })).toBeVisible();
    expect(screen.getByText(/0 kg/)).toBeVisible();
    expect(screen.getByText(/30 min/)).toBeVisible();
    expect(screen.getByText(/Sin grupos musculares/)).toBeVisible();
  });
  it('muestra los récords personales devueltos al finalizar', async () => {
    servidorRedFalsa.use(
      http.get('http://localhost:3000/entrenamiento/mi-entrenamiento-en-curso', () =>
        HttpResponse.json({
          estado: 'en-curso',
          entrenamiento: {
            id: 'ent-1',
            inicio: '2026-11-22T10:00:00.000Z',
            rutina: { nombre: 'Ejercicios de prueba US12' },
          },
        }),
      ),
      http.post('http://localhost:3000/entrenamiento/entrenamientos/ent-1/finalizacion', () =>
        HttpResponse.json(
          {
            volumenKg: 2730,
            duracionSegundos: 49,
            gruposMusculares: ['Core', 'Espalda', 'Piernas'],
            recordsBatidos: [
              {
                ejercicioId: 'f3a1734b-2daf-4576-80f9-f168a0a75690',
                nombre: 'kettlebell hang clean',
                tipo: 'repeticiones',
                valorAnterior: 12,
                valorNuevo: 13,
              },
            ],
          },
          { status: 201 },
        ),
      ),
    );

    localStorage.setItem('cwgym.sesion', JSON.stringify({ token: 't', rol: 'Alumno' }));

    render(
      <MemoryRouter initialEntries={['/alumno/entrenamiento']}>
        <Aplicacion />
      </MemoryRouter>,
    );

    await userEvent.click(await screen.findByRole('button', { name: 'Finalizar entrenamiento' }));

    expect(
      await screen.findByRole('heading', { name: '¡Nuevos récords personales!' }),
    ).toBeVisible();
    expect(screen.getByText('kettlebell hang clean')).toBeVisible();
    expect(screen.getByText(/Repeticiones: 12 → 13/)).toBeVisible();
  });
});
