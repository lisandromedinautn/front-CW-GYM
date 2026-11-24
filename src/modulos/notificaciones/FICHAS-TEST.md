# Fichas de test — Notificaciones (front)

Una fila por caso de test. La entrada (acciones de la persona y respuesta de la API) y el esperado (lo que se ve o la request enviada) los **confirma el desarrollador antes** de escribir el test (ver `docs/TESTING.md`). Cambiar "Esperado" requiere que antes haya cambiado la regla en el `CLAUDE.md` del módulo en el back.

## US21 — Bandeja de notificaciones (confirmadas por Ulises el 24/11/2026)

Notificación de referencia (MSW):
- Grave, del alumno Medina, Santiago (`a1`), rutina "Fuerza".
- Inicio `2026-11-24T13:00:00.000Z`, `totalSeries` 5.
- Series por debajo, todas de "lever chest press" con 10 × 30 prescripto:
  - serie 3, realizada 8 × 30;
  - serie 4, realizada 10 × 25;
  - serie 5, sin registrar.
- `percepcion: null`.

| Test (archivo › caso) | Regla | Nivel | Entrada | Esperado | Obtenido (último run) | Fecha |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| `presentacion/bandeja/PaginaNotificaciones.int.test.tsx` › muestra la notificación | RN-NOT-01, 02 | Int | Sesión de Profesor; la API devuelve la notificación de referencia | Se ven "Grave", "Medina, Santiago", "Fuerza", "24/11/2026 10:00" y "Series por debajo: 3 de 5". La serie 3 dice "Prescripto: 10 repeticiones · 30 kg" y "Realizado: 8 repeticiones · 30 kg"; la serie 5, "Realizado: Sin registrar" | = esperado (verde el 24/11/2026) | 24/11/2026 |
| `PaginaNotificaciones.int.test.tsx` › gravedad leve | RN-NOT-02 | Int | La misma notificación con gravedad `leve` | Se ve "Leve" | = esperado (verde el 24/11/2026) | 24/11/2026 |
| `PaginaNotificaciones.int.test.tsx` › no leídas y paginado | RN-NOT-03 | Int | `noLeidas` 2 y `total` 12; se va a la página 2 | "No leídas: 2"; se pide `pagina=2` | = esperado (verde el 24/11/2026) | 24/11/2026 |
| `PaginaNotificaciones.int.test.tsx` › marcar como leída | RN-NOT-04 | Int | Clic en "Marcar como leída"; el `PUT` responde `204` | El botón desaparece y queda "No leídas: 1" | = esperado (verde el 24/11/2026) | 24/11/2026 |
| `PaginaNotificaciones.int.test.tsx` › error al marcar | RN-NOT-04 | Int | El `PUT` responde 404 con `{ codigo, mensaje }` | Un `alert` con el mensaje del back | = esperado (verde el 24/11/2026) | 24/11/2026 |
| `presentacion/contador/ContadorNoLeidas.int.test.tsx` › contador en el menú | RN-UI-NOT-01 | Int | `no-leidas` devuelve `{ cantidad: 2 }`; con reloj falso, a los 60 s devuelve `{ cantidad: 3 }`; en otro caso devuelve `{ cantidad: 0 }` | Enlace del menú "Notificaciones (2)" y luego "Notificaciones (3)"; con 0, solo "Notificaciones" | = esperado (verde el 24/11/2026) | 24/11/2026 |
| `PaginaNotificaciones.int.test.tsx` › enlace a los entrenamientos del alumno | RN-UI-NOT-02 | Int | Clic en "Ver entrenamientos de Medina, Santiago" | Se llega a `/profesor/entrenamientos?alumno=a1`, con el alumno elegido en el selector y sus entrenamientos pedidos | = esperado (verde el 24/11/2026) | 24/11/2026 |
| `e2e/notificaciones/notificacion.e2e.ts` › el profesor ve y marca la notificación | RN-NOT-01 a 04 · RN-UI-NOT-01 | e2e (Playwright) | Por la API: alumno16 vinculado a profesor02, plan de hoy con 2 series y finaliza registrando 1 de 2 por debajo (50%) | profesor02 ve "Notificaciones (1)", abre la bandeja, ve "Grave" y "Series por debajo: 1 de 2", la marca como leída y el menú vuelve a "Notificaciones" | = esperado (verde el 24/11/2026) | 24/11/2026 |
| `dominio/notificacion/notificacion.test.ts` › serie por tiempo sin peso | RN-NOT-01 | Unit | Prescripta `{ repeticiones: null, segundos: 60, pesoKg: null }`, realizada `{ repeticiones: null, segundos: 45, pesoKg: null }` | "60 segundos" y "45 segundos" | = esperado (verde el 24/11/2026) | 24/11/2026 |
| `notificacion.test.ts` › serie de circuito | RN-NOT-01 | Unit | Serie con `numero` 2, `posicion` 2 y nombre "flexiones" | "Vuelta 2 · flexiones" | = esperado (verde el 24/11/2026) | 24/11/2026 |
| `notificacion.test.ts` › peso con decimales | RN-NOT-01 | Unit | `{ repeticiones: 10, segundos: null, pesoKg: 30.5 }` | "10 repeticiones · 30,5 kg" | = esperado (verde el 24/11/2026) | 24/11/2026 |

