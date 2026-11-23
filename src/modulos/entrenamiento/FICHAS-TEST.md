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
| `RegistrarSerie.int.test.tsx` › abre en el primer paso | RN-UI-ENT-03 | Int | Rutina "Fuerza" (circuito `orden 1`: 2 vueltas de Plancha 30 s y Press 8 reps; bloque `orden 2`: Press, 3 series, 10 reps, 30 kg), en curso y sin series | `Paso 1 de 7`, `Vuelta 1 · weighted front plank`, `Prescripto: 30 s`, contador visible; ningún otro paso a la vista | ✅ | 22/11/2026 |
| `RegistrarSerie.int.test.tsx` › registrar avanza al paso siguiente | RN-ENT-03 · RN-UI-ENT-01 · RN-UI-ENT-03 | Int | Paso 1: 25 s y Registrar | `POST .../ent-1/series` con `{orden:1, numero:1, posicion:1, segundos:25}`; pasa a `Paso 2 de 7`, `Vuelta 1 · lever chest press`, `Prescripto: 8 repeticiones` | ✅ | 22/11/2026 |
| `RegistrarSerie.int.test.tsx` › retoma en el primer paso sin registrar | RN-ENT-03 · RN-UI-ENT-02 | Int | Pasos 1 a 6 registrados; 8 reps y Registrar | Abre en `Paso 7 de 7`, `Serie 3 · lever chest press`, `Prescripto: 10 repeticiones · 30 kg`; envía `{orden:2, numero:3, repeticiones:8, pesoKg:30}` y muestra `Registrada: 8 repeticiones · 30 kg` | ✅ | 22/11/2026 |
| `RegistrarSerie.int.test.tsx` › corrige con Anterior | RN-ENT-03 · RN-UI-ENT-03 | Int | Paso 1 registrado con 25 s (abre en el paso 2); Anterior, 20 s y Registrar | En el paso 1 se ve `Registrada: 25 s`; envía `{orden:1, numero:1, posicion:1, segundos:20}` y vuelve a `Paso 2 de 7` | ✅ | 22/11/2026 |
| `RegistrarSerie.int.test.tsx` › Siguiente no registra | RN-UI-ENT-03 | Int | Paso 1 y Siguiente | `Paso 2 de 7` sin ninguna request | ✅ | 22/11/2026 |
| `RegistrarSerie.int.test.tsx` › no envía una medida inválida | RN-ENT-03 | Int | Paso 1 con Segundos vacío y Registrar | Ninguna request; el campo `aria-invalid` con `Ingresá un número entero de 0 o más.`; sigue en `Paso 1 de 7` | ✅ | 22/11/2026 |
| `RegistrarSerie.int.test.tsx` › abandonado sin registro | RN-ENT-20 · RN-ENT-04 | Int | Entrenamiento abandonado con la serie 3 del bloque registrada | Se ven la rutina y `Registrada: 8 repeticiones · 30 kg`; no hay botones Registrar | ✅ | 22/11/2026 |
| `RegistrarSerie.int.test.tsx` › abandono al registrar | RN-ENT-20 | Int | En curso; en el paso 1 el POST responde `409 { codigo: "RN-ENT-20", mensaje: "El entrenamiento quedó abandonado" }` | Alerta con ese mensaje y ya no hay botones Registrar | ✅ | 22/11/2026 |
| `RegistrarSerie.int.test.tsx` › muestra el GIF del paso | RN-UI-ENT-03 | Int | El paso 1 trae `urlGif` `https://gifs.test/plancha.gif` | Imagen con alt `weighted front plank` y esa URL, y el texto `GIF © Gym visual` | ✅ | 22/11/2026 |
| `RegistrarSerie.int.test.tsx` › sin GIF no hay imagen | RN-UI-ENT-03 | Int | El paso 1 sin `urlGif` (entrenamiento iniciado antes de T14) | No hay imagen en el paso | ✅ | 22/11/2026 |
| `entrenamientosDeAlumnos.test.ts` › fecha y hora de Argentina | RN-UI-ENT-04 | Unit | `fechaHora("2026-11-20T23:59:00.000Z")` | `20/11/2026 20:59` | ✅ | 23/11/2026 |
| `PaginaEntrenamientosDeAlumnos.int.test.tsx` › sin alumno elegido | RN-UI-ENT-04 | Int | Abrir `/profesor/entrenamientos` | Selector con "López, Sofía" y "Pérez, Martín"; texto `Elegí un alumno para ver sus entrenamientos.`; ningún pedido de entrenamientos | ✅ | 23/11/2026 |
| `PaginaEntrenamientosDeAlumnos.int.test.tsx` › lista del más nuevo al más viejo | RN-ENT-18 · RN-UI-ENT-04 | Int | Alumnos Pérez, Martín (`a1`) y López, Sofía (`a2`); de Pérez: `e2` 21/11 13:00 UTC en curso, rutina "Fuerza" (7 pasos), 80 kg, serie 3 del bloque con 8 reps y 30 kg (prescripto 10 reps y 30 kg); `e1` 20/11 23:59 UTC abandonado, sin series; elegir Pérez | Pide `/entrenamiento/alumnos/a1/entrenamientos?pagina=1&tamanio=10`; primero `21/11/2026 10:00 · Fuerza · En curso`, después `20/11/2026 20:59 · Fuerza · Abandonado` | ✅ | 23/11/2026 |
| `PaginaEntrenamientosDeAlumnos.int.test.tsx` › series junto a lo prescripto | RN-ENT-03 · RN-UI-ENT-04 | Int | Igual | En `e2`: `Peso del día: 80 kg`, `Series registradas: 1 de 7`, `Serie 3 · lever chest press`, `Prescripto: 10 repeticiones · 30 kg`, `Realizado: 8 repeticiones · 30 kg`; en `e1`: `Sin series registradas` | ✅ | 23/11/2026 |
| `PaginaEntrenamientosDeAlumnos.int.test.tsx` › paginación y cambio de alumno | RN-UI-LIS-03 | Int | 12 entrenamientos, 10 por página; Siguiente; después elegir López | `Página 1 de 2`; pide `pagina=2`; al cambiar de alumno pide `a2` con `pagina=1` | ✅ | 23/11/2026 |
| `PaginaEntrenamientosDeAlumnos.int.test.tsx` › error RN-ENT-18 | RN-ENT-18 | Int | El GET responde `403 { codigo: "RN-ENT-18", mensaje: "Solo podés ver los entrenamientos de tus alumnos" }` | Alerta con ese mensaje | ✅ | 23/11/2026 |
| `PaginaEntrenamientosDeAlumnos.int.test.tsx` › alumno sin entrenamientos | RN-UI-ENT-04 | Int | `items: []`, `total: 0` | `Este alumno todavía no tiene entrenamientos.` | ✅ | 23/11/2026 |
| `PaginaEntrenamientosDeAlumnos.int.test.tsx` › sin alumnos vinculados | RN-UI-ENT-04 | Int | `GET /identidad/alumnos` responde `[]` | `Todavía no tenés alumnos vinculados.`; no hay selector | ✅ | 23/11/2026 |
| `PaginaEntrenamientosDeAlumnos.int.test.tsx` › opción del menú | RN-UI-IDE-01 | Int | Sesión de Profesor | Link `Entrenamientos` que lleva a `/profesor/entrenamientos` | ✅ | 23/11/2026 |

