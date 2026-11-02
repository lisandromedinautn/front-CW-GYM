# front-CW-GYM — CLAUDE.md global

Front del Sistema de Entrenamiento de Gimnasio: React + Vite, enfoque DDD por módulos. La API está en `../back-CW-GYM`.

**Para navegar, empezá por [ATLAS.md](ATLAS.md).** No recorras carpetas a ciegas. Si algo no figura en el atlas, buscalo con Grep o Glob y después agregalo.

## Documentos de referencia

| Necesito… | Leo… |
| :-- | :-- |
| Dónde está cada módulo, pantalla, hook y test | [ATLAS.md](ATLAS.md) |
| Qué reglas aplica la UI de un módulo | `src/modulos/<modulo>/CLAUDE.md` |
| El texto completo de una regla RN-IDE/CAT/PLAN/ENT | `../back-CW-GYM/src/modulos/<modulo>/CLAUDE.md` (**fuente de verdad**) |
| La ficha de un test | `src/modulos/<modulo>/FICHAS-TEST.md` |
| Glosario, decisiones, US y modelo DDD | [docs/PLANIFICACION.md](docs/PLANIFICACION.md) |
| Protocolo de testing | [docs/TESTING.md](docs/TESTING.md) |
| Matriz US → RN → caso de uso → test | [docs/TRAZABILIDAD.md](docs/TRAZABILIDAD.md) |
| Modelos de IA y plantillas | [docs/MODELOS-IA.md](docs/MODELOS-IA.md) |
| Registro de sesiones con IA | [DECISIONES-IA.md](DECISIONES-IA.md) |

`docs/PLANIFICACION.md`, `docs/TRAZABILIDAD.md` y `docs/MODELOS-IA.md` son copias idénticas de las del back. Si cambian, se actualizan en los dos repos.

## Idioma

Todo en español: componentes, hooks, archivos, carpetas, tests, commits y textos de pantalla. Se usan los términos del glosario sin sinónimos ("Entrenamiento", "ingresar al sistema", "Serie Realizada").

## Arquitectura

```
src/
  modulos/<modulo>/
    dominio/          tipos del módulo y validaciones puras que la UI aplica antes de enviar (p. ej. RPE 1 a 10)
    aplicacion/       un caso de uso de UI por archivo: hooks que orquestan (usarIniciarEntrenamiento)
    infraestructura/  cliente de la API del módulo (implementa el puerto que usa aplicacion)
    presentacion/     páginas y componentes; no llaman a la API directamente
    CLAUDE.md         reglas que aplica la UI del módulo
    FICHAS-TEST.md    fichas de cada test
  compartido/         cliente HTTP base, sesión y JWT, rutas protegidas por rol, componentes genéricos
```

Reglas de dependencia:

1. `presentacion` → `aplicacion` → `dominio`. `infraestructura` implementa los puertos de `aplicacion`. Ningún componente hace `fetch` directo.
2. Un módulo no importa el interior de otro. Lo compartido va a `compartido/`.
3. La regla de negocio vive en el back. El front la **refleja** (valida antes de enviar para dar feedback rápido) y **muestra** los errores del back por su `codigo` RN. Nunca la reemplaza.
4. Contrato de error del back: `{ codigo: "RN-...", mensaje }`. La UI decide qué mostrar a partir de `codigo`, no del texto.

## Paquetes (Yarn 1): regla estricta

**PROHIBIDO instalar una versión publicada hace menos de 24 horas.** Antes de cada `yarn add` o `yarn upgrade`:

1. `npm view <paquete>@<versión> time --json` para ver la fecha de publicación de esa versión.
2. Si pasaron menos de 24 h, se elige la versión anterior que cumpla.
3. Se instala fijando la versión exacta: `yarn add <paquete>@<versión> --exact`.
4. Se commitea `yarn.lock`. En CI y en los hooks se usa `yarn install --frozen-lockfile`.

`yarn add`, `yarn upgrade` y `npx` piden confirmación (`.claude/settings.json`).

## Testing: reglas que no se negocian

Protocolo completo en [docs/TESTING.md](docs/TESTING.md). Herramientas: Vitest + Testing Library (unitarios e integración) y Playwright (e2e en `e2e/`, se configura al crear la suite).

1. **Cada test cita su regla**: `describe('RN-ENT-14 · el RPE es un entero de 1 a 10', ...)`. Si no hay una regla que lo justifique, el test no se escribe.
2. **Antes de escribir un test, se le pregunta al desarrollador** qué se ingresa, qué se espera y qué casos hay que cubrir. Las RN "a confirmar" no se testean.
3. **Rojo antes que verde.** Skills `tdd` y `coverage`.
4. **El esperado es un literal** de la regla o del ejemplo trabajado.
5. **PROHIBIDO modificar un test existente sin preguntar.** Si falla después de un cambio, se reporta test, RN, entrada, esperado y obtenido, y se pregunta si cambió la regla. Editar `*.test.ts(x)` o `e2e/**` pide confirmación. No se editan tests por shell.
6. PROHIBIDO debilitar aserciones: `skip`, `only`, `todo`, aflojar valores, borrar asserts.
7. Cobertura: `dominio` 80% como mínimo (apuntar a más), resto 70%. Lint sin errores.

Comandos (se definen en T02): `yarn test`, `yarn test:cov`, `yarn lint`.

## Git y Trello

* Ramas `main` y `develop`. Se trabaja sobre `develop` (commit directo permitido). Lo que bloquea son los hooks de lint y tests.
* `develop` → `main` al cierre de cada sprint, con el permiso del desarrollador.
* Todo commit referencia su tarjeta de Trello: `feat(entrenamiento): pantalla de serie realizada [US14]`.
* El agente no commitea ni pushea sin que el desarrollador se lo pida.

## Trabajo con IA

* **Delegación**: el orquestador (Opus 5.5) prioriza delegar en subagentes (Sonnet 5.5 low y Haiku 5.5 low). Propone el reparto por consola y espera confirmación. Subagentes en paralelo solo si no tocan los mismos archivos. A Haiku no se le da un módulo entero con lógica compleja. Detalle en [docs/MODELOS-IA.md](docs/MODELOS-IA.md). La decisión final es del desarrollador.
* **Auditoría**: cada sesión relevante suma una entrada en [DECISIONES-IA.md](DECISIONES-IA.md). Si tocó los dos repos, va en ambos.
* **Contrato con el back**: si una pantalla necesita un campo que la API no da, no se inventa. Se reporta y se acuerda el contrato en el back primero.
