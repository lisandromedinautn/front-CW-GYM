# Módulo Entrenamiento (`entrenamiento`) — front

Ejecución del entrenamiento (iniciar, registrar series y finalizar), resumen con récords, percepción del alumno y seguimiento del profesor. El texto de las reglas RN-ENT está en `../back-CW-GYM/src/modulos/entrenamiento/CLAUDE.md`. **Los cálculos (volumen, carga efectiva, 1RM, récords) los hace el back: el front solo los muestra.**

## Reglas que aplica la UI

| ID | Qué hace la UI | Estado |
| :-- | :-- | :-- |
| RN-ENT-01 | El botón "Iniciar entrenamiento" aparece solo para la rutina de hoy, si no es descanso y si todavía no se entrenó hoy | Vigente |
| RN-ENT-02 | Al iniciar, arranca el contador desde la hora de inicio que devuelve el back | Vigente |
| RN-ENT-03 | Cada serie muestra lo prescripto al lado del campo de lo realizado (repeticiones o tiempo, y peso si corresponde) | Vigente |
| RN-ENT-04 | Con el entrenamiento finalizado, no se pueden registrar series | Vigente |
| RN-ENT-14 | El RPE solo acepta enteros de 1 a 10 | Vigente |
| RN-ENT-15 | La sensación de fuerza solo acepta enteros de 1 a 5 | Vigente |
| RN-ENT-09 | El resumen muestra los grupos de los músculos principal y secundario | Vigente |
| RN-ENT-13 | Solo se anuncian los récords estrictamente mayores; en la primera vez que se hace un ejercicio no se anuncian récords | Vigente |
| RN-ENT-16 | RPE y sensación son opcionales: se pueden cargar en el resumen o más tarde, desde el entrenamiento finalizado | Vigente |
| RN-ENT-17 | El resumen muestra peso total levantado, grupos musculares trabajados, duración y récords batidos | Vigente |
| RN-UI-ENT-01 | Registrar una serie realizada no requiere más de una pantalla ni más de una confirmación (OKR O3: 10 segundos o menos) | Vigente |
| RN-UI-ENT-02 | Si se recarga la página con un entrenamiento en curso del día, se retoma ese entrenamiento. Uno abandonado (RN-ENT-20) se muestra como abandonado | Vigente |

## Pantallas y hooks planificados

| Pantalla (`presentacion/`) | Hook (`aplicacion/`) | US |
| :-- | :-- | :-- |
| `AccionesEntrenamiento.tsx`, `PaginaEntrenamientoEnCurso.tsx` ✅ | `usarIniciarEntrenamiento.ts`, `usarEntrenamientoEnCurso.ts` ✅ | US13 |
| `PaginaEntrenamientoEnCurso.tsx` | `usarRegistrarSerie.ts` | US14 |
| `finalizar-entrenamiento/ResumenEntrenamiento.tsx`, `PaginaEntrenamientoEnCurso.tsx` ✅ | `usarFinalizarEntrenamiento.ts` ✅ | US15 |
| `PaginaEntrenamientosDeAlumnos.tsx` | `usarEntrenamientosDeAlumnos.ts` | US18 |

## Historial de cambios de reglas de UI

| Fecha | Regla | Cambio | Quién lo decidió |
| :-- | :-- | :-- | :-- |
| 01/11/2026 | Todas | Versión inicial | Lisandro |
| 01/11/2026 | RN-ENT-01, 09, 13, 16, RN-UI-ENT-02 | Se reflejan ZG-08 a ZG-12 | Lisandro |

## Decisiones de implementación (CG-46, US13)

* La raíz de rutas compone las acciones de Entrenamiento en «Mi rutina del día» sin que Planificación dependa de otro módulo. Solo hay botón de inicio con rutina disponible y sin entrenamiento en curso.
* `/alumno/entrenamiento` consulta al servidor al abrirse o recargarse. En curso se muestra el contador desde `inicio`; abandonado se muestra sin contador. Desde la rutina del día se puede ver el abandono e iniciar la rutina de hoy si corresponde.

## Decisiones de implementación (US15)

* El entrenamiento en curso ofrece «Finalizar entrenamiento» y presenta volumen, grupos y duración. Sin series informa cero y ningún grupo registrado.
* Al recargar, el estado `finalizado` recupera el resumen guardado. La pantalla de registro de series (US14) y los récords (US16) siguen pendientes.
