import { expect, test, type Page } from '@playwright/test';
import { ApiPrueba } from '../soporte/api.ts';
import { ingresar, irAlMenu } from '../soporte/sesion.ts';

// T15 · el alumno inicia, registra y finaliza su entrenamiento. Los tres casos dependen uno del
// otro (mismo entrenamiento), por eso van en serie y comparten la página.
// Usa profesor03 y alumno14 (Lucía Benítez).

const PROFESOR = 'profesor03@cwgym.test';
const ALUMNO = 'alumno14@cwgym.test';

test.describe.configure({ mode: 'serial' });

let page: Page;

test.beforeAll(async ({ browser }) => {
  const api = await ApiPrueba.crear();
  const alumnoId = await api.vincular(PROFESOR, ALUMNO);
  const rutinaId = await api.crearRutinaPress(PROFESOR, 'Rutina e2e entrenar');
  await api.crearPlanDeHoy(PROFESOR, rutinaId, [alumnoId]);
  await api.cerrar();
  page = await (await browser.newContext()).newPage();
});

test.afterAll(async () => {
  await page.context().close();
});

test.describe('RN-ENT-01, 02, 03, RN-UI-ENT-03 · iniciar y registrar la primera serie', () => {
  test('muestra el contador y avanza al paso 2', async () => {
    await ingresar(page, ALUMNO);
    await irAlMenu(page, 'Mi rutina del día');
    await page.getByRole('button', { name: 'Iniciar entrenamiento' }).click();

    await expect(page.getByRole('timer', { name: 'Tiempo transcurrido' })).toBeVisible();
    await page.getByRole('button', { name: 'Registrar' }).click();
    await expect(page.getByText('Paso 2 de 2')).toBeVisible();
  });
});

test.describe('RN-UI-ENT-02 · recargar retoma el entrenamiento en curso', () => {
  test('sigue en el paso 2 y el paso 1 muestra lo registrado', async () => {
    await page.reload();
    await expect(page.getByText('Paso 2 de 2')).toBeVisible();

    await page.getByRole('button', { name: 'Anterior' }).click();
    await expect(page.getByText('Registrada: 10 repeticiones · 30 kg')).toBeVisible();
  });
});

test.describe('RN-ENT-05, 06, 17 · finalizar y ver el resumen', () => {
  test('muestra el peso total levantado', async () => {
    await page.getByRole('button', { name: 'Siguiente' }).click();
    await page.getByRole('button', { name: 'Registrar' }).click();
    await page.getByRole('button', { name: 'Finalizar entrenamiento' }).click();

    await expect(page.getByRole('heading', { name: 'Resumen del entrenamiento' })).toBeVisible();
    await expect(page.getByText('Peso total levantado: 600 kg')).toBeVisible();
  });
});
