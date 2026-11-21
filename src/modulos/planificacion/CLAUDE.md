# Módulo Planificación (`planificacion`) — front

Editor de rutinas, importación, creación de planes, gestión de alumnos del plan y vistas del alumno (rutina del día y plan completo). El texto de las reglas RN-PLAN está en `../back-CW-GYM/src/modulos/planificacion/CLAUDE.md`.

## Reglas que aplica la UI

| ID | Qué hace la UI | Estado |
| :-- | :-- | :-- |
| RN-PLAN-01 | El editor permite agregar bloques y circuitos en orden. Muestra el tipo de rutina (Bloques, Circuitos, Mixta) derivado, sin dejar elegirlo | Vigente |
| RN-PLAN-02 | Un bloque pide ejercicio, series (≥ 1), micropausa y macropausa | Vigente |
| RN-PLAN-03 | Un circuito pide 2 o más ejercicios, vueltas y macropausa. No muestra micropausa | Vigente |
| RN-PLAN-04 | Según el tipo del ejercicio, se pide repeticiones o tiempo, nunca los dos | Vigente |
| RN-PLAN-05 | El campo peso solo aparece si el tipo de carga incluye Peso Extra, y es opcional | Vigente |
| RN-PLAN-21 | La tarjeta muestra el nombre y un botón de lápiz accesible como "Editar nombre", con edición en el lugar ("Guardar", "Cancelar"). Antes de enviar valida de 1 a 60 caracteres sin contar los extremos ("Completá el nombre", "Máximo 60 caracteres"); "Cancelar" no envía nada y los errores del back (409 por nombre repetido) van en un `alert` | Vigente ✅ |
| RN-PLAN-20 | Antes de enviar, avisa si un circuito repite un ejercicio ("No repitas ejercicios en el circuito") | Vigente |
| RN-PLAN-08 | Solo se listan para importar las rutinas del propio profesor; la importación crea una copia independiente | Vigente |
| RN-PLAN-09 | Al elegir la fecha de inicio, muestra la fecha de fin calculada (inicio + 27) sin permitir editarla | Vigente |
| RN-PLAN-10 | Cada uno de los 28 días se puede marcar como descanso o asignarle una rutina | Vigente |
| RN-PLAN-11 | Cada día muestra su fecha concreta | Vigente |
| RN-PLAN-13, 14 | Solo ofrece alumnos vinculados al profesor; si el back rechaza por plan vigente, muestra el error | Vigente |
| RN-PLAN-16 | Se puede quitar al último alumno de un plan vigente | Vigente |
| RN-PLAN-17 | No hay opción para finalizar un plan antes de tiempo | Vigente |
| RN-PLAN-18 | La rutina del día muestra la rutina con sus ejercicios y objetivos, "Hoy es día de descanso." o "No tenés un plan vigente." | Vigente ✅ |
| RN-PLAN-22 | `/profesor/planes` lista solo los planes del profesor, paginados, con su estado (Próximo, Vigente, Finalizado) y filtros por estado, alumno y rango de fecha de inicio (RN-UI-LIS-01 a 04) | Vigente (T13) |
| RN-PLAN-19 | Mi plan muestra los 28 días ordenados con sus fechas, rutina o descanso y detalle desplegable de ejercicios, objetivos y pausas | Vigente ✅ |

## Pantallas y hooks planificados

| Pantalla (`presentacion/`) | Hook (`aplicacion/`) | US |
| :-- | :-- | :-- |
| `EditorRutina.tsx` (con `EditorBloque.tsx`, `EditorCircuito.tsx`, `BotonesOrden.tsx`, `CamposObjetivo.tsx`, `CampoNumero.tsx` y `edicion.ts`) | `usarCrearRutina.ts` ✅ (US06 bloques, US09 circuitos, US10 mixta), `usarEjerciciosParaRutina.ts` ✅, `usarEditarRutina.ts` 📄 | US06, US09, US10 |
| `PaginaRutinas.tsx` (`consultar-rutinas/`) ✅ | `usarConsultarRutinas.ts` ✅, `usarRenombrarRutina.ts` (`renombrar-rutina/`) ✅ | T06, T08, T09 |
| `PaginaRutinas.tsx` (acción "Importar como copia") | `usarImportarRutina.ts` | US20 ✅ |
| `consultar-planes/PaginaPlanes.tsx` ✅ | `consultar-planes/usarConsultarPlanes.ts` ✅ | T13 |
| `PaginaCrearPlan.tsx` ✅ (`crear-plan/`) | `usarCrearPlan.ts` ✅, `usarDatosParaPlan.ts` ✅ | US07 |
| `PaginaAlumnosDelPlan.tsx` | `usarAlumnosDelPlan.ts` | US12 |
| `rutina-del-dia/PaginaRutinaDelDia.tsx` ✅ | `consultar-rutina-del-dia/usarRutinaDelDia.ts` ✅ | US08 |
| `mi-plan/PaginaMiPlan.tsx` ✅ | `consultar-plan-del-alumno/usarMiPlan.ts` ✅ | US11 |

