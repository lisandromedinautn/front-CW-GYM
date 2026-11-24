import { type Page } from '@playwright/test';
import { CONTRASENIA_SEMILLA } from './api.ts';

/** Ingresa al sistema por la pantalla de ingreso (RN-IDE-01). */
export async function ingresar(page: Page, email: string, contrasenia = CONTRASENIA_SEMILLA) {
  await page.goto('/ingreso');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Contraseña').fill(contrasenia);
  await page.getByRole('button', { name: 'Ingresar' }).click();
}

/** Abre una opción del menú principal del rol (RN-UI-IDE-01). */
export async function irAlMenu(page: Page, opcion: string) {
  await page
    .getByRole('navigation', { name: 'Menú principal' })
    .getByRole('link', { name: opcion })
    .click();
}
