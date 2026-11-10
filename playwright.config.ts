import { defineConfig, devices } from '@playwright/test';

// e2e de navegador (docs/TESTING.md): flujos completos contra el front y el back reales.
// Antes de correrlos: back levantado (`yarn bd:levantar` y `yarn start:dev` en back-CW-GYM)
// y navegador instalado una sola vez con `yarn playwright install chromium`.
// Con E2E_URL_API se apunta el front a otro back (por ejemplo, el de test en el puerto 3001:
// `NODE_ENV=test yarn start` en back-CW-GYM); sin ella se usa VITE_URL_API del .env.
export default defineConfig({
  testDir: 'e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    env: process.env.E2E_URL_API ? { VITE_URL_API: process.env.E2E_URL_API } : {},
  },
});
