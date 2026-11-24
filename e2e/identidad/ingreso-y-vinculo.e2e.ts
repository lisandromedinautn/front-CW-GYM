import { expect, test } from '@playwright/test';
import { ingresar, irAlMenu } from '../soporte/sesion.ts';

// T15 · flujo de ingreso y vínculo contra el front y el back de test reales (base recién sembrada).
// Usa profesor01, profesor02, alumno11 y alumno12: ningún otro e2e los vincula.

test.describe('RN-IDE-01 · ingreso con credenciales inválidas', () => {
  test('muestra el mensaje genérico y se queda en el ingreso', async ({ page }) => {
    await ingresar(page, 'profesor01@cwgym.test', 'contrasenia-incorrecta');

    await expect(page.getByRole('alert')).toHaveText('Email o contraseña incorrectos');
    await expect(page.getByRole('heading', { name: 'Ingresar al sistema' })).toBeVisible();
  });
});

test.describe('RN-IDE-08, 09, 10 · el alumno se vincula con el código de su profesor', () => {
  test('vincula con un código válido y rechaza un segundo vínculo', async ({ browser }) => {
    const pantallaProfesor = await (await browser.newContext()).newPage();
    await ingresar(pantallaProfesor, 'profesor02@cwgym.test');
    await irAlMenu(pantallaProfesor, 'Mi código');
    await pantallaProfesor.getByRole('button', { name: 'Generar código' }).click();
    const codigo = (
      await pantallaProfesor.getByText(/^[A-HJ-NP-Z2-9]{6}$/).textContent()
    )?.trim() as string;

    const pantallaAlumno = await (await browser.newContext()).newPage();
    await ingresar(pantallaAlumno, 'alumno11@cwgym.test');
    await irAlMenu(pantallaAlumno, 'Vincularme con mi profesor');
    await pantallaAlumno.getByLabel('Código de profesor').fill(codigo);
    await pantallaAlumno.getByRole('button', { name: 'Vincularme' }).click();
    await expect(pantallaAlumno.getByRole('status')).toHaveText(
      'Quedaste vinculado con Diego Fernández',
    );

    await pantallaAlumno.reload();
    await pantallaAlumno.getByLabel('Código de profesor').fill(codigo);
    await pantallaAlumno.getByRole('button', { name: 'Vincularme' }).click();
    await expect(pantallaAlumno.getByRole('alert')).toHaveText(
      'Ya estás vinculado con un profesor: no podés vincularte con otro',
    );
  });
});

test.describe('RN-IDE-11 · un código inexistente no vincula', () => {
  test('muestra el error del back', async ({ page }) => {
    await ingresar(page, 'alumno12@cwgym.test');
    await irAlMenu(page, 'Vincularme con mi profesor');
    await page.getByLabel('Código de profesor').fill('ZZZZZZ');
    await page.getByRole('button', { name: 'Vincularme' }).click();

    await expect(page.getByRole('alert')).toHaveText('El código de profesor no es válido');
  });
});
