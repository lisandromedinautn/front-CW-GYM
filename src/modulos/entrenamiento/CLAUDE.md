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
| RN-ENT-16 | RPE y sensación son opcionales y no se piden para finalizar. En el resumen del entrenamiento finalizado (al finalizar o al volver más tarde) hay un formulario con los dos campos, obligatorios, y el botón "Guardar percepción". Se guardan una sola vez: después se muestran como texto ("RPE: 9 · Sensación de fuerza: 2") y el formulario no aparece. Un error del back (`RN-ENT-14`, `15` o `16`) se muestra con su mensaje | Vigente |
| RN-ENT-17 | El resumen muestra peso total levantado, grupos musculares trabajados, duración y récords batidos | Vigente |
| RN-UI-ENT-01 | Registrar una serie realizada no requiere más de una pantalla ni más de una confirmación (OKR O3: 10 segundos o menos) | Vigente |
| RN-UI-ENT-02 | Si se recarga la página con un entrenamiento en curso del día, se retoma ese entrenamiento. Uno abandonado (RN-ENT-20) se muestra como abandonado | Vigente |
| RN-UI-ENT-03 | Durante el entrenamiento en curso se muestra un paso por vez (una serie de bloque o un ejercicio en una vuelta de circuito), con el GIF del ejercicio y su atribución si lo tiene. Registrar avanza al paso siguiente; "Anterior" y "Siguiente" mueven sin registrar. El contador está siempre visible | Vigente |
| RN-ENT-18 | El profesor solo elige entre sus alumnos vinculados; si el back responde `RN-ENT-18`, se muestra su mensaje | Vigente |
| RN-UI-ENT-04 | El profesor elige uno de sus alumnos vinculados y ve sus entrenamientos del más nuevo al más viejo, paginados, cada uno con fecha y hora de inicio (hora de Argentina), rutina, estado, peso del día, cuántas series registró sobre el total y cada serie realizada junto a lo prescripto. En un entrenamiento finalizado con percepción, también "RPE: N · Sensación de fuerza: N" (US17) | Vigente |

## Pantallas y hooks planificados

| Pantalla (`presentacion/`) | Hook (`aplicacion/`) | US |
| :-- | :-- | :-- |
| `AccionesEntrenamiento.tsx`, `PaginaEntrenamientoEnCurso.tsx` ✅ | `usarIniciarEntrenamiento.ts`, `usarEntrenamientoEnCurso.ts` ✅ | US13 |
| `AccionesEntrenamiento.tsx`, `PaginaEntrenamientoEnCurso.tsx` ✅ | `usarIniciarEntrenamiento.ts`, `usarEntrenamientoEnCurso.ts` ✅ | US13 |
| `PaginaEntrenamientoEnCurso.tsx`, `ListaSeries.tsx` ✅ | `usarRegistrarSerie.ts` ✅ | US14 |
| `finalizar-entrenamiento/ResumenEntrenamiento.tsx`, `PaginaEntrenamientoEnCurso.tsx` ✅ | `usarFinalizarEntrenamiento.ts` ✅ | US15 |
| `PaginaEntrenamientoEnCurso.tsx` y `finalizar-entrenamiento/PercepcionDelResumen.tsx` ✅ (percepción en el resumen; récords con US16) | `registrar-percepcion/usarRegistrarPercepcion.ts` ✅ | US16, US17 |
| `PaginaEntrenamientosDeAlumnos.tsx` ✅ | `usarEntrenamientosDeAlumnos.ts` ✅ | US18 |

## Historial de cambios de reglas de UI

| Fecha | Regla | Cambio | Quién lo decidió |
| :-- | :-- | :-- | :-- |
| 01/11/2026 | Todas | Versión inicial | Lisandro |
| 01/11/2026 | RN-ENT-01, 09, 13, 16, RN-UI-ENT-02 | Se reflejan ZG-08 a ZG-12 | Lisandro |
| 23/11/2026 | RN-ENT-18 (UI) y nueva RN-UI-ENT-04 | Consulta de entrenamientos de alumnos (US18) | Ulises |
| 22/11/2026 | Nueva RN-UI-ENT-03 | Registro paso a paso con GIF y contador siempre visible (US14, T14) | Ulises |
| 24/11/2026 | RN-ENT-16 (UI) y RN-UI-ENT-04 | La percepción se carga una sola vez, con los dos campos obligatorios, desde el resumen; el profesor la ve en los entrenamientos de alumnos (US17, decisión 46) | Ulises |

## Decisiones de implementación (CG-46, US13)

* La raíz de rutas compone las acciones de Entrenamiento en «Mi rutina del día» sin que Planificación dependa de otro módulo. Solo hay botón de inicio con rutina disponible y sin entrenamiento en curso.
* `/alumno/entrenamiento` consulta al servidor al abrirse o recargarse. En curso se muestra el contador desde `inicio`; abandonado se muestra sin contador. Desde la rutina del día se puede ver el abandono e iniciar la rutina de hoy si corresponde.

## Decisiones de implementación (CG-52, US14)

Decididas por Ulises el 22/11/2026.

