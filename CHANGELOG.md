# Changelog — front-CW-GYM

Cambios por versión (decisión 38 de `docs/PLANIFICACION.md`). Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y [versionado semántico](https://semver.org/lang/es/). Front y back publican la misma `MAJOR.MINOR` en cada hito.

Categorías: Agregado, Cambiado, Corregido, Eliminado, Seguridad. Cada entrada cita su tarjeta.

## [Sin publicar]

### Agregado

- US15: finalización del entrenamiento y resumen de volumen, grupos musculares y duración.

- US12: gestión de alumnos de planes vigentes por su profesor, con validaciones de vínculo y plan vigente.

- Listado de planes en `/profesor/planes`: tarjetas con fechas, estado, alumnos y días con rutina o descanso; filtros por estado, alumno y fecha de inicio, "Limpiar filtros" y paginador (RN-PLAN-22, RN-UI-LIS-01 a 04; CG-84, T13).

- Registro de series en `/alumno/entrenamiento`, paso a paso: un paso por serie de bloque o por ejercicio en cada vuelta de circuito, con lo prescripto junto a los campos de lo realizado, precargados con lo prescripto. Registrar (un clic) avanza al paso siguiente; "Anterior" y "Siguiente" permiten corregir o saltear. Valida antes de enviar (medida entera ≥ 0, peso ≥ 0), retoma en el primer paso sin registrar y, si el entrenamiento está abandonado o el back responde `RN-ENT-20`, muestra la lista completa de solo lectura. El contador se ve siempre (RN-ENT-03, 04, 20, RN-UI-ENT-01, 02, 03; CG-52, US14).

- Cada paso del entrenamiento muestra el GIF del ejercicio con la atribución "GIF © Gym visual", si la copia lo trae; los entrenamientos iniciados antes no muestran imagen (RN-UI-ENT-03; CG-85, T14).

- En el último paso del entrenamiento aparece "Finalizar entrenamiento", que cierra el entrenamiento y muestra el resumen (US14, US15).

- Entrenamientos de los alumnos en `/profesor/entrenamientos` (menú "Entrenamientos"): el profesor elige un alumno vinculado y ve sus entrenamientos del más nuevo al más viejo, paginados, con fecha y hora, rutina, estado, peso del día y cada serie realizada junto a lo prescripto (RN-ENT-18, RN-UI-ENT-04, RN-UI-LIS-03; CG-68, US18).

- e2e de navegador de los cuatro flujos del MVP: ingreso y vínculo, plan del día, entrenamiento (iniciar, registrar, retomar y finalizar) y seguimiento del profesor, contra el back de test con la base recién sembrada (CG-86, T15).

### Cambiado

- La creación del plan pasa a `/profesor/planes/nuevo` y se abre con "Nuevo plan" desde el listado; tiene "Volver al listado" (T13).
- Crear plan muestra los 28 días como calendario de 5 semanas, de lunes a domingo; los días fuera del plan aparecen en gris y con blur. En pantallas chicas sigue como lista (T12).

## [1.3.0] — 2026-11-21

Más rutinas e inicio del entrenamiento (fase 3: US09, US10, US20, US11, US13). La fase se terminó el 20/11, dentro del CG Sprint 3.

### Agregado

- Circuitos en el editor de rutina: ejercicios, vueltas y macropausa (RN-PLAN-01, 03, 04; US09).
- Rutina mixta: los bloques y circuitos se pueden mover dentro de la rutina con los botones de orden (RN-PLAN-01; US10).
- Acción "Importar como copia" en el listado de rutinas; vuelve a la primera página para mostrar la copia creada (CG-40, US20).
- Pantalla "Mi plan" en `/alumno/mi-plan`: muestra los 28 días del plan vigente con sus fechas, rutinas o descansos y el detalle desplegable de ejercicios, objetivos y pausas. Se abre desde el menú del Alumno y desde la rutina del día (RN-PLAN-11, 15, 19; US11).
- Pantalla del entrenamiento en curso en `/alumno/entrenamiento`: iniciar el entrenamiento de hoy, retomarlo con contador de duración y ver si quedó abandonado (RN-ENT-01, 02, 20; RN-UI-ENT-02; CG-46, US13).

### Cambiado

- Componente de detalle de rutina reutilizable por las vistas del Alumno; refactor preparatorio de US11, sin cambiar la vista de US08.
- RN-PLAN-08: se elimina la pregunta sobre si una rutina importada modificada es una rutina nueva; se mantiene la copia independiente y la restricción a rutinas propias (CG-40, US20).

## [1.2.0] — 2026-11-21

Planificación básica (fase 2: US06, US07, US08) y las tareas técnicas del sprint 2 (T06 a T10). Se publica el 21/11, al cerrar el CG Sprint 2 en Jira. US06 figura Listo en Jira, pero la edición de rutinas (RN-PLAN-07) todavía no está implementada.

### Agregado

- Editor de rutina por bloques en `/profesor/rutinas` (menú "Rutinas"): ejercicios del catálogo, series, objetivos y pausas (RN-PLAN-01, 02, 04, 05, 06; US06).
- Listado de rutinas paginado con acción para renombrar (RN-PLAN-21; T08, T09).
- Lista de ejercicios paginada con GIF, buscador y filtros por atributo (RN-UI-LIS-01 a 04; T06, T07).
- Paginador compartido (Anterior, Siguiente, "Página X de Y" y "Por página") y hook `usarTamanioPagina` (T06).
- Pantalla "Mi rutina del día" en `/alumno/rutina-del-dia`: muestra fecha, día del plan, ejercicios, series o vueltas, objetivos, peso y pausas; informa los días de descanso y la ausencia de plan vigente (RN-PLAN-11, 15, 18; US08).
- Pantalla "Nuevo plan" en `/profesor/planes`: el profesor elige la fecha de inicio (el fin se calcula solo), asigna una rutina o descanso a cada uno de los 28 días y selecciona los alumnos vinculados (US07).
- Opción "Planes" en el menú del Profesor.
- Helpers de fechas y contrato del plan en `dominio/plan/plan.ts`, y hooks `usarCrearPlan` y `usarDatosParaPlan` (US07).

### Cambiado

- Métricas del sprint 2 al 14/11: US06 parcial, 26 puntos técnicos del sprint y 52/129 acumulados; residual V2 de 91 puntos con cierre explícito y pronósticos por capacidad. Se conserva la base histórica y se retiran como medición las horas inferidas de commits. Informe en `docs/METRICAS-SPRINT-2.md`.
- Sprints de Jira alineados al calendario el 21/11: Sprint 2 cerrado, Sprint 3 activo y Sprint 4 creado; patrones de diseño aplicados relevados en `docs/PATRONES.md` (T11).

## [1.1.0] — 2026-11-08

Ingreso al sistema con roles, catálogo de ejercicios por dataset, alta de profesores, semilla de usuarios, código de profesor y vínculo alumno-profesor (fase 1: US00, T01, US02, US04, US05; T04 y T05 de planificación).

### Agregado

- Pantalla de ingreso con email y contraseña, que guarda la sesión y lleva al inicio de cada rol (US00).
- Pantalla de alta de profesor, con validación de campos obligatorios y los errores de unicidad del back (US02).
- Pantalla "Mi código de profesor" para generar, copiar y regenerar el código, con confirmación previa (US04).
- Pantalla "Vincularme con mi profesor" para que el alumno se vincule con el código de su profesor (US05).
- Lista de ejercicios con búsqueda por nombre, detalle con GIF y atribución, y botón "Registrar ejercicio" deshabilitado (T01, DT-06).
- Almacén de la sesión en `localStorage`, con suscripción para que menú y rutas reaccionen al cambio (US00).
- Cliente HTTP base que traduce los errores del back a `ErrorApi` y cierra la sesión ante un 401 (US00).
- Tipos `Sesion`, `Rol` y `RUTA_INICIO` por rol (US00).
- Contrato de error `ErrorApi` con `esErrorApi` (US00).
- Opciones del menú por rol (US00).
- Hook `usarSesion` sobre `useSyncExternalStore` (US00).
- Ruta protegida por rol: sin sesión lleva al ingreso, con otro rol muestra "sin acceso" (US00).
- Menú principal por rol con "Salir" (US00).
- Layout con menú para las rutas por rol, `DisenioConMenu` (US00).
- Pantalla de inicio por rol, `PaginaInicio` (US00).
- Pantalla "Próximamente" para las rutas que todavía no tienen página (US00).

## [1.0.0] — 2026-11-02

Base técnica (fase 0). Todavía no hay pantallas de negocio.

### Agregado

- Proyecto React 19 + Vite 8 con TypeScript 6 y Node 24 LTS, con las carpetas por módulo y capa (T02).
- Vitest + Testing Library con umbrales de cobertura (dominio 80%, resto 70%) y red falsa con MSW 3, que rechaza toda request sin respuesta declarada (T02).
- Playwright configurado para los e2e de navegador en `e2e/` (T02).
- ESLint con las reglas de capas del `CLAUDE.md` (sin `fetch` fuera de infraestructura, dominio sin React, sin interior de otros módulos) y la prohibición de `only`/`skip`/`todo`; Prettier (T02).
- Hooks de git: el pre-commit corre lint, formato, tests relacionados y la verificación de paquetes; el commit-msg valida el formato de la decisión 37 (T02).
- Verificación de la regla de las 24 h sobre dependencias directas y transitivas (`yarn verificar:paquetes`) (T02).
- Documentación: planificación v3, plan de implementación por fases, microcommits y versionado (T03).

### Seguridad

- `semver` (6 y 7), `baseline-browser-mapping` y `electron-to-chromium` llegaron como transitivas con versiones publicadas hacía menos de 24 h; se fijaron con `resolutions` en la versión anterior (T02).
- Playwright 1.64.1: se verificó antes de instalar que no tiene avisos de seguridad (GHSA-7mvr-c777-76hp afecta a versiones anteriores a la 1.55.1) (T02).
- Riesgo aceptado: `yarn audit` informa una vulnerabilidad moderada en `minimatch@10.2.6` (denegación de servicio por patrones de glob; se corrige recién en la 11). Solo la usan ESLint y typescript-eslint sobre patrones propios. Se revisa cuando pasen a `minimatch` 11 (T02).
