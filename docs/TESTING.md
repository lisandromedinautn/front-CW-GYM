# Protocolo de testing — front-CW-GYM

El objetivo principal del proyecto es una base de tests sólida. Un test vale si protege una regla, no si pasa. Además de los e2e de API del back, el front tiene e2e de navegador con **Playwright**, que se configuran al crear la suite de tests.

## Niveles

| Nivel | Qué prueba | Archivo | Bordes falsos |
| :-- | :-- | :-- | :-- |
| Unitario | Validaciones y transformaciones puras de `dominio/` | `*.test.ts` junto al archivo | Ninguno |
| Integración | Página o componente + hook + cliente, renderizado con Testing Library, como lo usa una persona | `*.int.test.tsx` junto a la página | Red HTTP falsa en el borde (la herramienta se elige en T02, p. ej. MSW) que devuelve respuestas con la forma del contrato del back |
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

Se configura en `vite.config` / `vitest.config` (T02).

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
