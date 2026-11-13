# Módulo Planificación (`planificacion`) — front

Editor de rutinas, importación, creación de planes, gestión de alumnos del plan y vistas del alumno (rutina del día y plan completo). El texto de las reglas RN-PLAN está en `../back-CW-GYM/src/modulos/planificacion/CLAUDE.md`.

## Reglas que aplica la UI

| ID | Qué hace la UI | Estado |
| :-- | :-- | :-- |
| RN-PLAN-01 | El editor permite agregar bloques y circuitos en orden. Muestra el tipo de rutina (Bloques, Circuitos, Mixta) derivado, sin dejar elegirlo | Vigente |
| RN-PLAN-02 | Un bloque pide ejercicio, series (≥ 1), micropausa y macropausa | Vigente |
| RN-PLAN-03 | Un circuito pide 2 o más ejercicios, vueltas y macropausa. No muestra micropausa | Vigente |
| RN-PLAN-04 | Según el tipo del ejercicio, se pide repeticiones o tiempo, nunca los dos | Vigente |
| RN-PLAN-05 | El campo peso solo aparece si el tipo de carga incluye Peso Extra, y es opcional | Vigente |
| RN-PLAN-21 | La tarjeta de la rutina muestra su nombre como título, con edición en el lugar ("Editar nombre", "Guardar", "Cancelar"). Antes de enviar valida de 1 a 60 caracteres sin contar los extremos ("Completá el nombre", "Máximo 60 caracteres"); "Cancelar" no envía nada y los errores del back (409 por nombre repetido) van en un `alert` | Vigente ✅ |
| RN-PLAN-20 | Antes de enviar, avisa si un circuito repite un ejercicio ("No repitas ejercicios en el circuito") | Vigente |
| RN-PLAN-08 | Al modificar una rutina importada, pregunta si es una rutina nueva. Solo se listan para importar las rutinas del propio profesor | Vigente |
| RN-PLAN-09 | Al elegir la fecha de inicio, muestra la fecha de fin calculada (inicio + 27) sin permitir editarla | Vigente |
| RN-PLAN-10 | Cada uno de los 28 días se puede marcar como descanso o asignarle una rutina | Vigente |
| RN-PLAN-11 | Cada día muestra su fecha concreta | Vigente |
| RN-PLAN-13, 14 | Solo ofrece alumnos vinculados al profesor; si el back rechaza por plan vigente, muestra el error | Vigente |
| RN-PLAN-16 | Se puede quitar al último alumno de un plan vigente | Vigente |
| RN-PLAN-17 | No hay opción para finalizar un plan antes de tiempo | Vigente |
| RN-PLAN-18 | La rutina del día muestra la rutina, "Descanso" o "No tenés un plan vigente" | Vigente |

## Pantallas y hooks planificados

| Pantalla (`presentacion/`) | Hook (`aplicacion/`) | US |
| :-- | :-- | :-- |
| `EditorRutina.tsx` (con `EditorBloque.tsx`, `EditorCircuito.tsx`, `CamposObjetivo.tsx`, `CampoNumero.tsx` y `edicion.ts`) | `usarCrearRutina.ts` ✅ (US06 bloques, US09 circuitos), `usarEjerciciosParaRutina.ts` ✅, `usarEditarRutina.ts` 📄 | US06, US09, US10 |
| `PaginaRutinas.tsx` (`consultar-rutinas/`) ✅ | `usarConsultarRutinas.ts` ✅, `usarRenombrarRutina.ts` (`renombrar-rutina/`) ✅ | T06, T08, T09 |
| `PaginaImportarRutina.tsx` | `usarImportarRutina.ts` | US20 |
| `PaginaCrearPlan.tsx` ✅ (`crear-plan/`) | `usarCrearPlan.ts` ✅, `usarDatosParaPlan.ts` ✅ | US07 |
| `PaginaAlumnosDelPlan.tsx` | `usarAlumnosDelPlan.ts` | US12 |
| `PaginaRutinaDelDia.tsx` | `usarRutinaDelDia.ts` | US08 |
| `PaginaMiPlan.tsx` | `usarMiPlan.ts` | US11 |

## Historial de cambios de reglas de UI

| Fecha | Regla | Cambio | Quién lo decidió |
| :-- | :-- | :-- | :-- |
| 01/11/2026 | Todas | Versión inicial | Lisandro |
| 01/11/2026 | RN-PLAN-03, 08, 16, 17 | Se reflejan ZG-06 y ZG-07; se quita US19 | Lisandro |
| 10/11/2026 | RN-PLAN-05 | Se refleja la aclaración del back: el peso es opcional (US06) | Ignacio |
| 10/11/2026 | RN-PLAN-20 | Se refleja la regla nueva del back: un circuito no repite ejercicios (US09) | Ignacio |
| 11/11/2026 | RN-PLAN-21 | Se refleja la regla nueva del back: el nombre de la rutina (1 a 60 caracteres, único por profesor) | Lisandro |
| 13/11/2026 | RN-PLAN-09 a 14, 17 | Se implementa US07: pantalla de crear plan con fecha de fin calculada, 28 días con rutina o descanso y alumnos vinculados | Lisandro |

