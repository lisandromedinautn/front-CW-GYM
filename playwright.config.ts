import { defineConfig, devices } from '@playwright/test';

// e2e de navegador (docs/TESTING.md): flujos completos contra el front y el back reales.
// Antes de correrlos: back levantado (`yarn bd:levantar` y `yarn start:dev` en back-CW-GYM)
// y navegador instalado una sola vez con `yarn playwright install chromium`.
// Con E2E_URL_API se apunta el front a otro back (por ejemplo, el de test en el puerto 3001:
// `NODE_ENV=test yarn start` en back-CW-GYM); sin ella se usa VITE_URL_API del .env.
// Con E2E_PUERTO_FRONT, Playwright levanta su propio front en ese puerto y no reutiliza el de
// desarrollo (el back de test tiene que aceptar ese origen: URL_FRONT=http://localhost:<puerto>).
const PUERTO_FRONT = process.env.E2E_PUERTO_FRONT ?? '5173';
const URL_FRONT = `http://localhost:${PUERTO_FRONT}`;

export default defineConfig({
  testDir: 'e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: false,
  // T15: un solo worker. Los archivos comparten profesores de la semilla y generar un código
  // invalida el anterior (RN-IDE-08), así que no pueden correr a la vez.
  workers: 1,
  forbidOnly: true,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: URL_FRONT,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `yarn dev --port ${PUERTO_FRONT} --strictPort`,
    url: URL_FRONT,
    reuseExistingServer: !process.env.E2E_PUERTO_FRONT,
    env: process.env.E2E_URL_API ? { VITE_URL_API: process.env.E2E_URL_API } : {},
  },
});
