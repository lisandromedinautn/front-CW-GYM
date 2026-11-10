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
| `EditorRutina.tsx` | `usarCrearRutina.ts` ✅ (US06, bloques), `usarEjerciciosParaRutina.ts` ✅, `usarEditarRutina.ts` 📄 | US06, US09, US10 |
| `PaginaImportarRutina.tsx` | `usarImportarRutina.ts` | US20 |
| `PaginaCrearPlan.tsx` | `usarCrearPlan.ts` | US07 |
| `PaginaAlumnosDelPlan.tsx` | `usarAlumnosDelPlan.ts` | US12 |
| `PaginaRutinaDelDia.tsx` | `usarRutinaDelDia.ts` | US08 |
| `PaginaMiPlan.tsx` | `usarMiPlan.ts` | US11 |

## Historial de cambios de reglas de UI

| Fecha | Regla | Cambio | Quién lo decidió |
| :-- | :-- | :-- | :-- |
| 01/11/2026 | Todas | Versión inicial | Lisandro |
| 01/11/2026 | RN-PLAN-03, 08, 16, 17 | Se reflejan ZG-06 y ZG-07; se quita US19 | Lisandro |
| 10/11/2026 | RN-PLAN-05 | Se refleja la aclaración del back: el peso es opcional (US06) | Ignacio |

## Decisiones de implementación (US06)

* El editor está en `/profesor/rutinas`, con la opción de menú "Rutinas" (pensada para sumar el listado cuando exista el endpoint). Hoy solo crea. Decidido por Ignacio el 10/11/2026.
* El catálogo se pide con un cliente propio (`infraestructura/api/apiPlanificacion.ts`, `GET /catalogo/ejercicios`) reducido a id, nombre, tipo y tipo de carga, porque planificación no importa el módulo catálogo (CLAUDE.md, regla 2).
* Antes de enviar, el editor marca los campos que faltan ("Completá este campo") y las series menores que 1 ("Mínimo 1 serie"). Sin bloques avisa "Agregá al menos un bloque". Los errores del back se muestran con su mensaje en el `alert`.
* El body manda `repeticiones` o `segundos` según el tipo del ejercicio, y `pesoKg` solo si la carga incluye Peso Extra y se completó.
* El e2e de Playwright (`e2e/planificacion/crear-rutina.e2e.ts`) corre contra el back de test: `NODE_ENV=test yarn seed` y `NODE_ENV=test yarn start` en el back, y `E2E_URL_API=http://localhost:3001 yarn test:e2e` en el front.