## Decisiones de implementación (US07)

* La pantalla vive en `/profesor/planes` y la abre la opción de menú "Planes". `PaginaCrearPlan` se renderiza directo (todavía no hay endpoint para listar planes).
* La fecha de inicio arranca en hoy (`hoyIso()`), se elige con un `input type="date"` y la fecha de fin se muestra calculada (inicio + 27) sin editarla. Las fechas se manejan como `AAAA-MM-DD` en UTC (`dominio/plan/plan.ts`), sin depender de la zona del navegador.
* Cada uno de los 28 días tiene un `select` de rutina con la opción "Descanso" (valor vacío, que se envía como `rutinaId: null`). El body manda siempre los 28 días, en orden.
* Los alumnos se piden a `GET /identidad/alumnos` (solo los vinculados al profesor, RN-PLAN-13) y se ordenan por apellido y nombre. Las rutinas se piden con `listarTodasLasRutinas()`, que pagina `GET /planificacion/rutinas` de a 100 hasta traerlas todas.
* Antes de enviar valida en el front: fecha válida ("Elegí una fecha de inicio válida") y al menos un alumno ("Elegí al menos un alumno", RN-PLAN-12). Los rechazos del back (RN-PLAN-08, 13, 14) se muestran con su mensaje en el `alert`.
* No hay botón para finalizar el plan antes de tiempo (RN-PLAN-17).

## Decisiones de implementación (T06, T08)

* El listado usa el `Paginador` compartido con `usarTamanioPagina('rutinas', 10)`. Se reemplaza el `totalPaginas` propio por el de `compartido/dominio/paginacion`.
* El nombre se edita en el lugar con `PATCH /planificacion/rutinas/:id/nombre`; la tarjeta ya no muestra "Rutina N" sino `rutina.nombre`.

## Decisiones de implementación (US09)

* "Agregar circuito" suma un circuito que arranca con 2 ejercicios vacíos (el mínimo de RN-PLAN-03). Cada ejercicio va en su propio grupo ("Ejercicio 1", "Ejercicio 2"…) con "Quitar ejercicio", y el circuito tiene "Agregar ejercicio", "Vueltas", "Macropausa (s)" y "Quitar circuito". Decidido por Ignacio el 10/11/2026.
* Hasta US10 (rutina mixta) no se mezclan: con bloques se deshabilita "Agregar circuito", y con circuitos "Agregar bloque". Esta restricción es temporal y no tiene test. Decidido por Ignacio el 10/11/2026.
* Antes de enviar, el circuito avisa "Un circuito necesita 2 o más ejercicios", "Mínimo 1 vuelta" o "No repitas ejercicios en el circuito". Sin bloques ni circuitos avisa "Agregá al menos un bloque o un circuito".
* El body manda solo la lista que tiene contenido: `{ bloques }` o `{ circuitos }` (contrato del back de US06 y US09).
* El editor se partió en `edicion.ts` (estado, validaciones y armado del body), `CampoNumero`, `CamposObjetivo` (compartido por bloques y circuitos), `EditorBloque` y `EditorCircuito`. Los tests de US06 no cambiaron.

## Decisiones de implementación (US06)

* El editor está en `/profesor/rutinas`, con la opción de menú "Rutinas" (pensada para sumar el listado cuando exista el endpoint). Hoy solo crea. Decidido por Ignacio el 10/11/2026.
* El catálogo se pide con un cliente propio (`infraestructura/api/apiPlanificacion.ts`, `GET /catalogo/ejercicios`) reducido a id, nombre, tipo y tipo de carga, porque planificación no importa el módulo catálogo (CLAUDE.md, regla 2).
* Antes de enviar, el editor marca los campos que faltan ("Completá este campo") y las series menores que 1 ("Mínimo 1 serie"). Sin bloques avisa "Agregá al menos un bloque". Los errores del back se muestran con su mensaje en el `alert`.
* El body manda `repeticiones` o `segundos` según el tipo del ejercicio, y `pesoKg` solo si la carga incluye Peso Extra y se completó.
* El e2e de Playwright (`e2e/planificacion/crear-rutina.e2e.ts`) corre contra el back de test: `NODE_ENV=test yarn seed` y `NODE_ENV=test yarn start` en el back, y `E2E_URL_API=http://localhost:3001 yarn test:e2e` en el front.