## US15 — Finalizar y mostrar resumen

| Test (archivo › caso) | Regla | Nivel | Entrada | Esperado | Obtenido (último run) | Fecha |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| `finalizar-entrenamiento/PaginaResumenEntrenamiento.int.test.tsx` › finaliza sin series | RN-ENT-05, 06, 09, 17 | Integración | entrenamiento en curso sin series; finalización 30 minutos | muestra 0 kg, 30 minutos y sin grupos | = esperado (laptop) | 22/11/2026 |
| `finalizar-entrenamiento/ResumenPersistido.int.test.tsx` › muestra resumen y conserva al recargar | RN-ENT-05, 06, 09, 17 | Integración | resumen 540 kg, Espalda y Brazos | muestra volumen, grupos y duración después de recargar | = esperado (laptop) | 22/11/2026 |
| `finalizar-entrenamiento/ResumenPersistido.int.test.tsx` › error y acceso sin sesión | RN-ENT-19, 20 | Integración | error de finalización y alumno sin sesión | muestra error y protege la ruta | = esperado (laptop) | 22/11/2026 |

23/11/2026: las dos pruebas que finalizan (`finaliza sin series` y `error`) pasan a usar una rutina con un bloque de una serie, porque «Finalizar entrenamiento» está solo en el último paso. Cambia solo la entrada (la rutina falsa); los esperados siguen iguales. Aprobado por Ulises.

Comprobación por mutación US15: el cálculo de peso corporal con carga extra y la visualización de 540 kg fallaron al alterarse; se restauraron los archivos con las mismas huellas que las versiones aprobadas.
## T15 — e2e de navegador (confirmadas por Ulises el 23/11/2026)

Rutina de prueba: un bloque de lever chest press, 2 series de 10 repeticiones con 30 kg (2 pasos). Volumen esperado según RN-ENT-06 y 07: 30 × 10 × 2 = 600 kg.

| Test (archivo › caso) | Regla | Nivel | Entrada | Esperado | Obtenido (último run) | Fecha |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| `e2e/entrenamiento/entrenar.e2e.ts` › iniciar y registrar | RN-ENT-01, 02, 03, RN-UI-ENT-03 | e2e navegador | alumno14 con plan de hoy (por API) toca "Iniciar entrenamiento" y "Registrar" en el paso 1 | contador visible y "Paso 2 de 2" | = esperado | 23/11/2026 |
| `e2e/entrenamiento/entrenar.e2e.ts` › recargar retoma | RN-UI-ENT-02 | e2e navegador | recarga la página | sigue en "Paso 2 de 2"; con "Anterior", el paso 1 muestra "Registrada: 10 repeticiones · 30 kg" | = esperado | 23/11/2026 |
| `e2e/entrenamiento/entrenar.e2e.ts` › finalizar y ver resumen | RN-ENT-05, 06, 17 | e2e navegador | registra el paso 2 y toca "Finalizar entrenamiento" (solo en el último paso) | heading "Resumen del entrenamiento" y "Peso total levantado: 600 kg" | = esperado | 23/11/2026 |
| `e2e/entrenamiento/seguimiento.e2e.ts` › el profesor ve lo registrado | RN-ENT-18, RN-UI-ENT-04 | e2e navegador | alumno15 con plan de hoy inicia y registra la serie 1 por API; profesor03 entra a "Entrenamientos" y elige a alumno15 | tarjeta con "En curso" y "Series registradas: 1 de 2" | = esperado | 23/11/2026 |
