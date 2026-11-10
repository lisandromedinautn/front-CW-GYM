import { expect, test } from '@playwright/test';

// Flujo completo contra el back real (docs/TESTING.md). Necesita el back levantado con el
// catálogo y la semilla de usuarios cargados (`yarn seed`). Por defecto usa las credenciales
// de la semilla de test del back (back-CW-GYM/.env.test); se pueden cambiar por variables.
const EMAIL = process.env.E2E_EMAIL_PROFESOR ?? 'profesor01@cwgym.test';
const CONTRASENIA = process.env.E2E_CONTRASENIA_PROFESOR ?? 'clave-de-semilla';

test.describe('RN-PLAN-01, 06 · el profesor arma y guarda una rutina por bloques', () => {
  test('lever chest press con 3 series de 10 repeticiones se guarda como rutina de Bloques', async ({
    page,
  }) => {
    await page.goto('/ingreso');
    await page.getByLabel('Email').fill(EMAIL);
    await page.getByLabel('Contraseña').fill(CONTRASENIA);
    await page.getByRole('button', { name: 'Ingresar' }).click();

    await page
      .getByRole('navigation', { name: 'Menú principal' })
      .getByRole('link', { name: 'Rutinas' })
      .click();
    await page.getByRole('button', { name: 'Agregar bloque' }).click();

    const bloque = page.getByRole('group', { name: 'Bloque 1' });
    await bloque.getByLabel('Ejercicio').selectOption({ label: 'lever chest press' });
    await bloque.getByLabel('Series').fill('3');
    await bloque.getByLabel('Repeticiones').fill('10');
    await bloque.getByLabel('Micropausa (s)').fill('60');
    await bloque.getByLabel('Macropausa (s)').fill('120');
    await page.getByRole('button', { name: 'Guardar rutina' }).click();

    await expect(page.getByRole('status')).toHaveText('Rutina creada (tipo Bloques)');
  });
});