## Historial de cambios de reglas de UI

| Fecha | Regla | Cambio | Quién lo decidió |
| :-- | :-- | :-- | :-- |
| 01/11/2026 | Todas | Versión inicial | Lisandro |
| 01/11/2026 | RN-PLAN-03, 08, 16, 17 | Se reflejan ZG-06 y ZG-07; se quita US19 | Lisandro |
| 10/11/2026 | RN-PLAN-05 | Se refleja la aclaración del back: el peso es opcional (US06) | Ignacio |
| 10/11/2026 | RN-PLAN-20 | Se refleja la regla nueva del back: un circuito no repite ejercicios (US09) | Ignacio |
| 11/11/2026 | RN-PLAN-21 | Se refleja la regla nueva del back: el nombre de la rutina (1 a 60 caracteres, único por profesor) | Lisandro |
| 13/11/2026 | RN-PLAN-09 a 14, 17 | Se implementa US07: pantalla de crear plan con fecha de fin calculada, 28 días con rutina o descanso y alumnos vinculados | Lisandro |
| 17/11/2026 | RN-PLAN-08 | Se elimina la pregunta sobre si la copia modificada es una rutina nueva (CG-40, US20) | Desarrollador |
| 21/11/2026 | RN-PLAN-22 | Se refleja la regla nueva del back: listado de planes del profesor con estado y filtros (T13) | Lisandro |

## Nota para US12 (Martina): qué cambió con T12 y T13 (21/11/2026)

T12 y T13 (CG-84) ya están en `develop` y cambian la pantalla de planes. Antes de seguir, traé `develop` (`git pull`) y mergealo en tu rama local.

* **`/profesor/planes` ahora es el listado** (`consultar-planes/PaginaPlanes.tsx`). La creación se mudó a `/profesor/planes/nuevo` (`crear-plan/PaginaNuevoPlan.tsx`) y se abre con "Nuevo plan".
* **Dónde enganchar US12**: un botón "Alumnos" en la tarjeta de los planes con estado `vigente` (RN-PLAN-16) que navegue a una subpágina nueva en `SUBPAGINAS` de `src/Aplicacion.tsx`, por ejemplo `'/profesor/planes/:id/alumnos': <PaginaAlumnosDelPlan />`. Las claves de `SUBPAGINAS` son rutas de react-router, así que `:id` se lee con `useParams`.
* **Reutilizable**: `dominio/plan/listadoPlanes.ts` (`ResumenPlan` con `estado` y `alumnoIds`, `etiquetaDeEstado`, `fechaConBarras`), `usarConsultarPlanes` (expone `recargar` y `alumnos`) y `consultarPlanes` en `infraestructura/api/apiPlanificacion.ts`. Los alumnos del profesor ya se piden con `GET /identidad/alumnos`.
* **Archivos con más chance de choque**: `src/Aplicacion.tsx` (rutas), `apiPlanificacion.ts`, `PaginaPlanes.tsx`, `estilos.css` (secciones nuevas de calendario y listado de planes) y `PaginaCrearPlan.tsx` (calendario 7 × 5 y prop `alVolver`).
* **Tests**: el test de US07 ahora entra por `/profesor/planes/nuevo`. Si tu test entra al listado, mockeá `GET /planificacion/planes` como en `PaginaPlanes.int.test.tsx`.
* **Doc compartida**: `docs/TRAZABILIDAD.md`, `CHANGELOG.md`, `DECISIONES-IA.md`, `ATLAS.md`, `FICHAS-TEST.md` y este archivo tienen entradas nuevas: al mergear, conservá las dos.

## Decisiones de implementación (T13)

