import { expect, test } from '@playwright/test';
import { ApiPrueba, hoyUtc } from '../soporte/api.ts';
import { ingresar, irAlMenu } from '../soporte/sesion.ts';

// T15 · el profesor crea un plan por la pantalla y el alumno ve la rutina de hoy.
// Usa profesor03 y alumno13 (Matías Acosta): ningún otro e2e los vincula.

const PROFESOR = 'profesor03@cwgym.test';
const ALUMNO = 'alumno13@cwgym.test';
const NOMBRE_RUTINA = 'Rutina e2e plan';

function sumarDias(fecha: string, dias: number): string {
  const resultado = new Date(`${fecha}T00:00:00Z`);
  resultado.setUTCDate(resultado.getUTCDate() + dias);
  return resultado.toISOString().slice(0, 10);
}

test.describe('RN-PLAN-11, 13, 15 · el profesor crea un plan de hoy y el alumno ve la rutina del día', () => {
  test.beforeAll(async () => {
    const api = await ApiPrueba.crear();
    await api.vincular(PROFESOR, ALUMNO);
    await api.crearRutinaPress(PROFESOR, NOMBRE_RUTINA);
    await api.cerrar();
  });

  test('plan con inicio hoy, rutina en el día 1 y alumno13', async ({ browser }) => {
    const hoy = hoyUtc();
    const pantallaProfesor = await (await browser.newContext()).newPage();
    await ingresar(pantallaProfesor, PROFESOR);
    await irAlMenu(pantallaProfesor, 'Planes');
    await pantallaProfesor.getByRole('button', { name: 'Nuevo plan' }).click();

    await pantallaProfesor.getByLabel('Fecha de inicio').fill(hoy);
    // El nombre accesible del select incluye sus opciones: se distingue "día 1" de "día 10".
    await pantallaProfesor
      .getByRole('combobox', { name: /^Rutina del día 1(?!\d)/ })
      .selectOption({ label: NOMBRE_RUTINA });
    await pantallaProfesor.getByLabel('Acosta, Matías').check();
    await pantallaProfesor.getByRole('button', { name: 'Crear plan' }).click();

    await expect(pantallaProfesor.getByRole('status')).toHaveText(
      `Plan creado del ${hoy} al ${sumarDias(hoy, 27)}`,
    );

    const pantallaAlumno = await (await browser.newContext()).newPage();
    await ingresar(pantallaAlumno, ALUMNO);
    await irAlMenu(pantallaAlumno, 'Mi rutina del día');
    await expect(pantallaAlumno.getByText(NOMBRE_RUTINA)).toBeVisible();
  });
});
