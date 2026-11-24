import { expect, request, test } from '@playwright/test';
import { ApiPrueba, URL_API } from '../soporte/api.ts';
import { ingresar, irAlMenu } from '../soporte/sesion.ts';

// US21 · el profesor recibe el aviso de un entrenamiento por debajo. Usa profesor02 y alumno16.

const PROFESOR = 'profesor02@cwgym.test';
const ALUMNO = 'alumno16@cwgym.test';

test.describe('RN-NOT-01 a 04 · RN-UI-NOT-01 · el profesor ve, abre y marca como leída la notificación', () => {
  test.beforeAll(async () => {
    const api = await ApiPrueba.crear();
    const alumnoId = await api.vincular(PROFESOR, ALUMNO);
    const rutinaId = await api.crearRutinaPress(PROFESOR, 'Rutina e2e notificaciones');
    await api.crearPlanDeHoy(PROFESOR, rutinaId, [alumnoId]);
    const entrenamientoId = await api.iniciarEntrenamiento(ALUMNO);
    await api.registrarSerie(ALUMNO, entrenamientoId, {
      orden: 1,
      numero: 1,
      repeticiones: 10,
      pesoKg: 30,
    });
    const token = await api.token(ALUMNO);
    await api.cerrar();

    // Finaliza el entrenamiento con 1 de 2 series: queda por debajo (50 %, grave).
    const http = await request.newContext({ baseURL: URL_API });
    const respuesta = await http.post(
      `/entrenamiento/entrenamientos/${entrenamientoId}/finalizacion`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    expect(respuesta.ok(), `finalizar: ${await respuesta.text()}`).toBe(true);
    await http.dispose();
  });

  test('el menú cuenta 1, la bandeja muestra Grave y al marcarla el menú vuelve a Notificaciones', async ({
    page,
  }) => {
    await ingresar(page, PROFESOR);
    const menu = page.getByRole('navigation', { name: 'Menú principal' });
    await expect(menu.getByRole('link', { name: 'Notificaciones (1)' })).toBeVisible();

    await irAlMenu(page, 'Notificaciones (1)');
    await expect(page.getByText('Grave')).toBeVisible();
    await expect(page.getByText('Series por debajo: 1 de 2')).toBeVisible();

    await page.getByRole('button', { name: 'Marcar como leída' }).click();
    await expect(menu.getByRole('link', { name: 'Notificaciones', exact: true })).toBeVisible();
  });
});
