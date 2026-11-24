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
| `presentacion/bandeja/PaginaNotificaciones.int.test.tsx` › muestra la notificación | RN-NOT-01, 02 | Int | Sesión de Profesor; la API devuelve la notificación de referencia | Se ven "Grave", "Medina, Santiago", "Fuerza", "24/11/2026 10:00" y "Series por debajo: 3 de 5". La serie 3 dice "Prescripto: 10 repeticiones · 30 kg" y "Realizado: 8 repeticiones · 30 kg"; la serie 5, "Realizado: Sin registrar" | | 24/11/2026 |
| `PaginaNotificaciones.int.test.tsx` › gravedad leve | RN-NOT-02 | Int | La misma notificación con gravedad `leve` | Se ve "Leve" | | 24/11/2026 |
| `PaginaNotificaciones.int.test.tsx` › no leídas y paginado | RN-NOT-03 | Int | `noLeidas` 2 y `total` 12; se va a la página 2 | "No leídas: 2"; se pide `pagina=2` | | 24/11/2026 |
| `PaginaNotificaciones.int.test.tsx` › marcar como leída | RN-NOT-04 | Int | Clic en "Marcar como leída"; el `PUT` responde `204` | El botón desaparece y queda "No leídas: 1" | | 24/11/2026 |
| `PaginaNotificaciones.int.test.tsx` › error al marcar | RN-NOT-04 | Int | El `PUT` responde 404 con `{ codigo, mensaje }` | Un `alert` con el mensaje del back | | 24/11/2026 |
| `presentacion/contador/ContadorNoLeidas.int.test.tsx` › contador en el menú | RN-UI-NOT-01 | Int | `no-leidas` devuelve `{ cantidad: 2 }`; con reloj falso, a los 60 s devuelve `{ cantidad: 3 }`; en otro caso devuelve `{ cantidad: 0 }` | Enlace del menú "Notificaciones (2)" y luego "Notificaciones (3)"; con 0, solo "Notificaciones" | | 24/11/2026 |
| `PaginaNotificaciones.int.test.tsx` › enlace a los entrenamientos del alumno | RN-UI-NOT-02 | Int | Clic en "Ver entrenamientos de Medina, Santiago" | Se llega a `/profesor/entrenamientos?alumno=a1`, con el alumno elegido en el selector y sus entrenamientos pedidos | | 24/11/2026 |
| `e2e/notificaciones/notificacion.e2e.ts` › el profesor ve y marca la notificación | RN-NOT-01 a 04 · RN-UI-NOT-01 | e2e (Playwright) | Por la API: alumno16 vinculado a profesor02, plan de hoy con 2 series y finaliza registrando 1 de 2 por debajo (50%) | profesor02 ve "Notificaciones (1)", abre la bandeja, ve "Grave" y "Series por debajo: 1 de 2", la marca como leída y el menú vuelve a "Notificaciones" | | 24/11/2026 |
