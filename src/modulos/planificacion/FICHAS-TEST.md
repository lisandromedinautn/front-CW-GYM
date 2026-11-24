

## US06 — Consultar y editar una rutina (confirmadas por Martina el 24/11/2026)

| Test (archivo › caso) | RN | Nivel | Entrada | Esperado | Obtenido (último run) | Fecha |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| `PaginaEditarRutina.int.test.tsx` › la tarjeta abre el editor con el nombre, el ejercicio, las series, las repeticiones y las pausas | RN-PLAN-08 | Integración | listado con Empuje (press 3x10, 60/120 s); lápiz "Editar rutina" | Nombre Empuje, e-press, 3, 10, 60, 120 | = esperado (Vitest, 24/11/2026) | 24/11/2026 |
| `PaginaEditarRutina.int.test.tsx` › cambiar las repeticiones a 12 y "Guardar cambios" envía el PUT con el contenido nuevo | RN-PLAN-07 | Integración | Repeticiones 12; "Guardar cambios" | PUT con nombre Empuje y press 3x12, 60/120 s; "Cambios guardados" | = esperado (Vitest, 24/11/2026) | 24/11/2026 |
| `PaginaEditarRutina.int.test.tsx` › si el back responde 409 RN-PLAN-21, muestra su mensaje en un alert | RN-PLAN-21 | Integración | Nombre Piernas; PUT 409 RN-PLAN-21 | alert "Ya tenés una rutina con ese nombre" | = esperado (Vitest, 24/11/2026) | 24/11/2026 |
| `PaginaEditarRutina.int.test.tsx` › cambiar el nombre de "Empuje" a "Piernas" y "Guardar cambios" envía el PUT con el nombre y muestra "Piernas" | RN-PLAN-21 | Integración | Nombre Piernas; "Guardar cambios" | PUT con nombre Piernas y press 3x10, 60/120 s; título "Piernas" | = esperado (Vitest, 24/11/2026) | 24/11/2026 |

El 24/11/2026 se quitaron de `PaginaRutinas.int.test.tsx` los 3 tests de renombrar en la tarjeta ("Editar nombre" y "Guardar", "Cancelar" y 409): el lápiz ahora abre el editor. Los reemplazan el cambio de nombre y el 409 de esta tabla. Aprobado por Martina.
