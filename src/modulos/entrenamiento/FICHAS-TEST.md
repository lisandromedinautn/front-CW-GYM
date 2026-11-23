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