Las tres fichas de `notificacion.test.ts` se agregaron el 24/11/2026, confirmadas por Ulises, para cubrir las ramas del dominio que las fichas de la bandeja no recorrían. Con ellas, la cobertura de ramas de `dominio` volvió de 78,84% al umbral (80,46%). El código ya existía, así que no tuvieron rojo previo: se validaron con mutación.

Comprobación por mutación US21 (24/11/2026). En cada caso se rompió la línea de producción, el test dio rojo y se restauró:

* **Bandeja:**
  * etiqueta Grave → Leve (cae "muestra la notificación");
  * etiqueta Leve → Grave (cae "gravedad leve");
  * `noLeidas - 1` → `noLeidas` (cae "marcar como leída");
  * `pagina` fija en 1 (cae "no leídas y paginado");
  * "Sin registrar" → "-" (cae "muestra la notificación");
  * mensaje del back reemplazado (cae "error al marcar").
* **Contador:**
  * intervalo de 60 s → 120 s (cae el paso de 2 a 3);
  * `cantidad > 0` → `> 2` (no se muestra con 2);
  * `cantidad > 0` → `>= 0` (cae "con 0").
* **Enlace:** la página de US18 ignora `?alumno` (cae el enlace).
* **e2e:** sin `avisarCambioNoLeidas()` al marcar. El menú sigue en "Notificaciones (1)" y cae.
* **Dominio:** "segundos" → "s", sin coma decimal y "Vuelta" → "Serie" (caen los tres casos de `notificacion.test.ts`).

El e2e de navegador primero dio rojo en el último paso, porque el contador solo se actualizaba cada 60 s. Se agregó el aviso interno del módulo (`aplicacion/cambios-no-leidas.ts`).

## US17 — Percepción en la notificación (confirmadas por Ulises el 24/11/2026)

| Test (archivo › caso) | Regla | Nivel | Entrada | Esperado | Obtenido (último run) | Fecha |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| `presentacion/bandeja/PaginaNotificaciones.int.test.tsx` › (`describe` nuevo) muestra la percepción | RN-NOT-05 | Int | La notificación de referencia con `percepcion: { rpe: 10, sensacionFuerza: 1 }` | Se ve "RPE: 10 · Sensación de fuerza: 1" | | 24/11/2026 |
| `PaginaNotificaciones.int.test.tsx` › (mismo `describe`) solo por percepción | RN-NOT-06 | Int | Notificación Grave con `seriesPorDebajo: []` y `percepcion: { rpe: 10, sensacionFuerza: 1 }` | Se ven "Percepción mala" y "RPE: 10 · Sensación de fuerza: 1"; no aparece "Series por debajo" | | 24/11/2026 |
