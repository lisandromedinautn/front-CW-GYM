# Protocolo de testing — front-CW-GYM

El objetivo principal del proyecto es una base de tests sólida. Un test vale si protege una regla, no si pasa. Además de los e2e de API del back, el front tiene e2e de navegador con **Playwright**, que se configuran al crear la suite de tests.

## Niveles

| Nivel | Qué prueba | Archivo | Bordes falsos |
| :-- | :-- | :-- | :-- |
| Unitario | Validaciones y transformaciones puras de `dominio/` | `*.test.ts` junto al archivo | Ninguno |
| Integración | Página o componente + hook + cliente, renderizado con Testing Library, como lo usa una persona | `*.int.test.tsx` junto a la página | Red HTTP falsa en el borde: MSW (`src/pruebas/servidor-red-falsa.ts`) que devuelve respuestas con la forma del contrato del back |
| e2e (Playwright) | Flujos completos de una persona en el navegador contra el back real y su base de test dockerizada (ingresar, armar una rutina, entrenar y ver el resumen) | `e2e/<modulo>/*.e2e.ts` | Ninguno: front y back reales |

* Herramientas: Vitest, @testing-library/react y @testing-library/user-event. Lint con ESLint + Prettier.
* Se mockea solo la red y el reloj. No se mockean hooks ni componentes propios.
* Se consulta la pantalla por rol y texto visible (`getByRole`, `getByLabelText`), no por clases CSS ni test ids salvo que no haya alternativa.
* Las respuestas falsas de la API usan la forma exacta del contrato. Si el contrato cambia en el back, se actualiza acá con permiso del desarrollador (es un cambio de test).

## Cobertura

| Alcance | Umbral bloqueante | Meta |
| :-- | :-- | :-- |
| `src/modulos/*/dominio/**` | 80% | Superar el 80% |
| Resto de `src/` | 70% | — |

Está en `vite.config.ts`.

**Red falsa (MSW 3).** `src/pruebas/preparar-vitest.ts` levanta el servidor con `onUnhandledFrame: 'error'`: una request sin respuesta declarada hace fallar el test (en MSW 3 la opción ya no se llama `onUnhandledRequest`). Cada test declara sus respuestas con `servidorRedFalsa.use(...)`.

**Playwright.** La primera vez: `yarn playwright install chromium`. Los e2e van en `e2e/<modulo>/*.e2e.ts` y corren con `yarn test:e2e` contra el front (`yarn dev`, lo levanta Playwright) y el back reales.

Desde T15 la suite corre contra el **back de test con la base recién sembrada**: cada alumno de la semilla se vincula una sola vez (RN-IDE-10), tiene un plan vigente (RN-PLAN-14) y entrena una vez por día (RN-ENT-01), así que una segunda corrida sobre la misma base falla. Pasos, sin tocar los servidores de desarrollo (3000 y 5173):

1. En `back-CW-GYM`: `docker compose up -d --force-recreate --wait bd-test` (la base de test está en memoria y queda vacía) y `NODE_ENV=test yarn seed`.
2. En `back-CW-GYM`: `NODE_ENV=test URL_FRONT=http://localhost:5180 yarn start` (back de test en el 3001, aceptando el front de Playwright).
3. En `front-CW-GYM`: `E2E_URL_API=http://localhost:3001 E2E_PUERTO_FRONT=5180 yarn test:e2e`. Con `E2E_PUERTO_FRONT`, Playwright levanta su propio front en ese puerto.

Cada archivo usa sus propios usuarios de la semilla y prepara por API (`e2e/soporte/api.ts`) lo que no es parte del flujo que prueba. Corre con un solo worker porque generar un código de profesor invalida el anterior (RN-IDE-08). Los e2e de API del back (`yarn test:e2e` del back) vacían la base de test: después de correrlos, repetir el paso 1.

## Ciclo para escribir un test (TDD)

Igual que en el back (`../back-CW-GYM/docs/TESTING.md`):

1. Identificar la regla (RN del back o RN-UI del módulo). Si está "a confirmar", frenar.
2. **Preguntar al desarrollador**: qué se ingresa (acciones de la persona y respuesta de la API), qué se espera (lo que se ve en pantalla o la request que se envía) y qué caminos cubrir (feliz, límite y error con su `codigo` RN).
3. Registrar la ficha en `FICHAS-TEST.md`.
4. Escribir el test y verlo fallar por una aserción.
5. Implementar lo mínimo.
6. Verificar que el test muerde: romper la línea de producción, ver el rojo y restaurar.
7. Actualizar la ficha, `docs/TRAZABILIDAD.md` y `ATLAS.md`.

## Cuando un test falla después de un cambio

**El test no se toca.** Se reporta test, regla, entrada, esperado y obtenido, y se pregunta: "¿Cambió la regla o es un bug?". Si cambió la regla, primero se actualiza la regla (en el back si es RN-IDE/CAT/PLAN/ENT, en el `CLAUDE.md` del módulo si es RN-UI), después la ficha, después el test, y por último `DECISIONES-IA.md`.

Editar `*.test.ts`, `*.test.tsx` o `FICHAS-TEST.md` existentes pide confirmación (`.claude/settings.json`).

**PROHIBIDO:** `skip`, `only`, `todo`, aflojar valores esperados, cambiar `toBe` por `toBeTruthy`, borrar asserts que siguen valiendo.

## Skills

* **`tdd`**: el ciclo rojo → verde, costuras acordadas con el usuario y antipatrones.
* **`coverage`**: escrita para Playwright, así que se usa tal cual sobre los e2e: mapea las pantallas de `ATLAS.md` contra `e2e/`. La cobertura de líneas sale de `yarn test:cov`. El paso de autogenerar (`/pw:generate`) no se usa sin ficha: cada test pasa por el ciclo de arriba.

## Lint y hooks

ESLint (flat config) + Prettier. Pre-commit con husky + lint-staged: lint y tests relacionados. Antes de publicar una versión (tag en `develop`) o de `develop` → `main`: `yarn lint` y `yarn test:cov` en verde.