* `/profesor/planes` muestra `PaginaPlanes`: tarjetas con el mismo estilo que Rutinas ("Del dd/mm/aaaa al dd/mm/aaaa", badge de estado Próximo/Vigente/Finalizado, alumnos por "Apellido, Nombre" o "Sin alumnos", "N días con rutina · M de descanso"). El `<ul aria-label="Planes">` se renderiza siempre que hay respuesta, aunque venga vacío.
* `usarConsultarPlanes` guarda filtros (estado, alumno, inicio desde/hasta) y página; cambiar un filtro vuelve a la página 1 (RN-UI-LIS-03) y "Limpiar filtros" los borra (RN-UI-LIS-01). El cliente `consultarPlanes` arma la query solo con los filtros presentes. Alumnos de `GET /identidad/alumnos`, tamaño con `usarTamanioPagina('planes', 10)`.
* "Nuevo plan" navega a `/profesor/planes/nuevo` (`crear-plan/PaginaNuevoPlan.tsx`), una subpágina propia como `/profesor/rutinas/nueva`. Ahí `PaginaCrearPlan` recibe `alVolver` ("Volver al listado"); al crear se queda en el formulario con el mensaje "Plan creado del … al …". El listado vuelve a pedir los planes al montarse. Decidido por Lisandro el 21/11/2026; por eso el test de US07 entra por `/profesor/planes/nuevo` (cambio aprobado por él, sin tocar aserciones).

## Decisiones de implementación (US20)

* Cada tarjeta de `/profesor/rutinas` ofrece "Importar como copia" mediante un botón de hojas superpuestas junto al nombre, con etiqueta accesible y ayuda al pasar el cursor. Después de importar, se vuelve a la primera página y se recarga el listado.
* La importación se deshabilita mientras hay una solicitud en curso; se informa el resultado o el error. Crear un plan permite seleccionar la copia como cualquier rutina propia.

## Decisiones de implementación (US07)

* La pantalla vivía en `/profesor/planes`. Desde T13 esa ruta es el listado (`PaginaPlanes`) y la creación está en `/profesor/planes/nuevo`, a la que se llega con "Nuevo plan".
* La fecha de inicio arranca en hoy (`hoyIso()`), se elige con un `input type="date"` y la fecha de fin se muestra calculada (inicio + 27) sin editarla. Las fechas se manejan como `AAAA-MM-DD` en UTC (`dominio/plan/plan.ts`), sin depender de la zona del navegador.
* Cada uno de los 28 días tiene un `select` de rutina con la opción "Descanso" (valor vacío, que se envía como `rutinaId: null`). El body manda siempre los 28 días, en orden.
* Los alumnos se piden a `GET /identidad/alumnos` (solo los vinculados al profesor, RN-PLAN-13) y se ordenan por apellido y nombre. Las rutinas se piden con `listarTodasLasRutinas()`, que pagina `GET /planificacion/rutinas` de a 100 hasta traerlas todas.
* Antes de enviar valida en el front: fecha válida ("Elegí una fecha de inicio válida") y al menos un alumno ("Elegí al menos un alumno", RN-PLAN-12). Los rechazos del back (RN-PLAN-08, 13, 14) se muestran con su mensaje en el `alert`.
* No hay botón para finalizar el plan antes de tiempo (RN-PLAN-17).
* Desde el 21/11/2026 (T12, pedido de Lisandro) los 28 días se ven como calendario de 5 semanas, de lunes a domingo (7 × 5). Los días anteriores al inicio y posteriores al fin muestran su fecha en gris y con blur, sin `select` y ocultos para lectores de pantalla. Cada día conserva el texto accesible "Día N — día dd/mm" y la etiqueta "Rutina del día N" (visualmente ocultos), y muestra en pantalla "Día N" y "vie 13/11". Por debajo de 48rem vuelve a una lista sin las celdas de relleno.

## Decisiones de implementación (T06, T08)

* El listado usa el `Paginador` compartido con `usarTamanioPagina('rutinas', 10)`. Se reemplaza el `totalPaginas` propio por el de `compartido/dominio/paginacion`.
* El nombre se edita en el lugar con `PATCH /planificacion/rutinas/:id/nombre`; la tarjeta ya no muestra "Rutina N" sino `rutina.nombre`.

## Decisiones de implementación (US10)

* Bloques y circuitos se pueden mezclar. Se muestran en el orden en que se agregan, y cada uno tiene "Subir" y "Bajar" (deshabilitados en los extremos; no aparecen si hay un solo elemento). Los títulos siguen siendo "Bloque N" y "Circuito N", numerados por tipo en el orden de la rutina. Decidido por Ignacio el 15/11/2026.
* El orden vive en `secuencia` (claves en orden) dentro de `EditorRutina`; `mover` (`dominio/rutina/secuenciaRutina.ts`) hace el intercambio.
* El body manda `orden` (1..N, posición en la rutina) en cada bloque y circuito **solo si la rutina es mixta**. Una rutina solo de bloques o solo de circuitos manda el mismo body que en US06 y US09 (contrato del back de US10).
* El listado de rutinas no cambia: la tarjeta sigue mostrando "1 bloque · 1 circuito" y los ejercicios con bloques primero. Decidido por Ignacio el 15/11/2026.

