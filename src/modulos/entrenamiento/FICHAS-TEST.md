# Fichas de test — Entrenamiento (front)

Una fila por caso de test. La entrada (acciones de la persona y respuesta de la API) y el esperado (lo que se ve o la request enviada) los **confirma el desarrollador antes** de escribir el test (ver `docs/TESTING.md`). Cambiar "Esperado" requiere que antes haya cambiado la regla.

| Test (archivo › caso) | Regla | Nivel | Entrada | Esperado | Obtenido (último run) | Fecha |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| `entrenamiento.int.test.tsx` › inicia y recarga | RN-ENT-01, 02 · RN-UI-ENT-02 | Int | Rutina de hoy; iniciar a las 23:59 UTC y abrir de nuevo 42 segundos después | Contador `00:00:42` basado en el mismo inicio, antes y después de recargar | ✅ | 20/11/2026 |
| `entrenamiento.int.test.tsx` › abandono y nuevo día | RN-ENT-01 · RN-UI-ENT-02 | Int | API devuelve un abandono anterior y hay rutina hoy | Inicio disponible; detalle `Abandonado` sin contador | ✅ | 20/11/2026 |
| `entrenamiento.int.test.tsx` › retomar en lugar de iniciar | RN-ENT-01 · RN-UI-ENT-02 | Int | Ya hay un entrenamiento en curso hoy | Enlace `Retomar entrenamiento`, sin botón de inicio | ✅ | 20/11/2026 |
| `entrenamiento.int.test.tsx` › descanso | RN-ENT-01 | Int | La rutina del día indica descanso | No hay botón de inicio | ✅ | 20/11/2026 |
| `entrenamiento.int.test.tsx` › sin-plan | RN-ENT-01 | Int | No hay plan vigente | No hay botón de inicio | ✅ | 20/11/2026 |

## US15 — Finalizar y mostrar resumen

| Test (archivo › caso) | RN | Nivel | Entrada | Esperado | Obtenido (último run) | Fecha |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| `finalizar-entrenamiento/PaginaResumenEntrenamiento.int.test.tsx` › finaliza sin series | RN-ENT-05, 06, 09, 17 | Integración | entrenamiento en curso sin series; finalización 30 minutos | muestra 0 kg, 30 minutos y sin grupos | = esperado (laptop) | 22/11/2026 |
| `finalizar-entrenamiento/ResumenPersistido.int.test.tsx` › muestra resumen y conserva al recargar | RN-ENT-05, 06, 09, 17 | Integración | resumen 540 kg, Espalda y Brazos | muestra volumen, grupos y duración después de recargar | = esperado (laptop) | 22/11/2026 |
| `finalizar-entrenamiento/ResumenPersistido.int.test.tsx` › error y acceso sin sesión | RN-ENT-19, 20 | Integración | error de finalización y alumno sin sesión | muestra error y protege la ruta | = esperado (laptop) | 22/11/2026 |

Comprobación por mutación US15: el cálculo de peso corporal con carga extra y la visualización de 540 kg fallaron al alterarse; se restauraron los archivos con las mismas huellas que las versiones aprobadas.
