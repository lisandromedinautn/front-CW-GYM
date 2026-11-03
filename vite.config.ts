import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    // Unitarios (*.test.ts) e integración (*.int.test.tsx) junto al código. Los e2e son de Playwright.
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: ['src/pruebas/preparar-vitest.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      // Solo se excluye el cableado: arranque, raíz de composición y utilidades de test.
      exclude: ['src/main.tsx', 'src/Aplicacion.tsx', 'src/pruebas/**', 'src/**/*.test.{ts,tsx}'],
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
        'src/modulos/*/dominio/**': { lines: 80, functions: 80, branches: 80, statements: 80 },
      },
    },
  },
});