* El registro vive en `/alumno/entrenamiento`, debajo del contador, que se ve siempre. Es paso a paso (RN-UI-ENT-03, decidido por Ulises el 22/11): los pasos siguen el `orden` de la rutina, uno por serie de bloque ("Serie N") y uno por ejercicio en cada vuelta de circuito ("Vuelta N") (`dominio/serie/filasSeries.ts`). Al abrir o retomar se arranca en el primer paso sin registrar, o en el último si ya están todos. Registrar avanza al siguiente; "Anterior" y "Siguiente" mueven sin registrar (`PasoActual.tsx`, `FormularioSerie.tsx`).
* Los campos vienen precargados con lo prescripto, o con lo ya registrado si la serie se registró antes: si el alumno hizo lo indicado, alcanza con un clic en "Registrar" (RN-UI-ENT-01, OKR O3). No hay diálogo de confirmación.
* El campo de peso solo aparece si la serie prescripta tiene peso ("y peso si corresponde", RN-ENT-03). El back igual lo acepta en cualquier serie.
* Antes de enviar se valida lo mismo que el back (`dominio/serie/serie.ts`): medida entera ≥ 0 obligatoria y peso ≥ 0 opcional. El error se enlaza al campo con `aria-invalid` y `aria-describedby`.
* Registrar otra vez la misma serie la corrige: se vuelve con "Anterior", se envía la misma clave (`orden`, `numero`, `posicion`) y el paso muestra la respuesta del back.
* Abandonado (al abrir, o porque el back responde `409 RN-ENT-20` al registrar): se muestra el mensaje del back y, en lugar del paso a paso, la lista completa de solo lectura con las series ya registradas (`ListaSeries.tsx`). RN-ENT-04 (finalizado) se suma con US15.
* "Finalizar entrenamiento" aparece **solo en el último paso** (decidido por Ulises el 22/11/2026). Hasta US15 estuvo deshabilitado; desde el 23/11 llama a la finalización (ver US15).
* El tipo `Entrenamiento` del front tolera `rutina` sin `bloques` o `circuitos` y la ausencia de `series`, porque las respuestas falsas de los tests de US13 no los traen.

## Decisiones de implementación (CG-85, T14)

* Cada paso muestra el GIF del ejercicio (`urlGif` de la copia, que el back guarda desde T14) con la atribución "GIF © Gym visual", la de todo el dataset. Si la copia no trae `urlGif` (entrenamiento iniciado antes de T14) no se muestra imagen.

## Decisiones de implementación (US15)

* El entrenamiento en curso ofrece «Finalizar entrenamiento» en el último paso (`PasoActual.tsx`; antes había un segundo botón visible desde el paso 1, que se quitó el 23/11/2026 por decisión de Ulises) y presenta volumen, grupos y duración. Sin series informa cero y ningún grupo registrado.
* Al recargar, el estado `finalizado` recupera el resumen guardado.
* El resumen vive dentro de `PaginaEntrenamientoEnCurso.tsx` (no en una página aparte): el mismo contenedor muestra el entrenamiento en curso y, al finalizar, el resumen con su estado persistido.
* Los récords (US16) y la percepción (US17) se suman al mismo resumen; hoy no se muestran.

## Decisiones de implementación (CG-68, US18)

Decididas por Ulises el 23/11/2026.

* `/profesor/entrenamientos`, con la opción "Entrenamientos" en el menú del Profesor. Arriba, el selector "Alumno" con los alumnos vinculados (`GET /identidad/alumnos`, por apellido); hasta elegir uno no se piden entrenamientos. Sin alumnos vinculados se avisa y no hay selector.
* El cliente propio del módulo llama a `GET /identidad/alumnos` (no se importa Planificación, regla de dependencia 2).
* Cada entrenamiento es una tarjeta: fecha y hora de inicio en hora de Argentina (`America/Argentina/Buenos_Aires`, para que no dependa del navegador), rutina y estado (En curso, Abandonado; Finalizado cuando llegue US15), peso del día, "Series registradas: N de M" (M son los pasos de la copia, como en US14) y cada serie en el orden de la rutina con lo prescripto y lo realizado.
* Paginado con el `Paginador` compartido (10 por defecto, clave `entrenamientos-de-alumnos`). Cambiar de alumno vuelve a la página 1. Sin filtros: el back no los tiene (RN-UI-LIS-04).
* Los errores del back se muestran por su mensaje en un `alert` (por ejemplo `RN-ENT-18`).
* Con US21 (RN-UI-NOT-02, decidido por Ulises el 24/11/2026), la página acepta `?alumno=<id>` y elige ese alumno al abrir, para llegar desde una notificación. Implementado el 24/11 en `usarEntrenamientosDeAlumnos(alumnoInicial)`: solo elige el alumno si está entre los vinculados.

## Decisiones de implementación (CG-62, US17)

Implementado el 24/11/2026.

* **Formulario de percepción** (`finalizar-entrenamiento/PercepcionDelResumen.tsx`): debajo del resumen, con `aria-label` "Percepción del entrenamiento" y los campos "RPE (1 a 10)" y "Sensación de fuerza (1 a 5)".
  * Valida en el dominio antes de enviar (`dominio/percepcion/percepcion.ts`) y no envía nada si hay un error.
  * Los errores se enlazan a cada campo, como en el registro de series.
  * Un error del back se muestra con su mensaje en un `alert`; si no viene del back, dice "No se pudo guardar la percepción".
* **Cuándo aparece el formulario:**
  * Al finalizar en la misma pantalla, el entrenamiento todavía no trae `percepcion`, así que aparece.
  * Al recargar, se ve el texto si la percepción vino cargada, o el formulario si vino en `null`.
* **US18:** la tarjeta de un entrenamiento con percepción muestra "RPE: N · Sensación de fuerza: N".
* **e2e:** el alumno llega al resumen por "Mi rutina del día" y el enlace "Ver resumen del entrenamiento".
