// Se carga antes de cada archivo de test.
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { servidorRedFalsa } from './servidor-red-falsa.ts';

beforeAll(() => servidorRedFalsa.listen({ onUnhandledFrame: 'error' }));
afterEach(() => {
  cleanup();
  servidorRedFalsa.resetHandlers();
});
afterAll(() => servidorRedFalsa.close());
