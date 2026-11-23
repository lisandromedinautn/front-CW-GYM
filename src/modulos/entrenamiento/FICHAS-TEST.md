# Fichas de test — Entrenamiento (front)

Una fila por caso de test. La entrada (acciones de la persona y respuesta de la API) y el esperado (lo que se ve o la request enviada) los **confirma el desarrollador antes** de escribir el test (ver `docs/TESTING.md`). Cambiar "Esperado" requiere que antes haya cambiado la regla.

| Test (archivo › caso) | Regla | Nivel | Entrada | Esperado | Obtenido (último run) | Fecha |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| `entrenamiento.int.test.tsx` › inicia y recarga | RN-ENT-01, 02 · RN-UI-ENT-02 | Int | Rutina de hoy; iniciar a las 23:59 UTC y abrir de nuevo 42 segundos después | Contador `00:00:42` basado en el mismo inicio, antes y después de recargar | ✅ | 20/11/2026 |
| `entrenamiento.int.test.tsx` › abandono y nuevo día | RN-ENT-01 · RN-UI-ENT-02 | Int | API devuelve un abandono anterior y hay rutina hoy | Inicio disponible; detalle `Abandonado` sin contador | ✅ | 20/11/2026 |
| `entrenamiento.int.test.tsx` › retomar en lugar de iniciar | RN-ENT-01 · RN-UI-ENT-02 | Int | Ya hay un entrenamiento en curso hoy | Enlace `Retomar entrenamiento`, sin botón de inicio | ✅ | 20/11/2026 |
| `entrenamiento.int.test.tsx` › descanso | RN-ENT-01 | Int | La rutina del día indica descanso | No hay botón de inicio | ✅ | 20/11/2026 |
| `entrenamiento.int.test.tsx` › sin-plan | RN-ENT-01 | Int | No hay plan vigente | No hay botón de inicio | ✅ | 20/11/2026 |
| `serie.test.ts` › medidas válidas | RN-ENT-03 | Unit | Repeticiones `8` y `0`; segundos `25` | Válida: 8, 0 y 25 | ✅ | 22/11/2026 |
| `serie.test.ts` › medidas inválidas | RN-ENT-03 | Unit | `-1`, `2.5` y vacío | `Ingresá un número entero de 0 o más.` | ✅ | 22/11/2026 |
| `serie.test.ts` › peso | RN-ENT-03 | Unit | Peso `22.5`, vacío y `-1` | 22,5 kg; sin peso; `Ingresá un peso de 0 o más.` | ✅ | 22/11/2026 |
| `RegistrarSerie.int.test.tsx` › muestra lo prescripto | RN-ENT-03 | Int | Rutina "Fuerza": circuito `orden 1` (2 vueltas: Plancha 30 s, Press 8 reps) y bloque `orden 2` (Press, 3 series, 10 reps, 30 kg) | Serie 3 del bloque: `10 repeticiones · 30 kg`; vuelta 2, Plancha: `30 s` | ✅ | 22/11/2026 |
| `RegistrarSerie.int.test.tsx` › registra una serie de bloque | RN-ENT-03 · RN-UI-ENT-01 | Int | Serie 3 del bloque: 8 repeticiones, 30 kg, un clic en Registrar | `POST .../ent-1/series` con `{orden:2, numero:3, repeticiones:8, pesoKg:30}`; la fila muestra `Registrada: 8 repeticiones · 30 kg` sin otra confirmación | ✅ | 22/11/2026 |
| `RegistrarSerie.int.test.tsx` › registra una vuelta de circuito | RN-ENT-03 | Int | Vuelta 2, Plancha: 25 s, Registrar | `{orden:1, numero:2, posicion:1, segundos:25}` | ✅ | 22/11/2026 |
| `RegistrarSerie.int.test.tsx` › corrige una serie registrada | RN-ENT-03 | Int | Serie 3 ya registrada con 8; se registra con 9 | Misma clave con `repeticiones:9`; la fila muestra `Registrada: 9 repeticiones · 30 kg` | ✅ | 22/11/2026 |
| `RegistrarSerie.int.test.tsx` › retoma las series registradas | RN-UI-ENT-02 | Int | El GET trae registrada la serie 3 del bloque con 8 reps y 30 kg | Esa fila muestra `Registrada: 8 repeticiones · 30 kg` | ✅ | 22/11/2026 |
| `RegistrarSerie.int.test.tsx` › no envía una medida inválida | RN-ENT-03 | Int | Repeticiones vacías en la serie 1, Registrar | Ninguna request; el campo queda `aria-invalid` con `Ingresá un número entero de 0 o más.` | ✅ | 22/11/2026 |
| `RegistrarSerie.int.test.tsx` › abandonado sin registro | RN-ENT-20 · RN-ENT-04 | Int | Entrenamiento abandonado con la serie 3 del bloque registrada | Se ven la rutina y `Registrada: 8 repeticiones · 30 kg`; no hay botones Registrar | ✅ | 22/11/2026 |
| `RegistrarSerie.int.test.tsx` › abandono al registrar | RN-ENT-20 | Int | En curso; el POST responde `409 { codigo: "RN-ENT-20", mensaje: "El entrenamiento quedó abandonado" }` | Alerta con ese mensaje y ya no hay botones Registrar | ✅ | 22/11/2026 |
