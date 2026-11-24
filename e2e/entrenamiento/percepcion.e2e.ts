import { expect, request, test } from '@playwright/test';
import { ApiPrueba, URL_API } from '../soporte/api.ts';
import { ingresar, irAlMenu } from '../soporte/sesion.ts';

// US17 · el alumno carga la percepción del entrenamiento y el profesor recibe el aviso.
// Usa profesor03 y alumno17.

const PROFESOR = 'profesor03@cwgym.test';
const ALUMNO = 'alumno17@cwgym.test';

test.describe('RN-ENT-16 · RN-NOT-06 · la percepción se guarda una vez y una percepción mala avisa al profesor', () => {
  test.beforeAll(async () => {
    const api = await ApiPrueba.crear();
    const alumnoId = await api.vincular(PROFESOR, ALUMNO);
    const rutinaId = await api.crearRutinaPress(PROFESOR, 'Rutina e2e percepción');
    await api.crearPlanDeHoy(PROFESOR, rutinaId, [alumnoId]);
    const entrenamientoId = await api.iniciarEntrenamiento(ALUMNO);
    for (const numero of [1, 2]) {
      await api.registrarSerie(ALUMNO, entrenamientoId, {
        orden: 1,
        numero,
        repeticiones: 10,
        pesoKg: 30,
      });
    }
    const token = await api.token(ALUMNO);
    await api.cerrar();

    const http = await request.newContext({ baseURL: URL_API });
    const respuesta = await http.post(
      `/entrenamiento/entrenamientos/${entrenamientoId}/finalizacion`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    expect(respuesta.ok(), `finalizar: ${await respuesta.text()}`).toBe(true);
    await http.dispose();
  });

  test('el alumno carga RPE 10 y fuerza 1, y el profesor ve una notificación Grave por percepción mala', async ({
    page,
    browser,
  }) => {
    await ingresar(page, ALUMNO);
    await irAlMenu(page, 'Mi rutina del día');
    await page.getByRole('link', { name: 'Ver resumen del entrenamiento' }).click();
    const formulario = page.getByRole('form', { name: 'Percepción del entrenamiento' });
    await formulario.getByLabel('RPE (1 a 10)').fill('10');
    await formulario.getByLabel('Sensación de fuerza (1 a 5)').fill('1');
    await formulario.getByRole('button', { name: 'Guardar percepción' }).click();
    await expect(page.getByText('RPE: 10 · Sensación de fuerza: 1')).toBeVisible();

    const contextoProfesor = await browser.newContext();
    const paginaProfesor = await contextoProfesor.newPage();
    await ingresar(paginaProfesor, PROFESOR);
    const menu = paginaProfesor.getByRole('navigation', { name: 'Menú principal' });
    await expect(menu.getByRole('link', { name: 'Notificaciones (1)' })).toBeVisible();
    await irAlMenu(paginaProfesor, 'Notificaciones (1)');
    await expect(paginaProfesor.getByText('Grave')).toBeVisible();
    await expect(paginaProfesor.getByText('Percepción mala')).toBeVisible();
    await contextoProfesor.close();
  });
});
