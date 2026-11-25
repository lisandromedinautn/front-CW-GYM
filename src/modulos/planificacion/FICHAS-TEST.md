

## US06 — Consultar y editar una rutina (confirmadas por Martina el 24/11/2026)

| Test (archivo › caso) | RN | Nivel | Entrada | Esperado | Obtenido (último run) | Fecha |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| `PaginaEditarRutina.int.test.tsx` › la tarjeta abre el editor con el nombre, el ejercicio, las series, las repeticiones y las pausas | RN-PLAN-08 | Integración | listado con Empuje (press 3x10, 60/120 s); lápiz "Editar rutina" | Nombre Empuje, e-press, 3, 10, 60, 120 | = esperado (Vitest, 24/11/2026) | 24/11/2026 |
| `PaginaEditarRutina.int.test.tsx` › cambiar las repeticiones a 12 y "Guardar cambios" envía el PUT con el contenido nuevo | RN-PLAN-07 | Integración | Repeticiones 12; "Guardar cambios" | PUT con nombre Empuje y press 3x12, 60/120 s; "Cambios guardados" | = esperado (Vitest, 24/11/2026) | 24/11/2026 |
| `PaginaEditarRutina.int.test.tsx` › si el back responde 409 RN-PLAN-21, muestra su mensaje en un alert | RN-PLAN-21 | Integración | Nombre Piernas; PUT 409 RN-PLAN-21 | alert "Ya tenés una rutina con ese nombre" | = esperado (Vitest, 24/11/2026) | 24/11/2026 |
| `PaginaEditarRutina.int.test.tsx` › cambiar el nombre de "Empuje" a "Piernas" y "Guardar cambios" envía el PUT con el nombre y muestra "Piernas" | RN-PLAN-21 | Integración | Nombre Piernas; "Guardar cambios" | PUT con nombre Piernas y press 3x10, 60/120 s; título "Piernas" | = esperado (Vitest, 24/11/2026) | 24/11/2026 |

El 24/11/2026 se quitaron de `PaginaRutinas.int.test.tsx` los 3 tests de renombrar en la tarjeta ("Editar nombre" y "Guardar", "Cancelar" y 409): el lápiz ahora abre el editor. Los reemplazan el cambio de nombre y el 409 de esta tabla. Aprobado por Martina.

## US22 — Editar los días de un plan (confirmadas por Lisandro el 24/11/2026)

Hoy fijo en 24/11/2026; plan del 21/11 al 18/12.

| Test (archivo › caso) | RN | Nivel | Entrada | Esperado | Obtenido (último run) | Fecha |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| `consultar-planes/PaginaPlanes.int.test.tsx` › F1 enlace "Editar días" | RN-PLAN-23 | Integración | plan Vigente en el listado | la tarjeta tiene "Editar días" y lleva a `/profesor/planes/:id/dias` | = esperado | 24/11/2026 |
| `editar-dias-plan/PaginaEditarDiasPlan.int.test.tsx` › F1 grilla | RN-PLAN-23 | Integración | `GET /planificacion/planes/:id` con 28 días | 28 días con su rutina o "Descanso"; los días anteriores al 24/11 sin selector | = esperado | 24/11/2026 |
| `editar-dias-plan/PaginaEditarDiasPlan.int.test.tsx` › F2 guardar un día | RN-PLAN-23 | Integración | día 10: elegir R y "Guardar"; día 12: elegir "Descanso" y "Guardar" | `PUT .../dias/10` con `{ rutinaId: R }` y `PUT .../dias/12` con `{ rutinaId: null }`; el día muestra lo guardado | = esperado | 24/11/2026 |
| `editar-dias-plan/PaginaEditarDiasPlan.int.test.tsx` › F3 error del back | RN-PLAN-23 | Integración | `PUT` responde 409 `RN-PLAN-23` | `alert` con el mensaje del back | = esperado | 24/11/2026 |


## T25 — Mi plan en calendario (confirmadas por Ulises el 25/11/2026)

Plan del 01/11/2026 al 28/11/2026, con Piernas el día 1, Circuito el día 28 y descanso el resto; el back informa `fecha: 2026-11-14`.

| Test (archivo › caso) | RN | Nivel | Entrada | Esperado | Obtenido (último run) | Fecha |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| `mi-plan/PaginaMiPlan.int.test.tsx` › muestra los 28 días ordenados con sus fechas, rutinas y descansos (adaptado) | RN-PLAN-11, 19 | Integración | abrir Mi plan | los 28 botones de "Días del plan" dicen, en orden, "1 · Día 1 — domingo 01/11: Piernas", "2 · Día 2 — lunes 02/11: Descanso" … "28 · Día 28 — sábado 28/11: Circuito"; los `time` 2026-11-01 y 2026-11-28; 26 "Descanso" | = esperado (Vitest, 25/11/2026) | 25/11/2026 |
| `mi-plan/PaginaMiPlan.int.test.tsx` › muestra debajo del calendario el detalle del día elegido (adaptado de "despliega ejercicios, objetivos y pausas de cada rutina") | RN-PLAN-19 | Integración | tocar "1 · Día 1 — domingo 01/11: Piernas" y después "28 · Día 28 — sábado 28/11: Circuito" | el panel "Día 1 — domingo 01/11" muestra Press de pecho, "Día 1 de 28", "3 series × 10 repeticiones · 20 kg" y las pausas; luego el panel "Día 28 — sábado 28/11" muestra "Día 28 de 28", "3 vueltas", "10 repeticiones · 20 kg", Plancha, "30 segundos" y "Macropausa al terminar cada vuelta: 90 s"; el panel del día 1 ya no está, y el día 28 queda con `aria-pressed="true"` y el 1 con `"false"` | = esperado (Vitest, 25/11/2026) | 25/11/2026 |
| `mi-plan/PaginaMiPlan.int.test.tsx` › la leyenda nombra cada rutina del plan una vez, en el orden en que aparece | RN-PLAN-19 | Integración | el plan con Piernas también el día 3 | la lista "Rutinas del plan" dice ["Piernas", "Circuito"] | = esperado (Vitest, 25/11/2026) | 25/11/2026 |
| `mi-plan/PaginaMiPlan.int.test.tsx` › al entrar elige y marca el día de hoy que informa el back | RN-PLAN-19 | Integración | abrir Mi plan | el botón "14 · Día 14 — sábado 14/11: Descanso" tiene `aria-current="date"` y `aria-pressed="true"`; el panel "Día 14 — sábado 14/11" dice "Día de descanso" | = esperado (Vitest, 25/11/2026) | 25/11/2026 |

Cambio del test existente aprobado por Ulises el 25/11/2026: el detalle pasa de un desplegable en cada día a un panel debajo del calendario; se conservan los clics y los literales, y el paso "volver a tocar el día 1 lo cierra" se reemplaza por "al elegir el día 28, el panel del día 1 ya no está". Después de la revisión de terminación, Ulises aprobó el mismo día cambiar el nombre accesible de los días (WCAG 2.5.3: el nombre contiene lo que se ve): los tests buscan el botón por "N · Día N — día dd/mm: rutina o Descanso" en lugar de "Ver rutina del día N: …" y del título de cada día; los literales de fechas y rutinas no cambian. Tras la revisión manual, Ulises aprobó sumar el test de la leyenda (las rutinas quedan como un punto de color en cada día).
