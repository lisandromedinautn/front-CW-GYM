import { expect, test } from '@playwright/test';

// Flujo completo contra el back real (docs/TESTING.md). Mismas condiciones que crear-rutina.e2e.ts:
// back levantado con la semilla cargada; credenciales de la semilla de test por defecto.
const EMAIL = process.env.E2E_EMAIL_PROFESOR ?? 'profesor01@cwgym.test';
const CONTRASENIA = process.env.E2E_CONTRASENIA_PROFESOR ?? 'clave-de-semilla';

test.describe('RN-PLAN-01, 03 · el profesor arma y guarda una rutina por circuitos', () => {
  test('un circuito de lever chest press y weighted front plank se guarda como rutina de Circuitos', async ({
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
    await page.getByRole('button', { name: 'Agregar circuito' }).click();

    const circuito = page.getByRole('group', { name: 'Circuito 1' });
    const press = circuito.getByRole('group', { name: 'Ejercicio 1' });
    await press.getByLabel('Ejercicio').selectOption({ label: 'lever chest press' });
    await press.getByLabel('Repeticiones').fill('10');
    const plancha = circuito.getByRole('group', { name: 'Ejercicio 2' });
    await plancha.getByLabel('Ejercicio').selectOption({ label: 'weighted front plank' });
    await plancha.getByLabel('Tiempo (s)').fill('45');
    await circuito.getByLabel('Vueltas').fill('3');
    await circuito.getByLabel('Macropausa (s)').fill('90');
    await page.getByRole('button', { name: 'Guardar rutina' }).click();

    await expect(page.getByRole('status')).toHaveText('Rutina creada (tipo Circuitos)');
  });
});
