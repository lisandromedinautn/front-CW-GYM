import { setupServer } from 'msw/node';

/**
 * Red HTTP falsa para los tests de integración (docs/TESTING.md: se mockea solo la red).
 * Arranca sin respuestas: cada test declara las suyas con `servidorRedFalsa.use(...)`, con la
 * forma exacta del contrato del back. Una request sin respuesta declarada hace fallar el test.
 */
export const servidorRedFalsa = setupServer();
