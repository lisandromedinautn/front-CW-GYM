import { expect, test } from '@playwright/test';
import { ApiPrueba } from '../soporte/api.ts';
import { ingresar, irAlMenu } from '../soporte/sesion.ts';

// T15 · el profesor ve lo que su alumno registró. Usa profesor03 y alumno15 (Santiago Medina).

const PROFESOR = 'profesor03@cwgym.test';
const ALUMNO = 'alumno15@cwgym.test';

test.describe('RN-ENT-18, RN-UI-ENT-04 · el profesor consulta los entrenamientos de su alumno', () => {
  test.beforeAll(async () => {
    const api = await ApiPrueba.crear();
    const alumnoId = await api.vincular(PROFESOR, ALUMNO);
    const rutinaId = await api.crearRutinaPress(PROFESOR, 'Rutina e2e seguimiento');
    await api.crearPlanDeHoy(PROFESOR, rutinaId, [alumnoId]);
    const entrenamientoId = await api.iniciarEntrenamiento(ALUMNO);
    await api.registrarSerie(ALUMNO, entrenamientoId, {
      orden: 1,
      numero: 1,
      repeticiones: 10,
      pesoKg: 30,
    });
    await api.cerrar();
  });

  test('la tarjeta muestra En curso y 1 de 2 series', async ({ page }) => {
    await ingresar(page, PROFESOR);
    await irAlMenu(page, 'Entrenamientos');
    await page.getByLabel('Alumno').selectOption({ label: 'Medina, Santiago' });

    await expect(page.getByRole('heading', { name: /En curso/ })).toBeVisible();
    await expect(page.getByText('Series registradas: 1 de 2')).toBeVisible();
  });
});
