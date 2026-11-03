import { defineConfig, devices } from '@playwright/test';

// e2e de navegador (docs/TESTING.md): flujos completos contra el front y el back reales.
// Antes de correrlos: back levantado (`yarn bd:levantar` y `yarn start:dev` en back-CW-GYM)
// y navegador instalado una sola vez con `yarn playwright install chromium`.
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
  },
});