## Decisiones de implementación (US09)

* "Agregar circuito" suma un circuito que arranca con 2 ejercicios vacíos (el mínimo de RN-PLAN-03). Cada ejercicio va en su propio grupo ("Ejercicio 1", "Ejercicio 2"…) con "Quitar ejercicio", y el circuito tiene "Agregar ejercicio", "Vueltas", "Macropausa (s)" y "Quitar circuito". Decidido por Ignacio el 10/11/2026.
* Hasta US10 (rutina mixta) no se mezclaban: con bloques se deshabilitaba "Agregar circuito", y al revés. US10 quitó esa restricción (15/11/2026).
* Antes de enviar, el circuito avisa "Un circuito necesita 2 o más ejercicios", "Mínimo 1 vuelta" o "No repitas ejercicios en el circuito". Sin bloques ni circuitos avisa "Agregá al menos un bloque o un circuito".
* El body manda solo la lista que tiene contenido: `{ bloques }` o `{ circuitos }` (contrato del back de US06 y US09).
* El editor se partió en `edicion.ts` (estado, validaciones y armado del body), `CampoNumero`, `CamposObjetivo` (compartido por bloques y circuitos), `EditorBloque` y `EditorCircuito`. Los tests de US06 no cambiaron.

## Decisiones de implementación (US06)

* El editor está en `/profesor/rutinas`, con la opción de menú "Rutinas" (pensada para sumar el listado cuando exista el endpoint). Hoy solo crea. Decidido por Ignacio el 10/11/2026.
* El catálogo se pide con un cliente propio (`infraestructura/api/apiPlanificacion.ts`, `GET /catalogo/ejercicios`) reducido a id, nombre, tipo y tipo de carga, porque planificación no importa el módulo catálogo (CLAUDE.md, regla 2).
* Antes de enviar, el editor marca los campos que faltan ("Completá este campo") y las series menores que 1 ("Mínimo 1 serie"). Sin bloques avisa "Agregá al menos un bloque". Los errores del back se muestran con su mensaje en el `alert`.
* El body manda `repeticiones` o `segundos` según el tipo del ejercicio, y `pesoKg` solo si la carga incluye Peso Extra y se completó.
* El e2e de Playwright (`e2e/planificacion/crear-rutina.e2e.ts`) corre contra el back de test: `NODE_ENV=test yarn seed` y `NODE_ENV=test yarn start` en el back, y `E2E_URL_API=http://localhost:3001 yarn test:e2e` en el front.

## Decisiones de implementación (US08)

* La opción «Mi rutina del día» abre `/alumno/rutina-del-dia`, protegida para Alumno por la ruta compartida. `PaginaRutinaDelDia` usa `usarRutinaDelDia`; solo el cliente `apiPlanificacion.ts` hace la petición HTTP.
* La fecha visible y el número de día vienen del back. No se recalcula la vigencia en el navegador ni se envía un alumno por parámetros. El contrato y los textos se encuentran en `dominio/plan/rutinaDelDia.ts`.
* La rutina muestra los ejercicios en orden, sus series o vueltas, repeticiones o segundos, peso y micropausa/macropausa en segundos, incluidos los ceros. Se reutilizan los estilos de tarjetas existentes.
* Se reutilizaron los tests existentes de rutina, descanso, ausencia de plan y error HTTP; se suman fecha, pausas y rutas protegidas con casos confirmados por Martina el 14/11/2026.

## Decisiones de implementación (US11)

* Martina confirmó el 14/11/2026 consultar solo el plan vigente. La opción Mi plan abre `/alumno/mi-plan`, protegida para Alumno. La rutina del día también permite abrir el plan completo mediante un enlace.
* `usarMiPlan` consulta `GET /planificacion/mi-plan` a través del cliente del módulo. No envía parámetros de alumno ni calcula vigencia en el navegador. El contrato `dominio/plan/miPlan.ts` conserva las fechas del back y reutiliza `RutinaDelDiaDetalle`.
* Los días se muestran en el orden recibido, con fechas formateadas por `etiquetaDeFecha`. Una rutina nula se muestra como Descanso. Cada rutina se despliega con `details`/`summary` nativos y reutiliza `DetalleRutina`, con el número de día correspondiente.
* Sin plan vigente se muestra No tenés un plan vigente.; los errores se informan en un alert y la carga tiene un estado accesible.
