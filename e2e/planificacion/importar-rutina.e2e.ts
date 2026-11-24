import { expect, test } from '@playwright/test';

const EMAIL = process.env.E2E_EMAIL_PROFESOR ?? 'profesor01@cwgym.test';
const CONTRASENIA = process.env.E2E_CONTRASENIA_PROFESOR ?? 'clave-de-semilla';

test.describe('RN-PLAN-08, 21 · importar una rutina como copia', () => {
  test('el profesor copia una rutina independiente y la selecciona para un plan', async ({
    page,
  }) => {
    await page.goto('/ingreso');
    await page.getByLabel('Email').fill(EMAIL);
    await page.getByLabel('Contraseña').fill(CONTRASENIA);
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await page.getByRole('link', { name: 'Rutinas', exact: true }).click();
    await page.getByRole('link', { name: 'Nueva rutina' }).click();
    await page.getByRole('button', { name: 'Agregar bloque' }).click();

    const bloque = page.getByRole('group', { name: 'Bloque 1' });
    await bloque.getByLabel('Ejercicio').selectOption({ label: 'lever chest press' });
    await bloque.getByLabel('Series').fill('3');
    await bloque.getByLabel('Repeticiones').fill('10');
    await bloque.getByLabel('Micropausa (s)').fill('60');
    await bloque.getByLabel('Macropausa (s)').fill('120');
    const creacion = page.waitForResponse(
      (respuesta) =>
        respuesta.url().endsWith('/planificacion/rutinas') &&
        respuesta.request().method() === 'POST',
    );
    await page.getByRole('button', { name: 'Guardar rutina' }).click();
    const respuestaOriginal = await creacion;
    expect(respuestaOriginal.status()).toBe(201);
    const original = (await respuestaOriginal.json()) as {
      id: string;
      nombre: string;
      bloques: unknown[];
    };
    await expect(page.getByRole('status')).toHaveText('Rutina creada (tipo Bloques)');

    await page.getByRole('link', { name: 'Volver a rutinas' }).click();
    const tarjeta = page.getByRole('listitem').filter({
      has: page.getByRole('heading', { name: original.nombre, exact: true }),
    });
    const importacion = page.waitForResponse(
      (respuesta) =>
        respuesta.url().endsWith(`/planificacion/rutinas/${original.id}/importacion`) &&
        respuesta.request().method() === 'POST',
    );
    await tarjeta.getByRole('button', { name: 'Importar como copia' }).click();
    const respuestaCopia = await importacion;
    expect(respuestaCopia.status()).toBe(201);
    const copia = (await respuestaCopia.json()) as {
      id: string;
      nombre: string;
      bloques: unknown[];
    };
    expect(copia.id).not.toBe(original.id);
    expect(copia.nombre).toBe(`${original.nombre} - Copia`);
    expect(copia.bloques).toEqual(original.bloques);
    await expect(page.getByRole('status')).toHaveText(`Se creó la rutina ${copia.nombre}`);
    await expect(page.getByRole('heading', { name: copia.nombre, exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: original.nombre, exact: true })).toBeVisible();

    await page.getByRole('link', { name: 'Planes', exact: true }).click();
    // Desde T13, "Planes" abre el listado y el formulario está en "Nuevo plan".
    await page.getByRole('button', { name: 'Nuevo plan' }).click();
    // El nombre accesible del select incluye sus opciones: se distingue "día 1" de "día 10".
    const dia = page.getByRole('combobox', { name: /^Rutina del día 1(?!\d)/ });
    await dia.selectOption(copia.id);
    await expect(dia).toHaveValue(copia.id);
    await expect(dia.locator('option:checked')).toHaveText(copia.nombre);
  });
});
