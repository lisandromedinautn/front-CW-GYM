# Auditoría de IA — front-CW-GYM

Registro de cada sesión relevante en la que un desarrollador trabajó con IA. Deja claro qué hizo la IA, qué decidió el desarrollador y qué ideas se descartaron. Si una sesión tocó los dos repos, la entrada va en ambos.

## Formato de entrada

```
## AAAA-MM-DD — <título corto> [<ID tarjeta>]
- Desarrollador: <nombre>
- Herramienta / modelo / esfuerzo: <p. ej. Claude Code · Opus 5.5 medio (orquestador) + Haiku 5.5 low (2 subagentes)>
- Objetivo: <qué se buscaba>
- Qué hizo la IA: <archivos, propuestas, tests>
- Decisiones del desarrollador: <qué eligió y por qué>
- Ideas descartadas: <qué se propuso y no se usó, y por qué>
- Reglas afectadas: <RN-... creadas/cambiadas, o "ninguna">
- Pendientes: <lo que queda abierto>
```

---

## 2026-11-01 — Planificación inicial, convenciones y esqueleto documental [T03]
- Desarrollador: Lisandro
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 (orquestador, sin subagentes)
- Objetivo: actualizar el documento de planificación, fijar las convenciones del proyecto y crear el esqueleto de los dos repos sin código.
- Qué hizo la IA: preguntó 24 dudas de convenciones. Actualizó la planificación en `docs/PLANIFICACION.md` (el Google Doc original no se pudo editar porque no hay conector de Google Docs). Redactó el catálogo de reglas de negocio con IDs en el `CLAUDE.md` de cada módulo, el `CLAUDE.md` global, `ATLAS.md`, `docs/TESTING.md`, `docs/TRAZABILIDAD.md` y `docs/MODELOS-IA.md`. Creó la estructura de carpetas vacía, instaló las skills `tdd` y `coverage` (después de revisar su contenido) y configuró `.claude/settings.json`. Detectó 13 zonas grises (ZG-01 a ZG-13).
- Decisiones del desarrollador: dos repos separados; arquitectura modular sin services, un caso de uso por archivo, entidades ricas y repositorios como puertos; NestJS + TypeORM + Postgres; React + Vite con Vitest; Yarn 1 (no Yarn 4); JWT con guard por rol; todo en español; e2e de API en el back y e2e de navegador con Playwright en el front (se configura al crear la suite); base de test dockerizada independiente; cobertura de dominio 80% y resto 70%; protección de tests por permisos; auditoría en `DECISIONES-IA.md`; Sonnet y Haiku siempre en low, delegación priorizada y confirmada por consola; rutinas sin bloqueo; sensación de fuerza de 1 a 5; matriz de trazabilidad obligatoria; ramas `main` y `develop` con commits directos a `develop` protegidos por hooks.
- Ideas descartadas: Yarn 4 con `npmMinimalAgeGate` (se mantiene Yarn 1; la regla de las 24 h se cumple con verificación manual y un script en T02). Monorepo. Feature branches obligatorias. Bloqueo de rutinas ya entrenadas. Autogenerar tests con la skill `coverage` (`/pw:generate`).
- Reglas afectadas: se crearon RN-IDE-01…12, RN-CAT-01…07, RN-PLAN-01…19 y RN-ENT-01…19.
- Pendientes: decidir ZG-01 a ZG-13 (`docs/PLANIFICACION.md`). Setup técnico en T02.

## 2026-11-01 — Cierre de zonas grises y e2e con Playwright [T03]
- Desarrollador: Lisandro
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 (orquestador, sin subagentes)
- Objetivo: decidir las 13 zonas grises detectadas al armar el catálogo de reglas y sumar Playwright al front.
- Qué hizo la IA: presentó las ZG-01 a ZG-13 y dos dudas extra (mínimo de ejercicios por circuito, quitar al último alumno del plan), con una opción recomendada en cada una. Aplicó las respuestas en los `CLAUDE.md` de los módulos de los dos repos, en `docs/PLANIFICACION.md` (decisiones 24 a 36), en `docs/TRAZABILIDAD.md` y en los atlas. Detectó que "un plan no puede finalizarse antes" contradecía US19 y lo consultó. Registró Playwright en la planificación, el protocolo de testing, el atlas y los permisos del front.
- Decisiones del desarrollador: se ingresa con email y contraseña, y el dataset trae la contraseña inicial; legajo y documento únicos; código de profesor reutilizable y sin vencimiento, que se invalida al regenerarlo; factor de peso mayor que 0% y hasta 100%; lista cerrada de músculos (agregó Sóleo); nombre de ejercicio único y secundario opcional; cada profesor trabaja solo con sus propias rutinas; un plan no se finaliza antes de tiempo, así que se elimina US19 (el backlog queda en 136 pts); solo se entrena la rutina de hoy, una vez por día; los grupos trabajados incluyen al músculo secundario; un récord se bate solo con una marca estrictamente mayor, y la primera marca no se anuncia; RPE y sensación son opcionales y se pueden cargar después; un entrenamiento sin finalizar queda abandonado a la medianoche; un circuito tiene 2 o más ejercicios; un plan vigente puede quedar sin alumnos. Playwright para los e2e del front, a configurar al crear la suite de tests.
- Ideas descartadas: finalización anticipada del plan (US19). Pasar US19 a deuda técnica. Código de profesor de un solo uso o con vencimiento. Anunciar empates o la primera marca como récord. RPE obligatorio.
- Reglas afectadas: RN-IDE-01, 04, 06, 08, 11, 12; nueva RN-IDE-13. RN-CAT-01, 04, 05, 07. RN-PLAN-03, 08, 12, 15, 16, 17. RN-ENT-01, 09, 13, 16; nueva RN-ENT-20. Front: RN-UI-ENT-02 pasa a vigente.
- Pendientes: tarjeta US19 a eliminar en Trello. Setup técnico en T02 (incluye Playwright). Google Doc a sincronizar cuando esté el conector de Docs.

## 2026-11-02 — Microcommits, versionado y plan de implementación por fases [T03]
- Desarrollador: Lisandro
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 (orquestador, sin subagentes)
- Objetivo: sumar a la planificación la regla de microcommits para la trazabilidad, definir el versionado del sistema y armar un plan de implementación por fases.
- Qué hizo la IA: detectó tres conflictos y los consultó: los módulos no coinciden con los sprints; con commits de TDD en rojo, husky los bloquea; y main solo se toca al cierre del sprint. Pasó `docs/PLANIFICACION.md` a la v3 (decisiones 37 y 38, secciones "Microcommits y trazabilidad" y "Versionado del sistema"). Creó `docs/PLAN-IMPLEMENTACION.md`, con las fases 0 a 5, el orden de dependencias, las RN por tarea, la definición de terminado y el registro de avance. Actualizó la sección Git del `CLAUDE.md` y la leyenda de la matriz. Detectó la zona gris ZG-14 (cómo se crea el Admin).
- Decisiones del desarrollador: SemVer en 1.x mientras dure el MVP. La minor sube por hito funcional (un sprint): 1.0.0 es la base técnica (T02) y de 1.1.0 a 1.5.0 son los sprints 1 a 5. El patch sube con los arreglos, y una US suelta no sube versión. Front y back sincronizados (misma MAJOR.MINOR; el patch puede diferir). Microcommits con test e implementación juntos y el refactor aparte. Plan en un archivo nuevo, con una fase por versión.
- Ideas descartadas: minor por módulo DDD completo (Planificación cerraría recién en el sprint 4). Patch por cada US terminada (mezcla features con arreglos). Commit del rojo con `--no-verify`, o permitir rojo en la subrama. Versiones independientes por repo. Plan dentro de `PLANIFICACION.md`.
- Reglas afectadas: ninguna RN. Nuevas decisiones 37 y 38. ZG-14 abierta.
- Pendientes: decidir ZG-14 antes de US00. Confirmar la tarjeta de Trello de este cambio. Confirmar las fechas de los sprints. Sincronizar el Google Doc. La fase 0 suma a T02 el hook `commit-msg`, `CHANGELOG.md` y la versión 1.0.0.

## 2026-11-02 — Calendario en dos escenarios, regla de main y seed del Admin [T03]
- Desarrollador: Lisandro
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 (orquestador, sin subagentes)
- Objetivo: ajustar el calendario a la fecha objetivo, congelar `main` hasta la entrega, decidir cómo se crea el Admin y obtener las tarjetas para el tablero.
- Qué hizo la IA: recalculó las fechas de cada fase para los dos escenarios y documentó que la velocity histórica (37) no alcanza para el ideal (hace falta 45,3 pts/semana). Agregó los cortes de control por sprint y el orden de recorte. Pasó los tags de versión a `develop` y redefinió la minor por fase en lugar de por sprint. Registró RN-IDE-14 y el caso de uso `sembrar-admin`. Generó la lista de tarjetas para Trello y un CSV de importación para Jira (fuera del repo).
- Decisiones del desarrollador: escenario ideal al 22/11 y pesimista al 01/12, dejando documentado que la velocity no da para el ideal. `main` no se toca hasta el 22/11. Tags en `develop`. El Admin se crea con un seed (ZG-14). Tarjetas a mano en Trello, con Jira como alternativa.
- Ideas descartadas: recortar el alcance de entrada para llegar al 22/11. Cargar los 136 pts con más ritmo como compromiso. Publicar sin tags hasta el 22/11. Script por la API de Trello o CSV para power-ups.
- Reglas afectadas: nueva RN-IDE-14. Decisiones 38 (ajustada), 39 y 40.
- Pendientes: crear las tarjetas en Trello (o importarlas a Jira). Sincronizar el Google Doc. Implementar la infraestructura de seeds en T02 y el seed del Admin en US00.

## 2026-11-02 — Base técnica del proyecto (T02) y versión 1.0.0 [T02]
- Desarrollador: Lisandro
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 (orquestador, sin subagentes: el setup es secuencial y cada paso depende del anterior)
- Objetivo: dejar la base técnica de T02 en los dos repos para que el equipo arranque con las historias.
- Qué hizo la IA: eligió cada versión con un script que toma la última estable publicada hace más de 24 h. Revisó los avisos de seguridad de Playwright: la 1.64.1 no tiene ninguno, y lo de hoy es una alfa. Detectó que Nest 12 es solo ESM y que su base oficial usa Vitest, y que el Node local (22.14) no alcanzaba para lint-staged, jsdom ni la CLI de Nest. Instaló Node 24.22.2 verificando el SHA-256 del instalador. Armó en el back Nest 12 + TypeORM + Postgres 18 dockerizado (5442 y 5443), Vitest en tres niveles con umbrales, ESLint con las reglas de capas del `CLAUDE.md`, la prohibición de only/skip/todo, husky, lint-staged, el validador de mensajes, el script de antigüedad de paquetes (directas y transitivas nuevas) y la infraestructura de `yarn seed`. En el front armó React 19 + Vite 8, Vitest + Testing Library + MSW, Playwright y las mismas herramientas. Verificó con pruebas descartables, borradas antes de commitear: la inyección de dependencias por tipo con Vitest, que el umbral de dominio bloquea, que un test en rojo y un mensaje mal formado bloquean el commit, que cada regla de capas da error y que MSW rechaza las requests no declaradas. El verificador encontró 7 transitivas con menos de 24 h (semver, strtok3, token-types, baseline-browser-mapping y electron-to-chromium), que se fijaron con `resolutions`.
- Decisiones del desarrollador: Nest 12 + Vitest en el back (cambia la decisión 21). Node 24 LTS. Revisar las vulnerabilidades de Playwright antes de instalarlo.
- Ideas descartadas: Jest con ESM experimental. Nest 11 con Jest. Node 26 (LTS recién estrenada) y Node 22. Bajar herramientas para seguir en Node 22.14. Escribir un smoke test sin regla de negocio. Implementar ya `ErrorDominio` y el filtro sin un test que los justifique.
- Reglas afectadas: ninguna RN. Decisiones 17 y 21 actualizadas.
- Pendientes: la API de una prueba quedó corriendo en el puerto 3000 (PID 17824) y hay que cerrarla a mano. Playwright necesita `yarn playwright install chromium` una vez por máquina. Las `resolutions` se pueden quitar cuando esas versiones superen las 24 h. Cada integrante tiene que instalar Node 24.

## 2026-11-08 — Decisión 41: US01 fuera del MVP, catálogo por dataset y semilla de usuarios [T01]
- Desarrollador: Lisandro
- Herramienta / modelo / esfuerzo: Claude Code · Haiku 5.5 (subagente de documentación)
- Objetivo: actualizar la documentación al cambio de alcance: US01 pasa a DT-06, T01 carga el dataset de ejercicios y los alumnos y profesores de prueba salen de una semilla de usuarios.
- Qué hizo la IA: actualizó `docs/PLANIFICACION.md` (decisiones 1, 24, 25 y 41, DT-01, DT-03 y DT-06, backlog de 127 pts), `docs/PLAN-IMPLEMENTACION.md` (fase 1 en 20 pts y fila de la semilla de usuarios), `docs/TRAZABILIDAD.md`, y el atlas y el CLAUDE.md global de cada repo. En el front, las reglas de UI del catálogo (RN-CAT-01, 05 y 09) y su historial. Actualizó las tarjetas de Trello y el CSV de Jira, fuera de los repos. No tocó código ni tests, y no commiteó.
- Decisiones del desarrollador: US01 sale del MVP y pasa a DT-06 (el catálogo del MVP se carga desde un dataset). T01 pasa a ser la carga del dataset de ejercicios (hasaneyldrm/exercises-dataset, 1324 ejercicios). Los alumnos y profesores de prueba se crean con la semilla de usuarios dentro de US00. Las tablas de velocity y calendario no se recalculan: el recorte deja 9 pts de margen.
- Ideas descartadas: no se registraron en esta sesión.
- Reglas afectadas: RN-CAT-01, 05 y 07 cambiadas; nuevas RN-CAT-08 y 09. RN-IDE-05 y 12 cambiadas; RN-IDE-06, 07 y 13 pasan a la semilla de usuarios de US00. Los textos salen de la rama `feat/T01-dataset-ejercicios` (commit 0a69b7b), porque no están en `docs/T01-alcance`.
- Pendientes: llevar a `docs/T01-alcance` las reglas de catálogo e identidad de la rama T01 (el worktree de este cambio no las tiene). Definir si la semilla de usuarios tiene puntos propios o va dentro de los 5 pts de US00 backend. Revisar ZG-13, que es texto histórico y dice "dataset".

## 2026-11-08 — Front de US00: ingreso, sesión, rutas y menú por rol [US00]
- Desarrollador: Lisandro
- Herramienta / modelo / esfuerzo: Claude Code · Sonnet 5.5 (subagente), a partir de tests en rojo escritos por otro agente con fichas confirmadas
- Objetivo: poner en verde los tests de RN-IDE-01, RN-IDE-03, RN-UI-IDE-01 y RN-UI-IDE-02 con la implementación mínima.
- Qué hizo la IA: armó el almacén de sesión (`cwgym.sesion`) con suscripción (`useSyncExternalStore`), el cliente HTTP con `ErrorApi` y cierre de sesión ante 401 con sesión activa, la página y el hook de ingreso, `RutaProtegida`, `MenuPrincipal` y las rutas por rol con "Próximamente". Verificó con mutaciones (6 de 6 mueren) y restauró cada archivo.
- Decisiones del desarrollador: ninguna nueva; siguió el contrato del pedido.
- Ideas descartadas: evento global para el 401 (se usa el almacén suscripto).
- Reglas afectadas: RN-IDE-01, RN-IDE-03, RN-UI-IDE-01, RN-UI-IDE-02.
- Pendientes: `react-hooks/rules-of-hooks` solo reconoce `use<Nombre>`; se apagó en `src/**/aplicacion/**` porque los hooks se llaman `usar<Accion>`. Revisar si se prefiere otra solución.

## 2026-11-08 — Reestimación del backlog y ajuste de métricas [T04, T05]
- Desarrollador: Lisandro
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5
- Objetivo: reevaluar las métricas y las estimaciones con los datos reales de la fase 1 y crear estimaciones nuevas para lo que falta.
- Qué hizo la IA: midió la sesión del 08/11 con los commits de los dos repos (22 pts en ≈ 1,3 h de sesión, ≈ 17 pts/h). Propuso medir puntos por hora de sesión y horas de sesión por semana (decisión 42), con un factor de complejidad de 2 a 2,5 para las fases 2 a 4 (7,5 pts/h estimados, unas 14 h de sesión para los 103 pts restantes). Recalculó los cortes de control y las fechas de cada fase (ideal 22/11; pesimista 28/11 con margen al 01/12), completó el registro de la fase 1 y el estado de los OKR, y comparó con COCOMO II (sobreestima unas 12 veces con IA). Actualizó `JIRA-IMPORT.csv` y `TARJETAS-TRELLO.md` (fuera de los repos): quitó US01, sumó T04 y T05 y agregó el estado real de cada tarjeta.
- Decisiones del desarrollador: crear las tarjetas T04 (reestimación) y T05 (ajuste de métricas) y eliminar del tablero la tarjeta del alta de ejercicios. Aclaró que la implementación arrancó el 08/11, así que no hay horas de trabajo anteriores para comparar.
- Ideas descartadas: seguir midiendo solo pts/semana (con un único día de trabajo en el sprint 1, el número no dice nada del ritmo). Recortar alcance ya (lo real quedó debajo de la línea pesimista original, pero el ritmo medido no lo justifica: se revisa en el corte del 15/11).
- Reglas afectadas: ninguna RN. Decisión 42 nueva; backlog de 127 a 129 pts.
- Pendientes: el factor de complejidad (2 a 2,5) es una suposición: se valida al cerrar la fase 2. La decisión de no recortar es una propuesta que tiene que confirmar el desarrollador. No se pudo cargar Jira directo: el conector de Claude no tiene permiso sobre `lichimedina05.atlassian.net`.

## 2026-11-08 — Front de la fase 1: T01, US02, US04 y US05 [T01, US02, US04, US05]
- Desarrollador: Lisandro
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 (orquestador, fijó el contrato de pantallas) + Haiku 5.5 (tests en rojo) + Sonnet 5.5 (implementación)
- Objetivo: implementar en el front la lista de ejercicios (T01), el alta de profesor (US02), el código de profesor (US04) y el vínculo del alumno (US05), con TDD.
- Qué hizo la IA: Haiku 5.5 escribió los tests en rojo a partir de fichas confirmadas y de un contrato de pantallas fijado por el orquestador Opus 5.5. Sonnet 5.5 implementó las pantallas, los hooks y los clientes sin tocar los tests. El orquestador corrigió dos valores inventados del fixture de la lista, "Peso Libre" y "Pectorales", que no existen en RN-CAT-03 y RN-CAT-05. Se hicieron mutaciones sobre la implementación: todas mueren salvo una (US02: el chequeo de campos con solo espacios no tiene test).
- Decisiones del desarrollador: tests escritos por Haiku e implementación por Sonnet; fichas de test por tarjeta; botón "Registrar ejercicio" deshabilitado (DT-06).
- Ideas descartadas: no se registraron en esta sesión.
- Reglas afectadas: RN-IDE-04, 06, 08, 09, 10, 11 y 13; RN-CAT-01 y 09. Sin cambios de reglas.
- Pendientes: (1) brecha de US02: el chequeo de campos con solo espacios no tiene test; queda por decidir si se cubre. (2) No verificado: la carga real de los GIF en un navegador. (3) No verificado: los e2e de Playwright, porque todavía no hay suite (`e2e/` solo tiene `.gitkeep`). (4) Nombre del hook de código: el archivo es `usarCodigoProfesor.ts`, pero el atlas decía `usarGenerarCodigoProfesor.ts`; se usó el nombre real y queda por confirmar si se renombra. (5) `react-hooks/rules-of-hooks` apagada en `aplicacion/`, pendiente de decisión (ver entrada de US00).

## 2026-11-08 — Ajustes después de la fase 1: brecha de US02, regla de hooks en español, 404 sin regla y Jira [US00, US02, US05]
- Desarrollador: Lisandro
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5
- Objetivo: resolver lo que quedó abierto al cerrar la fase 1.
- Qué hizo la IA: (front) sumó el test "Legajo de solo espacios no se envía" (RN-IDE-04), que mata la mutación del `trim` que antes sobrevivía; escribió la regla local de ESLint `cwgym-hooks/reglas-de-hooks` (`eslint/reglas-de-hooks.js`), que aplica las reglas de los hooks a `use*` y `usar*` y la verificó con un archivo temporal con 5 violaciones (todas detectadas). (back) El 404 de "profesor o alumno no encontrado" usa el código técnico `NO-ENCONTRADO` en lugar de RN-IDE-08/09. (Jira, proyecto CG en lichimedina05.atlassian.net) actualizó T01 y US00, creó T04 (CG-69) y T05 (CG-70) con sus subtareas, pasó a Listo lo terminado en la sesión y marcó US01 (CG-6 a CG-9) como descartada.
- Decisiones del desarrollador: cerrar la brecha, crear una regla de lint propia en lugar de nombrar los hooks en inglés, usar `NO-ENCONTRADO` para el 404 sin regla, aceptar los casos agregados a las fichas (token inválido, DNI de alumno en el alta de profesor, email y DNI de profesor en la semilla). Los commits firmados como PIPICBA / lichimedina05 son suyos.
- Ideas descartadas: renombrar los hooks a `use*` (rompe la regla de idioma); dejar la regla de React apagada sin reemplazo.
- Reglas afectadas: ninguna RN cambia. Contrato de errores: excepción `NO-ENCONTRADO` documentada en `src/compartido/CLAUDE.md` del back.
- Pendientes: borrar a mano US01 (CG-6 a CG-9) en Jira, porque el conector no puede borrar issues; cargar los Story Points de T04 y T05 desde la UI (el campo no está en la pantalla de creación); la regla de hooks no analiza returns anticipados; la demo de la fase 1 y el tag v1.1.0.

## 2026-11-08 — Carpetas por concepto en infraestructura, presentación, compartido y el front [T05]
- Desarrollador: Lisandro
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5
- Objetivo: extender las carpetas por concepto a todas las capas de los dos repos.
- Qué hizo la IA: con el mismo script (`git mv` y recálculo de imports, ahora también `.ts`/`.tsx` del front) movió 29 archivos del back (infraestructura espejando dominio, `presentacion/controlador/` y una carpeta por DTO, y todo `src/compartido/`) y 32 del front (cada pantalla con su hook y su test bajo el mismo nombre de carpeta en aplicacion y presentacion; `infraestructura/api/`; compartido por concepto). Actualizó rutas en fichas, CLAUDE.md, atlas y en la matriz de trazabilidad, que quedó idéntica en los dos repos. Verificó tsc, lint, Prettier, tests (113 back, 29 front), cobertura y build.
- Decisiones del desarrollador: agrupar también infraestructura, presentación y el front.
- Ideas descartadas: dejar el controlador suelto en presentacion/ (se usa `controlador/` para que todo esté en carpetas).
- Reglas afectadas: ninguna. Los tests solo cambian rutas de import.
- Pendientes: ninguno.

## 2026-11-10 — Editor de rutinas por bloques en el front [US06]
- Desarrollador: Ignacio
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5
- Objetivo: implementar en el front la creación de rutinas por bloques sobre el endpoint del back (`POST /planificacion/rutinas`).
- Qué hizo la IA: propuso los casos de test (10 unitarios, 8 de integración y 1 e2e), registró las fichas y escribió los tests; vio el rojo y escribió el dominio (`reglasBloque.ts`: RN-PLAN-01, 02, 04 y 05), los tipos del contrato, el cliente `apiPlanificacion.ts`, los hooks `usarCrearRutina` y `usarEjerciciosParaRutina` y la pantalla `EditorRutina` en `/profesor/rutinas`. Verificó con mutaciones que cada regla tiene un test que muerde (también el e2e). Agregó a `playwright.config.ts` la variable opcional `E2E_URL_API`. Instaló Chromium para Playwright, levantó Docker y el back de test (puerto 3001) con su semilla para correr el e2e. Verificó tsc, lint, Prettier, la suite (47 tests) y la cobertura.
- Decisiones del desarrollador: aprobar los casos de test; opción de menú "Rutinas"; sumar un e2e de Playwright contra el back real.
- Ideas descartadas: importar el cliente o los tipos del módulo catálogo (regla 2); etiqueta de menú "Crear rutina".
- Reglas afectadas: RN-PLAN-05 en la UI (el peso es opcional, como en el back).
- Pendientes: editar-rutina (RN-PLAN-07); circuitos y rutina mixta (US09, US10); copiar en `../back-CW-GYM/docs/TRAZABILIDAD.md` las columnas del front de US06 (la matriz tiene que quedar idéntica en los dos repos).

## 2026-11-10 — Editor de rutinas por circuitos en el front [US09]
- Desarrollador: Ignacio
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5
- Objetivo: implementar en el front la tarjeta US09 (CG-36) sobre el contrato del back ya mergeado en develop (`circuitos` en `POST /planificacion/rutinas`).
- Qué hizo la IA: propuso los casos de test (7 unitarios, 8 de integración y 1 e2e, en archivos nuevos, sin tocar los de US06), registró las fichas, vio el rojo y escribió `reglasCircuito.ts` (RN-PLAN-03 y 20), la derivación del tipo con circuitos, los tipos del contrato y los circuitos en el editor. Partió el editor en `edicion.ts`, `CampoNumero`, `CamposObjetivo`, `EditorBloque` y `EditorCircuito`. Verificó con mutaciones que cada regla tiene un test que muerde (también el e2e). Actualizó el `develop` local del back con un fast-forward, levantó Docker y el back de test para el e2e, y reinstaló las dependencias del front. Verificó tsc, lint, Prettier, la suite (62 tests) y la cobertura. Armó la matriz de trazabilidad a partir de la del back (develop) con las columnas del front de US06 y US09.
- Decisiones del desarrollador: aprobar los casos de test; un circuito nuevo arranca con 2 ejercicios; no mezclar bloques y circuitos hasta US10.
- Ideas descartadas: arrancar el circuito con un solo ejercicio; permitir la rutina mixta antes de US10.
- Reglas afectadas: RN-PLAN-20 se refleja en la UI.
- Pendientes: US10 (rutina mixta: quitar la restricción, el orden entre bloques y circuitos y su test); copiar en `../back-CW-GYM/docs/TRAZABILIDAD.md` las columnas del front de US06 y US09, para que la matriz vuelva a ser idéntica.

## 2026-11-11 — Pantalla de rutinas paginada y vista previa del GIF [tarjeta a crear]
- Desarrollador: Lisandro
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5
- Objetivo: consulta de rutinas tipo ABM con "Nueva rutina" arriba a la derecha y estado vacío "Creá tu primera rutina"; vista previa chica del GIF del dataset al elegir un ejercicio.
- Qué hizo la IA: buscó el plugin de diseño "impeccable" y no está instalado, así que siguió los estilos del repo. Creó `PaginaRutinas` (grilla de tarjetas responsive de 1, 2 o 3 columnas, tipo, resumen, miniaturas de los primeros ejercicios y paginación) con `usarConsultarRutinas`. El menú "Rutinas" abre la consulta y el editor pasó a `/profesor/rutinas/nueva` con "Volver a rutinas". El editor muestra el GIF del ejercicio elegido en 120 px. Verificó tsc, lint y Prettier.
- Decisiones del desarrollador: Alumno mobile y Profesor responsive; GIF chico; la tarjeta queda pendiente a crear.
- Ideas descartadas: tabla en desktop (las tarjetas funcionan en todos los anchos).
- Reglas afectadas: ninguna.
- Pendientes: crear la tarjeta; confirmar y escribir los tests de la pantalla; `yarn test` falla en esta máquina con "Vitest failed to find the runner" también en develop, hay que revisar las dependencias; editar y eliminar rutinas (falta el back); commitear.
- Agregado 11/11/2026 (segunda parte): la falla "Vitest failed to find the runner" no era de dependencias sino de correr desde `/d/` (letra de unidad en minúscula) en Git Bash; desde PowerShell en `D:\` corre. Con eso aparecieron 16 fallas reales por el cambio de ruta: con aprobación de Lisandro se cambió solo `initialEntries` a `/profesor/rutinas/nueva` en `EditorRutina.int.test.tsx` y `EditorRutinaCircuitos.int.test.tsx`, y en los 2 e2e se agregó el clic en "Nueva rutina" (sin tocar aserciones). Resultado: 62 tests y 2 e2e en verde (los e2e contra el back de desarrollo, porque Playwright reutiliza el front ya levantado). Se instaló el Chromium de Playwright.
- Impeccable (pbakaus/impeccable): `/plugin` no existe en la extensión de VS Code y no hay CLI de `claude`; se clonó el repo, se tomó el último commit con más de 24 h (25411d2) y se copió la skill a `.claude/skills/impeccable` (ESLint ignora `.claude/`). Con aprobación se corrió su binario: `context` y `detect`. Se quitó el borde lateral de 4 px de las tarjetas (anti-patrón), los glifos "+" y "←", se agregó foco visible, el GIF quedó centrado y se arregló el desborde horizontal del editor en mobile (`fieldset` con `min-width: 0`). Verificado con capturas a 375 y 1280 px. Falta `PRODUCT.md` y el hook de diseño de impeccable no está activado.
- Protección de tests (11/11/2026, pedido de Lisandro): `scripts/proteger-tests.mjs` en el hook commit-msg. Si un commit modifica, borra o renombra un test existente o su soporte, exige `Tests-aprobados-por: <git user.name>`; si toca `.husky/`, `.claude/settings.json` o el propio script, exige `Justificacion-hook:` (30 caracteres o más) y el registro queda en el historial (`git log --grep="Justificacion-hook"`). El `ask` de `.claude/settings.json` suma `Write` sobre los tests (antes solo `Edit`), los dobles y setup de test, y la protección; se niega `git commit --no-verify`. Probado en un repo descartable con 7 casos. El primer commit de este cambio necesita su propio `Justificacion-hook`.

## 2026-11-11 — Paginación, filtros, consulta y nombre de rutinas [T06, T07, T08, T09, T10]
- Desarrollador: Lisandro
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 (orquestador) · Haiku 5.5 (tests en rojo) · Sonnet 5.5 (implementación)
- Objetivo: listado de rutinas paginado con nombre editable, y listado de ejercicios paginado con GIF, buscador y filtros; registrar el trabajo en Jira.
- Qué hizo la IA: con el conector de Jira (lichimedina05) encontró CG-73 (T06) y CG-74 (T07), que ya cubrían paginación y filtros, y creó CG-75 (T08 consultar rutinas), CG-76 (T09 nombre de la rutina), CG-77 (T10 protección de tests) y las subtareas CG-78 a CG-83, todo en CG Sprint 2 (sin iniciarlo). Escribió un contrato único para back y front. Cuatro agentes Haiku escribieron los tests aprobados en rojo (47 casos entre back y front); dos agentes Sonnet implementaron contra ellos y verificaron con mutaciones. El orquestador corrigió el rótulo de T08/T09 en la documentación, unificó la matriz de trazabilidad (idéntica en los dos repos), tipó y formateó un test nuevo (`JsonBodyType`, sin tocar aserciones), formateó el fixture `ejercicios-consulta.json` (datos idénticos) y verificó la app con capturas a 375 y 1280 px. Resultado: back 141 unitarios y 40 e2e, front 83 tests; tsc, lint, Prettier y cobertura en verde.
- Decisiones del desarrollador: RN-PLAN-21 (nombre opcional, `Rutina N` por defecto, 1 a 60 caracteres, único por profesor sin distinguir mayúsculas, editable en la tarjeta del listado); tamaños de página 5, 10, 20, 50 y 100 para todos los listados con el contrato `{ items, total, pagina, tamanio }` y 400 fuera de rango; paginar y filtrar el catálogo en el back; confirmar RN-UI-LIS-01 a 04 completas; adaptar solo el mock de red de `ListaEjercicios.int.test.tsx`; aprobar los casos de test; repartir Haiku (tests) y Sonnet (implementación).
- Ideas descartadas: paginar el catálogo en el front; nombres repetidos; tamaños 20/50/100 solo para ejercicios; acotar en vez de rechazar tamaños inválidos.
- Reglas afectadas: nueva RN-PLAN-21; RN-UI-LIS-01 a 04 pasan a Vigente; RN-PLAN-08 gana tests en consultar y renombrar.
- Decisión técnica a revisar: el mapper de rutinas genera el id de cada ejercicio de circuito a partir del circuito y su posición (antes `randomUUID()`), porque al volver a guardar una rutina (renombrar) duplicaba o dejaba huérfanas esas filas.
- Pendientes: (1) dos huecos de test que sobrevivieron a la mutación: renombrar una rutina con su mismo nombre (permitido) y los filtros SQL del catálogo con datos en un e2e; (2) las rutinas que ya existían reciben el nombre por defecto de la columna (`Rutina 1`) y pueden quedar repetidas; (3) buscador sin debounce; (4) commits (necesitan `Tests-aprobados-por` y `Justificacion-hook`); (5) borrar el worktree sobrante `back-CW-GYM/.claude/worktrees/agent-ae58f0a59c967e470` y su rama.
- Agregado 11/11/2026 (cierre): (1) los dos huecos de mutación quedaron cubiertos (renombrar con su mismo nombre; e2e de filtros del catálogo con datos). (2) Rutinas viejas con nombre repetido: nuevo caso de uso `NormalizarNombresRutinas` que corre al arrancar el back (por profesor y por antigüedad, la primera conserva el nombre y las repetidas pasan al siguiente `Rutina N` libre); 5 casos (N1–N5) aprobados por Lisandro; al reiniciar el back de desarrollo renombró 3 rutinas. (3) En el front, "Músculo principal" ofrece solo los músculos del grupo elegido y vuelve a "Todos" si el músculo no pertenece (RN-CAT-05; casos D1–D4 aprobados). Back: 147 unitarios y 46 e2e; front: 87 tests; tsc y lint en verde. Siguen pendientes: buscador sin debounce, commits y el worktree sobrante.

## 2026-11-13 — Crear plan de 28 días (back y front) [US07]
- Desarrollador: Lisandro
- Herramienta / modelo / esfuerzo: OpenCode · Big Pickle medio
- Objetivo: implementar US07 completa: como Profesor, crear un plan de 28 días con la fecha de fin calculada, una rutina o descanso por día y uno o más alumnos vinculados; back, front y tests.
- Qué hizo la IA: propuso el contrato (28 días `{ numero, rutinaId | null }`, `fechaInicio` `AAAA-MM-DD`, respuesta con `fechaFin` y los días resueltos) y los casos de test, que el desarrollador confirmó en bloque. En el back agregó el agregado `Plan` con `DiaPlan` y `ValidezPlan` (RN-PLAN-09 a 12), el caso de uso `CrearPlan` con las reglas cruzadas (RN-PLAN-13 por la fachada de identidad y RN-PLAN-14 por `RepositorioPlanes` con el `Reloj`), el puerto compartido `Reloj` con `RelojSistema` y `RelojFijo`, la persistencia (`planes`, `dias_plan`, `plan_alumnos` en una transacción) y el evento `PlanCreado`. Sumó `GET /identidad/alumnos` con `ListarAlumnosDelProfesor` para que el front tenga los alumnos vinculados. En el front creó `PaginaCrearPlan` en `/profesor/planes` (fecha de fin calculada, 28 selects con "Descanso", selección de alumnos), los helpers de fecha en `dominio/plan/plan.ts`, los hooks `usarCrearPlan` y `usarDatosParaPlan` y la opción de menú "Planes". Actualizó `CLAUDE.md`, `FICHAS-TEST.md`, `ATLAS.md`, `TRAZABILIDAD.md`, `PLAN-IMPLEMENTACION.md` y `CHANGELOG.md` en los dos repos. Resultado: back 170 unitarios y 54 e2e; front 96 tests; tsc, lint, Prettier y builds en verde.
- Decisiones del desarrollador: aprobar todos los casos de test propuestos; `fechaFin` no viaja en el DTO (el `ValidationPipe` global la descarta) y siempre sale de `ValidezPlan`; una rutina que no existe o es de otro profesor responde RN-PLAN-08 `no-encontrado`; RN-PLAN-17 se cumple por diseño (no hay operación de finalización); la pantalla se renderiza directa en `/profesor/planes` porque todavía no hay endpoint para listar planes; agregar `GET /identidad/alumnos` en vez de que Planificación importe el módulo identidad.
- Ideas descartadas: calcular la fecha de fin en el front y mandarla; resolver los alumnos desde el back de planificación (import cruzado); crear un endpoint de listado de planes en esta tarjeta.
- Reglas afectadas: RN-PLAN-08 a 15 pasan a tener tests; RN-PLAN-17 queda cumplida por diseño. Ninguna regla nueva.
- Pendientes: commitear (necesita `Tests-aprobados-por`); listar y consultar planes (US11/US12); la rutina del día (US08); el buscador sin debounce sigue abierto de T06.

## 2026-11-14 — Consultar la rutina del día [US08]
- Desarrolladora: Martina; confirmó los casos de prueba propuestos en esta conversación.
- Herramienta / modelo: Codex · GPT-6 · Ponytail ultra.
- Objetivo: integrar y completar US08 según RN-PLAN-11, 15 y 18 y la estructura de ATLAS.md.
- Qué hizo la IA: encontró la implementación inicial de US08 junto con US07 en `feat/rutina-28-dias` y adelantó por fast-forward la rama `feat/consultar-rutina` de ambos repositorios (back `95cf880`, front `b7b0a26`), sin crear commits. Reutilizó el agregado Plan, el reloj, las fachadas, el caso de uso, el contrato, el hook y la página existentes. Completó la visualización de fecha y pausas y el orden accesible de ejercicios, sin agregar dependencias del proyecto. Agregó pruebas de aislamiento por alumno, datos del circuito, fecha, pausas (también cero), acceso por rol y límites de vigencia en la API. Fijó el reloj del e2e por el puerto Reloj y conservó las aserciones existentes. Actualizó atlas, fichas, decisiones del módulo, trazabilidad, plan de implementación y changelog.
- Decisiones de Martina: casos con inicio 01/11/2026, días 1 y 28 incluidos, 31/10 y 29/11 sin plan vigente, descanso, objetivos completos y acceso exclusivo del alumno autenticado a su rutina.
- Verificación: 29 unitarios relacionados del backend aprobados en el homelab (12 de US08 y 17 de planes); TypeScript de ambos repositorios, ESLint de producción y de los tests nuevos, Prettier y revisión de espacios aprobados. Martina ejecutó en la laptop el e2e de la API (11/11 en 2,68 s) y las dos suites de pantalla de US08 (10/10 en 1,70 s), y compartió las salidas en esta conversación. No se ejecutó la suite completa ni Playwright. Los intentos de TDD rojo por aserción en el homelab quedaron bloqueados por el arranque de Vitest sobre SSHFS; no se atribuye un rojo de aserción a esos timeouts. El e2e del homelab agotó el beforeAll de 30 s y no ejecutó aserciones; el mismo archivo pasó sus 11 casos en la laptop sin modificar los timeouts del proyecto. Se cerraron los procesos de prueba pendientes y se detuvo y eliminó el clúster temporal del homelab.
- Entorno: las fuentes permanecen en el montaje SSHFS de la laptop. Se usó Node 24.15 en el homelab y PostgreSQL 18 temporal en memoria para los e2e, sin tocar bases existentes. Ante la latencia de SSHFS se amplió solamente el tiempo de arranque de workers de Vitest mediante un cargador en memoria; no se cambiaron configuración, dependencias ni aserciones para eludir errores.
- Ideas descartadas: reescribir US07/US08, duplicar el contrato, exponer el catálogo al Alumno, recalcular vigencia o fecha en el navegador y hacer commits/push sin pedido.
- Reglas afectadas: ninguna nueva; se implementan y verifican RN-PLAN-11, 15, 18 sobre el contrato existente de US07.

## 2026-11-14 — Métricas del sprint 2 y reestimación del trabajo pendiente
- Solicitante: Martina. Confirmó que no hay horas efectivas ni disponibilidad semanal registradas y que US06 conserva la edición en su alcance, por lo que sigue parcial.
- Herramienta / modelo: Codex · GPT-6 · Ponytail ultra.
- Qué hizo la IA: contrastó planificación, matriz, atlas, auditorías, código y Git local en los dos repos. Separó sprint calendario de fase funcional y preparación técnica de cierre formal. Registró 26 puntos técnicos de US07/US08/US09 en el sprint abierto y 52/129 acumulados. Conservó los puntos históricos; identificó T06–T10 sin estimación previa, la edición pendiente, 15 puntos listos sin integrar y el dominio Entrenamiento aún sin evidencia automatizada en la matriz.
- Nueva estimación técnica: US restantes 74 puntos (US06 residual 6, US10 8 y US13 11; otras sin cambio) más 17 de cierre, total 91. Escenarios de capacidad supuesta 37/26/20 puntos por semana desde el 15/11: 02/12, 09/12 y 16/12 con cierre. Son pronósticos condicionales del agente, no nuevas fechas comprometidas por Martina ni recortes de alcance.
- Qué actualizó: nuevo `docs/METRICAS-SPRINT-2.md`, planificación, plan operativo, trazabilidad, atlas y changelog en ambos repos. Documentos compartidos idénticos. Se conservaron las modificaciones previas de US08 y no se editaron código ni tests en esta tarea.
- Verificación: cálculos de sumas, porcentajes, reglas referenciadas, fechas por redondeo al día superior y consistencia de las copias mediante comprobaciones Python. Sin reejecutar suites de la aplicación para cambios de documentación. Los 50 casos relacionados de US08 son resultados de la sesión anterior; no se sumaron a los conteos históricos de suite ni se presentó cobertura de código nueva.
- Ideas descartadas: declarar US06 completa, sumar puntos retroactivos a T06–T10, llamar velocity formal a un sprint abierto, usar lapsos entre commits como horas reales, garantizar el 22/11 o el 01/12 con capacidad no registrada y aplicar recortes automáticamente.
- Limitaciones: sin timesheets, compromiso semanal congelado, medición de demo ni verificación nueva de cobertura completa o tablero. Google Doc original y herramientas externas sin cambios. Publicaciones, tags, merges y commits no realizados.

## 2026-11-14 — US11, bloque 1: reutilización del detalle de rutina
- Desarrolladora: Martina. Confirmó consultar solo el plan vigente y los casos de 28 días, fechas, propiedad, permisos, descansos, detalles y errores; autorizó a Codex a hacer microcommits sin push.
- Herramienta / modelo: Codex · GPT-6 · Ponytail ultra.
- Cambio de este bloque: Extrae el componente existente de ejercicios, objetivos y pausas a `presentacion/detalle-rutina/DetalleRutina.tsx`; la pantalla de US08 lo utiliza conservando el mismo markup y comportamiento.
- Alcance: refactor de producción con las pruebas existentes de US08 intactas; todavía no agrega el endpoint ni la pantalla de US11. Los cuerpos de la transformación y del componente se conservaron literalmente durante la extracción.
- Verificación del microcommit: hooks normales de lint-staged y commit-msg; el resultado se registra al completar el bloque. No se deshabilitan hooks ni se modifica su configuración.
- Plan de los bloques siguientes: consulta de los 28 días con tests; endpoint con permisos y e2e; pantalla con detalles desplegables y tests. Test e implementación mínima de cada regla se confirman juntos; los refactors van aparte.
- Sin dependencias nuevas del proyecto, cambios de esquema, pruebas existentes editadas, commits a main ni push.
- Verificación en homelab: se reduce la concurrencia con afinidad a una CPU y se amplía solo el margen de arranque de workers de Vitest mediante un cargador de Node en memoria. No se escriben cambios en dependencias, hooks, configuración del proyecto ni aserciones; los tiempos de cada test siguen iguales. El control de tipos del refactor pasó.
- La ejecución del hook desde el homelab se interrumpió tras 42.6 minutos de latencia de SSHFS; lint y formato habían pasado, Vitest no había terminado. Se prepara la confirmación de estos cinco archivos en la laptop con todos los hooks habilitados, porque el acceso SFTP no permite ejecutar comandos remotos allí.

## 2026-11-15 — US11, bloque 4: pantalla Mi plan
- Martina confirmó el alcance y los casos de US11 el 14/11 y autorizó microcommits sin push. El refactor compartido del front se confirmó como `db40646`, ejecutado por Martina en la laptop con todos los hooks aprobados (6.93 s) tras la latencia del homelab.
- Primer rojo de la pantalla compartido por Martina: falta la lista Días del plan; 1 test fallido, 2.09 s. El esqueleto y la ruta compilaban y mostraban el título, por lo que el fallo era de comportamiento.
- Se implementa la consulta con el contrato de GET mi-plan, un hook del módulo y las tarjetas de los 28 días con sus fechas. La vigencia y la identidad las resuelve el back; no hay parámetros de alumno ni cálculos de vigencia en el navegador.
- Se registraron las fichas de los 9 casos confirmados. El detalle desplegable reutiliza DetalleRutina; no se modifican los tests existentes de US08. Los resultados finales se registran antes de confirmar la pantalla.
- Segundo rojo observado en laptop: el detalle abierto no tenía Press de pecho (1 fallido, 1 aprobado; 1.49 s). Se conectó DetalleRutina, se agregó el enlace desde US08 y se completaron los casos de regresión.
- Verificación final compartida por Martina: 9/9 tests de pantalla aprobados (1.79 s) y `yarn build` con TypeScript y Vite aprobado (3.35 s). Mordida: fijar temporalmente el número del detalle en 1 hizo fallar el caso del día 28 (1 fallo, 8 aprobados; 1.61 s). Se restauró dia.numero y el SHA-256 coincide con la página que pasó los tests y el build.
- Se actualizan atlas, fichas, reglas de UI, changelog, trazabilidad y plan operativo. Los documentos compartidos reflejan la implementación en rama, con integración pendiente, y conservan las métricas históricas del 14/11.
- Microcommits previos: back 0c355f1 (refactor), d647ce0 (consulta) y b3fc859 (endpoint); front db40646 (refactor). La pantalla se confirma por separado con sus tests y documentación. Sin push.
- Verificaciones no ejecutadas: cobertura global nueva y recorrido manual en navegador. Sin cambios de dependencias ni de pruebas existentes.

## 2026-11-15 — Crear rutina mixta, back [US10]
- Desarrollador: Ignacio
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 (orquestador, sin subagentes)
- Objetivo: back de US10 (CG-38). En el front solo se sincronizó `docs/TRAZABILIDAD.md` con la del back.
- Qué hizo la IA: ver la entrada del mismo día en `../back-CW-GYM/DECISIONES-IA.md`. Contrato nuevo para el front: cada bloque y circuito acepta `orden` (1..N) en `POST /planificacion/rutinas` y la respuesta lo devuelve.
- Decisiones del desarrollador: ver el back.
- Ideas descartadas: ver el back.
- Reglas afectadas: ninguna.
- Pendientes: front de US10 (CG-39): habilitar mezclar bloques y circuitos, ordenarlos y enviar `orden`.

## 2026-11-15 — Crear rutina mixta, front [US10]
- Desarrollador: Ignacio
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 (orquestador, sin subagentes)
- Objetivo: resolver el front de US10 (CG-39) sobre el contrato del back: mezclar bloques y circuitos y ordenarlos.
- Qué hizo la IA: propuso el diseño y los casos, y siguió TDD (rojo antes que verde). Quitó la restricción de US09, agregó la secuencia del editor con "Subir" y "Bajar" (`BotonesOrden.tsx`, `secuenciaRutina.ts`) y manda `orden` solo en rutinas mixtas. Tests: `secuenciaRutina.test.ts` (3), `EditorRutinaMixta.int.test.tsx` (4) y `crear-rutina-mixta.e2e.ts` (1, contra el back de la rama US10). Probó 5 mutaciones (mover sin intercambio, sin `orden`, "Subir" sin efecto, volver a la restricción, `orden` por tipo) y todas hacen fallar un test. Los tests de US06 y US09 no cambiaron.
- Decisiones del desarrollador: orden de agregado más "Subir" y "Bajar"; el listado de rutinas no muestra el orden; aprobó los casos.
- Ideas descartadas: dejar solo el orden de agregado (sin reordenar); ordenar los ejercicios de la tarjeta del listado por `orden`.
- Reglas afectadas: ninguna cambia. RN-PLAN-01 suma tests de rutina mixta en el front.
- Pendientes: copiar las columnas del front de US10 en `docs/TRAZABILIDAD.md` del back (rama US10); `orden` en la rutina del día si se decide.

## 2026-11-17 — Actualizar RN-PLAN-08 [CG-40, US20]
- Solicitante: Julián; consideró obsoleta la pregunta sobre si una copia modificada es una rutina nueva y pidió eliminarla.
- Herramienta / modelo: OpenCode · GPT-6.1 Terra.
- Qué hizo la IA: revisó el flujo de planes y rutinas en ambos repositorios y actualizó la regla, su historial, la decisión 8, la trazabilidad, los atlas y los changelogs. No modificó código ni tests.
- Decisión: se conserva que importar crea una copia independiente y que cada profesor solo ve, edita e importa sus propias rutinas; no se pregunta si la copia modificada es una rutina nueva.
- Ideas descartadas: definir acciones de sí/no o crear una tercera rutina a partir de la pregunta eliminada.
- Pendientes: implementar y probar US20 en back y front; la edición completa de rutinas también sigue pendiente. Sin commits ni publicaciones.

## 2026-11-17 — Importar rutina como copia [CG-40, US20]
- Desarrollador: Julián. Aprobó los casos de copia, nombres, seguridad, persistencia, interfaz y asignación a plan.
- Herramienta / modelo: OpenCode · GPT-6.1 Terra.
- Qué hizo la IA: implementó el endpoint de importación, copia del agregado con IDs nuevos y nombres únicos, y la acción en el listado del front. Agregó tests unitarios, e2e de API con PostgreSQL de test e integración de interfaz; actualizó documentación y trazabilidad.
- Decisiones de Julián: acción "Importar como copia" en la lista de rutinas; sufijos ` - Copia`, ` - Copia 2`, etc.; volver a la primera página tras importar.
- Verificación: 195 tests unitarios del back, 121 tests del front, 3 e2e de API de US20 y lint en ambos repositorios aprobados. El primer ciclo unitario y el primer ciclo de interfaz se observaron en rojo antes de implementar; los e2e se agregaron después. No se ejecutaron pruebas de mutación ni e2e de navegador.
- Pendientes: revisión del desarrollador y commits; edición completa de rutinas y e2e de navegador de US20. No se hizo push.
- Ajuste de interfaz pedido por Julián: reemplazar los botones de texto por un lápiz para editar el nombre y dos hojas superpuestas para importar una copia, junto al nombre, con etiquetas accesibles y ayuda al pasar el cursor. Pasaron las 10 pruebas de las dos suites del listado y lint; sin commits.
- Ajuste posterior pedido por Julián: ambas acciones pasan a un menú de tres puntos; se retira el indicador de tipo y se agrega "Ver rutina" deshabilitado. Julián autorizó adaptar los tests existentes para abrir el menú sin eliminar verificaciones: las 10 pruebas del listado y lint pasan.
- Julián pidió volver al diseño anterior: íconos de lápiz y copia junto al nombre, con el indicador de tipo; se retiraron el menú y "Ver rutina" y se restauró el recorrido anterior de las pruebas.
- Verificación posterior (17/11): se agregó `e2e/planificacion/importar-rutina.e2e.ts`. La primera ejecución falló por usar `getByLabel` en el selector del día; Julián autorizó corregirlo a `getByRole`. El test pasó contra frontend y backend de test separados (`5174`, `3001`, PostgreSQL `5443`): crea, copia y selecciona una rutina, sin guardar el plan. También se probaron en una copia temporal tres mutaciones de propiedad, orden y nombres; los tests detectaron las tres y el original restaurado pasó. Sin commits nuevos.
## 2026-11-20 — Iniciar y retomar un entrenamiento [CG-46]

- Desarrollador: Julián.
- Herramienta / modelo: OpenCode · GPT-6.2 Sol.
- Objetivo: implementar el modelado, la API y la pantalla de US13.
- Qué hizo la IA: compuso las acciones en la rutina del día y agregó la pantalla que retoma el contador desde el inicio informado por la API o muestra el abandono.
- Decisiones del desarrollador: confirmó UTC, los estados de consulta y los casos de dominio, API y UI.
- Ideas descartadas: guardar el entrenamiento en el navegador y agregar controles para historias posteriores.

## 2026-11-21 — Relevamiento de patrones de diseño aplicados [T11]
- Desarrollador: Lisandro
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 bajo (sin subagentes)
- Objetivo: listar los patrones que se vienen aplicando y sumarlos a la documentación.
- Qué hizo la IA: contrastó la tabla "SOLID y patrones" del `CLAUDE.md` del back con el código de `develop` (back `9c23451`, front `82bb99a`) y escribió `docs/PATRONES.md`, igual en los dos repos, con estado ✅ / 🔶 / ⬜ y la ubicación de cada patrón.
- Decisiones del desarrollador: pidió el listado y adjuntarlo a la documentación.
- Ideas descartadas: cambiar código para completar Observador o los puertos del front; queda como decisión del equipo.
- Reglas afectadas: ninguna.
- Pendientes: Estrategia sin código (US14/US16); Observador sin suscriptores; el front importa los clientes de API sin interfaz intermedia, distinto de lo que dice su `CLAUDE.md`. Crear la tarjeta T11 en Jira: el conector perdió el acceso a lichimedina05.

## 2026-11-21 — Sprints de Jira alineados al calendario y avance de la fase 3 [T11]
- Desarrollador: Lisandro
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 bajo (sin subagentes), con el conector de Atlassian (lichimedina05)
- Objetivo: revisar qué entraba en el sprint 3, qué está hecho, y acomodar Jira y la doc según lo que dice Jira y las fechas de `docs/PLAN-IMPLEMENTACION.md`.
- Qué hizo la IA: comparó las 83 tarjetas de CG con `develop`. En Jira: inició y cerró CG Sprint 2 (nunca se había iniciado) con sus fechas 09–15/11; creó CG Sprint 3 (16–22/11, activo) con US10, US20, US11, US13, US12 y el arrastre de T06/T07, y CG Sprint 4 (23/11–01/12) con US14 a US18; pasó a Listo 16 subtareas de historias ya terminadas. En la doc: estado de los sprints, control de cortes (65 al 15/11 y 90 al 21/11 según Jira), fase 3 completa (36/36) y US12 en curso.
- Decisiones del desarrollador: tomar Jira como fuente del estado y usar las fechas de la doc.
- Ideas descartadas: marcar US06 como parcial en Jira o reabrirla sin consultar; mover US12 al sprint 4 aunque ya figura en curso.
- Reglas afectadas: ninguna.
- Pendientes: decidir US06 (Listo en Jira, edición RN-PLAN-07 sin código; subtareas CG-24 y CG-25 en Por hacer). CG-23 y CG-27 (Modelar de US06 y US07) no se pudieron pasar a Listo: el permiso de la herramienta lo bloqueó. Publicar `v1.2.0` y `v1.3.0`.

## 2026-11-21 — Crear plan como calendario de 5 semanas [T12]
- Desarrollador: Lisandro
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 bajo (sin subagentes)
- Objetivo: fix visual de `/profesor/planes`: mostrar los 28 días como calendario 7 × 5, con los días que no forman parte del plan en gris y con blur.
- Qué hizo la IA: cambió `PaginaCrearPlan.tsx` y `estilos.css`. Encabezado lunes a domingo, celdas de relleno con su fecha real antes del inicio y después del fin (siempre 35 celdas), texto accesible de cada día conservado y lista en pantallas menores a 48rem. Sin cambios en el contrato, las reglas ni los tests: la suite pasa completa (27 archivos, 135 tests).
- Decisiones del desarrollador: calendario 7 × 5 con gris y blur para los días fuera del plan.
- Ideas descartadas: mover el cálculo de la grilla a `dominio/plan/plan.ts` (sumaría código de dominio sin test); cambiar los textos que usan los tests existentes.
- Reglas afectadas: ninguna (RN-PLAN-09 a 11 se siguen mostrando igual).
- Pendientes: crear la tarjeta T12 en Jira.

## 2026-11-21 — Consultar planes del profesor [CG-84, T13]
- Desarrollador: Lisandro
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 bajo (orquestador) + Haiku 5.5 (2 subagentes: tests en rojo de back y front) + Sonnet 5.5 (2 subagentes: implementación de back y front, en paralelo)
- Objetivo: que el profesor vea los planes que creó; mismo estilo que el listado de rutinas, con filtros y paginación.
- Qué hizo la IA: verificó en Jira y en los repos que nadie tenía la tarea (US12, de Martina, la va a necesitar para elegir un plan). Propuso la regla RN-PLAN-22, el contrato, los filtros y los casos de test. Haiku escribió 9 unitarios y 13 e2e en el back y 8 tests de integración en el front, en rojo. Sonnet implementó `GET /planificacion/planes` (filtros y orden en la base, estado calculado con `ValidezPlan` y el `Reloj`) y `PaginaPlanes` con `usarConsultarPlanes`. El orquestador revisó, movió la creación a `/profesor/planes/nuevo` y actualizó la trazabilidad, que había quedado desfasada en el front.
- Decisiones del desarrollador: filtros por estado, alumno y rango de fecha de inicio; RN-PLAN-22 y los casos de test aprobados; listado con botón "Nuevo plan"; creación en `/profesor/planes/nuevo`. Aprobó (`Tests-aprobados-por`) el método nuevo del doble `RepositorioPlanesEnMemoria`, las fichas nuevas y el cambio de `initialEntries` en el test de US07, sin tocar aserciones.
- Ideas descartadas: volver solo al listado al crear (ocultaba el mensaje de éxito que verifica el test de US07); entrar al formulario con un clic en "Nuevo plan" desde el test; calcular el estado en la base.
- Reglas afectadas: nueva RN-PLAN-22; RN-UI-LIS-04 suma los filtros de Planes.
- Verificación: back 216 unitarios y 13 e2e de consultar planes (63 e2e de planificación según el subagente); front 28 archivos y 143 tests; tipos y lint sin errores en los dos repos.
- Pendientes: la tarjeta T12 en Jira (la creación fue bloqueada por permisos); detalle de un plan desde el listado, si se pide.

## 2026-11-22 — Registrar serie realizada en el front [US14]
- Desarrollador: Ulises
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 (todo en serie, sin subagentes: la parte de front es chica y concentra decisiones de pantalla)
- Objetivo: que el alumno registre cada serie realizada desde el entrenamiento en curso, con lo prescripto a la vista y en una sola pantalla (RN-ENT-03, 04, 20; RN-UI-ENT-01, 02), sobre el contrato que el back publicó en US14.
- Qué hizo la IA: cruzó el board de Jira con las ramas para confirmar que CG-52 estaba libre. Propuso el diseño y 11 fichas, y las registró antes de escribir los tests. Con TDD (rojo por aserción, verde y mutaciones que hacen fallar cada test) escribió `dominio/serie/serie.ts` (validación, 8 unitarios), `dominio/serie/filasSeries.ts`, `usarRegistrarSerie`, `registrarSerie` en el cliente y `ListaSeries` en la página, con 8 tests de integración. Lo probó en el navegador contra el back real: registro con un clic y retomar al recargar. Sincronizó `docs/TRAZABILIDAD.md` con la copia del back, que había quedado adelantada con US14 y US18.
- Decisiones del desarrollador: campos precargados con lo prescripto; campo de peso solo si la serie prescripta tiene peso; ante `409 RN-ENT-20` se muestra el mensaje y la lista queda de solo lectura; una serie registrada se corrige registrándola otra vez; sin test de RN-ENT-19 en el front (lo cubre el back).
- Ideas descartadas: campos vacíos (más lento que el OKR O3); campo de peso siempre visible; repartir el trabajo entre subagentes.
- Reglas afectadas: ninguna cambió de texto. RN-ENT-03, 04, 20 y RN-UI-ENT-01 pasan a estar implementadas en el front.
- Verificación: front 31 archivos y 162 tests en verde (16 nuevos), `yarn test:cov` dentro de los umbrales (`dominio/serie` con 100% de líneas), tipos, lint y Prettier sin errores. Sobreviven dos mutaciones sin ficha: invertir el orden de bloques y circuitos, y no descartar la serie reemplazada en el hook (no cambia lo que se ve).
- Pendientes: replicar en el back los cambios de `docs/TRAZABILIDAD.md` y `docs/PLAN-IMPLEMENTACION.md`; medir los 10 s del OKR O3 en la demo; el bloqueo por entrenamiento finalizado (RN-ENT-04) llega con US15.

## 2026-11-22 — Entrenamiento paso a paso con GIF y botón de finalizar [US14, T14]
- Desarrollador: Ulises
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 (todo en serie, sin subagentes: el front del GIF dependía del contrato del back)
- Objetivo: después de probar a mano el front de US14, mostrar un ejercicio por vez con su GIF y el contador siempre visible, avanzar al registrar, y dejar visible el botón de finalizar hasta que exista US15.
- Qué hizo la IA: verificó que el modo secuencial era solo front, que el GIF necesitaba un cambio en el back y que finalizar dependía de US15 (back inexistente, asignada a Martina). Propuso la regla RN-UI-ENT-03, la ampliación de RN-ENT-02 y las fichas. Front: reescribió los tests de integración de US14 para el paso a paso (aprobado), implementó `PasoActual` y `FormularioSerie`, el GIF con atribución y el botón deshabilitado. Back: puerto `ConsultaEjercicios` implementado por la Fachada de catálogo (`EjercicioPublico` suma `urlGif`) y la función de dominio `conGifs` en `IniciarEntrenamiento`, con 2 unitarios y 2 e2e. Creó la tarjeta CG-85 (T14) en Jira. Sincronizó `TRAZABILIDAD.md` y `PLAN-IMPLEMENTACION.md` entre los repos.
- Decisiones del desarrollador: paso a paso con Anterior/Siguiente; arranca en el primer paso sin registrar; abandonado sigue como lista de solo lectura; GIF guardado en la copia tocando solo Entrenamiento y la Fachada de catálogo (no Planificación, cuyos e2e comparan con `toEqual`); atribución "GIF © Gym visual"; botón "Finalizar entrenamiento" deshabilitado en el último paso, sin test hasta US15.
- Ideas descartadas: agregar el GIF en la rutina del día de Planificación (cambiaba sus contratos y rompía e2e); habilitar el catálogo para el rol Alumno (toca RN-IDE-03); implementar la finalización en el back sin coordinar con US15.
- Reglas afectadas: nueva RN-UI-ENT-03 (front). RN-ENT-02 amplía la copia con el GIF (back, historial del módulo).
- Verificación: front 164 tests, back 247 unitarios, 3 de integración y 110 e2e; `yarn test:cov` en los dos dentro de los umbrales (back 98,2% de líneas); lint y tipos sin errores. Mutaciones sobre el paso inicial, el avance, Anterior/Siguiente, lo registrado, el GIF y `conGifs` hacen fallar los tests. Un test del GIF pasaba por un error del propio test (`undefined` tomaba el valor por defecto); se corrigió antes de commitear.
- Pendientes: el back de US15 para habilitar el botón; los entrenamientos anteriores a T14 no tienen GIF; nada pusheado.

## 2026-11-22 — Finalizar entrenamiento y mostrar resumen [US15]
- Desarrolladora: Martina Pineda. Herramienta: Codex.
- Objetivo: finalizar y consultar peso total, grupos musculares y duración, aun sin la pantalla de registro de series de US14.
- Implementación: el back calcula con las series guardadas, el peso corporal del inicio y datos del catálogo; guarda hora y resumen. El cierre se serializa con el registro de series. El front muestra el resumen y lo recupera al recargar.
- Decisiones: Martina confirmó los casos, incluido cierre sin series y permisos. Los récords corresponden a US16 y no se simulan.
- Verificación: 6 unitarios y 2 e2e en back, 4 tests de integración en front y builds aprobados en laptop. Rojo inicial observado en back y front. La comprobación por mutación detectó el cálculo y el texto alterados; los archivos fueron restaurados y sus huellas coinciden con las versiones aprobadas.
- Reglas: RN-ENT-05, 06, 07, 08, 09, 17, 19 y 20.

## 2026-11-23 — Consultar entrenamientos de mis alumnos en el front [US18]
- Desarrollador: Ulises
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 (todo en serie, sin subagentes: una pantalla sobre un contrato ya publicado)
- Objetivo: que el profesor vea los entrenamientos de sus alumnos para ajustar sus planes (RN-ENT-18), sobre `GET /entrenamiento/alumnos/:alumnoId/entrenamientos` que el back publicó en US18.
- Qué hizo la IA: pusheó las ramas de US14 y T14 y, ya mergeadas, sacó la rama desde `develop`. Verificó en Jira que CG-68 estaba asignada al desarrollador. Propuso la regla RN-UI-ENT-04, el diseño y 9 fichas, y las registró antes de los tests. Con TDD escribió el formato de fecha en hora de Argentina (1 unitario), `usarEntrenamientosDeAlumnos`, el cliente y `PaginaEntrenamientosDeAlumnos` con 8 tests de integración, la ruta y la opción del menú. Una mutación (sacar la guarda sin alumno) sobrevivía porque la red falsa no registraba la URL con el alumno vacío; se amplió el handler del test antes de commitear. Lo probó en el navegador contra el back real con el entrenamiento de la prueba manual y separó las filas de las series con estilos.
- Decisiones del desarrollador: selector de alumnos vinculados sin filtros extra (el back no los tiene); tarjetas con fecha y hora de Argentina, rutina, estado, peso, series N de M y cada serie junto a lo prescripto; cambiar de alumno vuelve a la página 1; rama desde `develop` porque US14 y T14 ya estaban mergeadas.
- Ideas descartadas: rama apilada sobre US14 (ya no hacía falta); importar los alumnos desde Planificación (rompe la regla de dependencia entre módulos); mostrar la hora en la zona del navegador (los tests dependerían de la máquina).
- Reglas afectadas: nueva RN-UI-ENT-04 y fila de RN-ENT-18 en el `CLAUDE.md` del módulo; RN-UI-LIS-04 suma el listado de entrenamientos de alumnos (sin filtros).
- Verificación: front 33 archivos y 173 tests (9 nuevos), `yarn test:cov` dentro de los umbrales, tipos, lint y Prettier sin errores. Nueve mutaciones (guarda, orden de alumnos, página 1 al cambiar, etiqueta de estado, total de series, título de la serie, sin alumnos, realizado, ruta del menú) hacen fallar los tests.
- Pendientes: el estado "Finalizado" llega con US15; el commit de documentación de Alex en la rama `feat/US18-consultar-entrenamientos-de-alumnos` del back sigue sin mergear; nada pusheado.

## 2026-11-24 — Mostrar récords personales al finalizar el entrenamiento [US16]

- Desarrollador: Ramiro.
- Herramienta / modelo: ChatGPT · GPT-6, DeepSeek V4.1 Flash
- Objetivo: mostrar al alumno los récords personales batidos al finalizar un entrenamiento, utilizando la respuesta extendida que publica el back.
- Qué hizo la IA: revisó el contrato de finalización y la implementación del front. Extendió el tipo de respuesta con `recordsBatidos`, adaptó el cliente y el hook de finalización, y conectó los récords con el componente `ResumenEntrenamiento`. Reutilizó `aplanarRecords` para presentar cada récord con el nombre del ejercicio, el tipo, el valor anterior y el nuevo. Agregó pruebas unitarias y una prueba de integración para la visualización de un récord.
- Decisiones del desarrollador: conservar el cálculo y la detección de récords en el back; el front únicamente interpreta y presenta `recordsBatidos`. La propiedad es opcional y la sección de nuevos récords se muestra cuando hay registros para presentar.
- Ideas descartadas: duplicar en el front los cálculos de récords o modificar el mecanismo de persistencia del back.
- Reglas afectadas: visualización de récords personales en el resumen de finalización; sin reglas de negocio nuevas.
- Verificación: el recorrido manual mostró correctamente un récord de `kettlebell hang clean`, de 12 a 13 repeticiones. También se comprobó en PostgreSQL que el récord de valor 13 quedó persistido. TypeScript, ESLint, build y Prettier aprobados. Vitest: 6/6 pruebas unitarias de `aplanarRecords` y 2/2 pruebas de integración de `PaginaResumenEntrenamiento`.
- Pendientes: revisión final e integración mediante Pull Request.

## 2026-11-23 — Finalizar en el último paso y e2e de navegador del MVP [US15, T15]
- Desarrollador: Ulises
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 (orquestador) + Sonnet 5.5 medium (1 subagente: P1, E1–E3 y S1, en serie porque comparten la base de test y los puertos)
- Objetivo: comprobar que la finalización de US15 (Martina) convive con el paso a paso de US14 y cubrir con e2e de Playwright los cuatro flujos del cierre del MVP (fase 5, CG-86).
- Qué hizo la IA: revisó la rama de US15 (salía de un `develop` anterior a US14, con 8 conflictos) y, ya integrada por Martina, encontró dos botones «Finalizar entrenamiento» en el último paso. Dejó solo el del último paso, habilitado, y adaptó la rutina falsa de los 2 tests de integración que finalizan (esperados sin cambios). Creó la tarjeta CG-86 (T15). Registró las fichas, escribió el soporte (`e2e/soporte/api.ts` prepara datos por la API real, `sesion.ts` ingresa y navega) y los e2e de ingreso y vínculo; delegó plan del día, entrenamiento completo y seguimiento al subagente y revisó su reporte. Adaptó `importar-rutina.e2e.ts`, que fallaba desde T13 porque «Planes» pasó a ser el listado. Configuró Playwright con un solo worker y `E2E_PUERTO_FRONT` para correr contra el back de test (3001) sin tocar los servidores de desarrollo, y lo documentó en `docs/TESTING.md`. Sincronizó `TRAZABILIDAD.md` (US15 ya integrada) y `PLAN-IMPLEMENTACION.md` entre los repos.
- Decisiones del desarrollador: «Finalizar entrenamiento» solo en el último paso (lo pedido en US14) en lugar de visible desde el paso 1; aprobó cambiar la entrada de los 2 tests de US15 y adaptar el e2e de importar rutina; tarjeta T15; reparto Opus (soporte, fichas e I1–I4) + Sonnet medium (resto); descargar Chromium para Playwright.
- Ideas descartadas: dejar el botón de Martina siempre visible (contradecía la decisión de US14); integrar US15 antes de que Martina lo hiciera (era su tarea); correr los e2e contra la base de desarrollo (cada alumno se vincula y entrena una sola vez, así que necesitan la base de test recién sembrada); varios workers o subagentes en paralelo (generar un código invalida el anterior y comparten la base); testear el abandono (RN-ENT-20) en e2e (no se puede mover el reloj del back real).
- Reglas afectadas: ninguna nueva. Se cubren en navegador RN-IDE-01, 08, 09, 10, 11; RN-PLAN-08, 11, 13, 15, 21; RN-ENT-01, 02, 03, 05, 06, 17, 18; RN-UI-ENT-02, 03, 04.
- Verificación: front 177 tests de Vitest y 12 e2e de navegador en verde con la base recién sembrada; lint sin errores. Cada e2e nuevo y la adaptación de importar rutina fallaron por aserción al romper una línea de producción (11 mutaciones, restauradas).
- Pendientes: no hay test de que «Finalizar» no aparezca antes del último paso; P1 calcula la fecha de fin en el test porque depende del día; la parte del alumno en P1 no tiene mutación propia; ramas pusheadas sin PR (`fix/US15-finalizar-ultimo-paso`, `test/T15-e2e-navegador` en el front y `docs/T15-e2e-navegador` en el back).

## 2026-11-23 — Jira y documentación alineados con develop [T11]
- Desarrollador: Lisandro. Herramienta / modelo: Claude Code · Opus 5.5.
- Objetivo: que Jira (CG) y la documentación reflejen lo que realmente está integrado en `develop`.
- Qué hizo la IA: comparó Jira, `TRAZABILIDAD.md`, `PLAN-IMPLEMENTACION.md` y el historial de los dos repos. En Jira pasó a Listo CG-54 y CG-55 (subtareas de US15), CG-73 (T06), CG-74 (T07) y CG-86 (T15); pasó US06 (CG-22) y sus subtareas CG-24 y CG-25 a En curso porque la edición de rutinas (RN-PLAN-07) no tiene código; etiquetó como `descartada` las subtareas de US01 (CG-7, 8, 9). En la documentación marcó US10, US11, US12, US14, US15 y US18 como integradas y recalculó el acumulado: 103/129.
- Decisiones del desarrollador: «actualizá todo al estado verdadero del repo».
- Pendientes: borrar a mano CG-6 a CG-9 (el conector no borra); US06 (edición), US16 y US17.

## 2026-11-24 — Notificar al profesor un entrenamiento por debajo de lo prescripto [US21]
- Desarrollador: Ulises
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 (orquestador) + Sonnet 5.5 medium (7 subagentes) + Haiku 5.5 low (2 subagentes).
  - Back, en tres tandas: A (RN-ENT-21), B (publicador) y C (dominio, Haiku) en paralelo; después D (casos de uso); después E (infraestructura, API y e2e).
  - Front: F (bandeja); después G (contador) y H (`?alumno=` de US18, Haiku) en paralelo; después I (e2e de Playwright).
- Objetivo: que el profesor reciba, dentro de la app, una notificación cuando un alumno suyo finaliza un entrenamiento con resultados por debajo de lo prescripto. La tarea no tenía tarjeta en Jira.
- Qué hizo la IA:
  - **Jira:** creó CG-87 (US21, 11 pts, Sprint 4) con sus subtareas CG-88 (Modelar), CG-89 (Backend) y CG-90 (Frontend).
  - **Modelado:** preguntó las zonas grises y escribió el modelo en los dos repos:
    - módulo nuevo `notificaciones` con RN-NOT-01 a 05, RN-ENT-21 y la decisión 45;
    - glosario (Serie por debajo de lo prescripto, Notificación, Gravedad), plan, trazabilidad y atlas.
  - **Fichas:** propuso las fichas (25 del back, 8 del front) y las registró una vez confirmadas.
  - **Back:**
    - función pura `seriesPorDebajo`;
    - `EntrenamientoFinalizado` con las series por debajo, publicado por la entidad (`eventoDeFin`);
    - `PublicadorEventosEnProceso` con el puerto `SuscriptorEventos`, primer suscriptor real (Observador ✅ en `PATRONES.md`);
    - agregado `Notificacion` y objeto de valor `Gravedad`;
    - cuatro casos de uso, repositorio TypeORM, adaptador de la Fachada de identidad (`obtenerProfesorPorUsuarioId`), suscriptor, controlador y e2e con el publicador real.
  - **Front:**
    - bandeja `/profesor/notificaciones`;
    - contador "Notificaciones (N)" en el menú, compuesto desde `Aplicacion.tsx` y solo para el Profesor;
    - enlace a US18 con `?alumno=`;
    - e2e de Playwright.
  - **Revisión:** revisó cada reporte y el código de cada subagente, corrió la verificación completa y actualizó fichas, atlas, trazabilidad, `CHANGELOG` y reglas.
- Decisiones del desarrollador:
  - **Qué cuenta como por debajo:** una serie queda por debajo con menos repeticiones, segundos o peso (si había peso prescripto) que lo prescripto. Las no registradas cuentan como cero y, en un circuito, cuenta cada ejercicio de cada vuelta.
  - **Gravedad:** Leve con menos del 40% de las series por debajo; Grave con el 40% o más. Manda el porcentaje: 1 de 2 es Grave.
  - **Bandeja y módulo:** bandeja con contador de no leídas y "Marcar como leída", en un módulo nuevo que escucha el evento.
  - **Preparado para US17:** RPE y sensación de fuerza van en la misma notificación. Por ahora es `percepcion: null` en la tabla y en el contrato, con RN-NOT-05 a confirmar.
  - **Patrones:** énfasis en respetar las convenciones y los patrones de los `.md` antes de codear.
  - **Confirmaciones:** confirmó las fichas, más 3 nuevas del dominio del front para recuperar el umbral de cobertura de ramas (78,84% → 80,46%); los repartos por tanda y los microcommits.
- Ideas descartadas:
  - `@nestjs/event-emitter`: se resolvió con un publicador propio, sin paquetes nuevos.
  - Volumen total o un umbral de cumplimiento como criterio de "por debajo".
  - Contar solo las series registradas.
  - Notificación como agregado dentro de Entrenamiento.
  - Marca en la página de US18 en lugar de una bandeja.
  - Desactivar el contador en los tests o agregar una respuesta por defecto en la red falsa compartida. No hizo falta: el contador ignora los errores de red.
  - Reunificar el recorrido de `registrarSerie` con `seriesPrescriptas`: queda como refactor aparte.
- Reglas afectadas:
  - Nuevas: RN-ENT-21, RN-NOT-01 a 04 (vigentes), RN-NOT-05 (a confirmar con US17), RN-UI-NOT-01 y 02.
  - Ajuste el mismo día: RN-UI-NOT-01 también se actualiza al marcar, como pide la ficha e2e confirmada.
- Verificación:
  - Back: `yarn test:cov` 399/399, con cobertura y lint OK.
  - Front: 188/188 en Vitest con cobertura y 13/13 e2e de navegador, con la base recién sembrada.
  - En cada ficha el test detectó un cambio hecho a propósito en el código, que después se restauró.
  - Lo que no detecta ningún test quedó anotado en las fichas: dos cambios en E7 y el `ON CONFLICT DO NOTHING`.
  - El e2e de Playwright encontró que el contador tardaba 60 s en actualizarse; se corrigió con un aviso interno del módulo.
- Pendientes:
  - Ramas `feat/US21-notificar-entrenamiento-por-debajo` sin pushear ni PR.
  - Cuando se trabaje US17: si cargar la percepción vuelve la notificación a no leída y si una percepción baja notifica aunque no haya series por debajo.
  - Mover CG-87 a CG-90 en Jira.
  - El back de test (`yarn start`) deja vivo el proceso `dist/main` al detener la tarea: se cerró a mano dos veces.

## 2026-11-24 — Percepción del alumno y su notificación al profesor [US17]
- Desarrollador: Ulises
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 (orquestador) + Sonnet 5.5 medium (5 subagentes) + Haiku 5.5 low (1 subagente).
  - Back: A (entrenamiento) y B (notificaciones, dominio y aplicación) en paralelo; después C (suscriptor, repositorio y e2e).
  - Front: D (resumen y US18) y E (notificación, Haiku) en paralelo; después F (e2e de Playwright).
- Objetivo: que el alumno cargue su RPE y su sensación de fuerza (US17, CG-60) y que el profesor lo vea, integrado con la notificación de US21.
- Qué hizo la IA:
  - Preguntó las zonas grises y escribió el modelo en los dos repos: RN-ENT-16 cambia, RN-NOT-01 y 05 cambian, se suman RN-NOT-06 y 07, decisión 46, glosario, plan, trazabilidad y atlas.
  - Propuso 20 fichas (13 del back y 7 del front) y las registró cuando las confirmó Ulises.
  - **Back:**
    - objetos de valor `Rpe` y `SensacionFuerza` y método `Entrenamiento.registrarPercepcion`, que emite `PercepcionRegistrada`;
    - `POST /entrenamiento/entrenamientos/:id/percepcion` con escritura condicional (`fin IS NOT NULL AND percepcion IS NULL`) y la percepción en las dos lecturas;
    - en notificaciones: `Percepcion.esMala`, `Gravedad.dePercepcion` y `Gravedad.mayor`, `crearPorPercepcion`, `sumarPercepcion` (vuelve a no leída), el caso de uso `SumarPercepcion` y su suscriptor.
  - **Front:**
    - formulario de percepción en el resumen, con validación antes de enviar;
    - la percepción en US18 y en la notificación;
    - "Percepción mala" sin lista de series.
  - Revisó cada reporte y completó las mutaciones que faltaban (el rechazo de `crearPorPercepcion` y el camino sin profesor). Alineó el tipo `Percepcion` del front al contrato (siempre numérico), actualizó la documentación y cerró el back de test sin dejar procesos vivos.
- Decisiones del desarrollador:
  - **Cuándo y cómo se carga:** solo en un entrenamiento finalizado, una sola vez y los dos valores juntos.
  - **Notificación existente:** si el entrenamiento ya tiene notificación, la percepción se suma y la notificación vuelve a no leída.
  - **Percepción mala:** RPE ≥ 9 o sensación ≤ 2. Notifica aunque no haya series por debajo, Leve con una condición y Grave con las dos.
  - **Gravedad combinada:** con series por debajo, queda la gravedad mayor.
  - **Confirmaciones:** modelo, fichas, repartos y microcommits.
- Ideas descartadas:
  - cargar la percepción en curso;
  - carga parcial o corregible;
  - sumar la percepción sin cambiar la lectura;
  - umbrales "RPE ≥ 9 y sensación ≤ 2" o solo los extremos;
  - percepción siempre Leve o siempre Grave;
  - que la percepción no cambie la gravedad;
  - `PUT` para la carga (se usó `POST`, porque se carga una sola vez).
- Reglas afectadas: RN-ENT-16 (cambia), RN-NOT-01 y 05 (cambian; la 05 pasa de "a confirmar" a vigente), RN-NOT-06 y 07 (nuevas). En el front: RN-ENT-16 (UI), RN-UI-ENT-04, RN-NOT-05 y 06 (UI).
- Verificación:
  - Back: `yarn test:cov` 422/422, con lint y build OK.
  - Front: `yarn test:cov` 195/195 (ramas 81,28%) y 14/14 e2e de navegador con la base recién sembrada.
  - En cada ficha se rompió a propósito una línea de producción, el test dio rojo y se restauró.
  - Quedaron anotados en las fichas:
    - el rojo previo de N1 a N5 fue un `TypeError`, no una aserción, y N6 no tuvo rojo previo;
    - ningún test detecta quitar `AND percepcion IS NULL` del UPDATE condicional, porque no hay test de carga simultánea;
    - no hay caso para la sensación de fuerza 6;
    - la entrada de P6 se aclaró: en curso propio da 409 y ajeno da 404.
- Pendientes:
  - ramas `feat/US17-percepcion` sin pushear ni PR;
  - mover CG-60 a CG-62 en Jira;
  - decidir si `GET` de US18 incluye `percepcion` solo en finalizados, como `mi-entrenamiento-en-curso`;
  - fichas para la carga simultánea y para la sensación de fuerza 6, si se quieren.

## 2026-11-24 — Consultar y editar una rutina [US06]
- Desarrolladora: Martina
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5, sin subagentes (el front depende del contrato del back; delegar no ahorraba trabajo).
- Objetivo: completar el CRUD de US06. Ya se creaba una rutina y se cambiaba su nombre, pero no su contenido. Rama `fix/US06-consultar-editar-rutina` en los dos repos.
- Qué hizo la IA:
  - Revisó el código y avisó que el listado (T06) ya existía; con la aclaración de Martina, propuso el detalle de una rutina en el editor precargado y su edición.
  - Propuso 11 casos de test (8 del back y 3 del front) y los escribió en rojo después de que Martina los confirmó.
  - **Back:** extrajo `resolverContenido` de `CrearRutina` (refactor aparte); `Rutina.editar`, caso de uso `EditarRutina`, `ConsultarRutinas.porId`, `GET` y `PUT /planificacion/rutinas/:id`. Corrigió `RepositorioRutinasTypeorm.guardar`, que dejaba en la base los bloques y circuitos quitados.
  - **Front:** cliente `obtenerRutina` y `editarRutina`, hook `usarEditarRutina`, `rutinaAEdicion`, `PaginaEditarRutina` en `/profesor/rutinas/:id` y "Ver y editar" en cada tarjeta. `EditorRutina` acepta `rutina` y `edicion`, suma el campo "Nombre" y "Guardar cambios".
- Decisiones de la desarrolladora:
  - **Qué falta:** editar los ejercicios, repeticiones, pausas y demás desde un detalle de la rutina, no solo el nombre.
  - **Confirmaciones:** casos de test y microcommits.
- Ideas descartadas:
  - una pantalla de detalle de solo lectura aparte del editor;
  - editar solo valores, sin poder agregar, quitar o reordenar bloques y circuitos;
  - un e2e que inicie un entrenamiento antes de editar: los entrenamientos guardan su propia copia y ninguna tabla de entrenamiento apunta a las de rutinas.
- Reglas afectadas: ninguna cambia. Se implementa RN-PLAN-07, que figuraba sin código, con RN-PLAN-01, 06, 08 y 21.
- Verificación:
  - Back: `yarn test` 307/307, `yarn test:e2e` 120/120, `yarn test:int` 8/8 y lint OK.
  - Front: `yarn test` 198/198, lint y `tsc -b` OK.
  - Cada test nuevo dio rojo por la razón correcta antes de implementar: la función sin implementar, el método inexistente, la ruta 404 o el enlace inexistente.
  - En el test del front se espera el campo "Repeticiones" con `findByLabelText`, porque aparece cuando llega el catálogo (sin cambiar las aserciones).
- Segunda parte (misma sesión), pedido de Martina: el lápiz de la tarjeta, que solo editaba el nombre, abre la rutina en el editor.
  - La IA avisó que cambiaba tests existentes y propuso reemplazarlos. Martina lo aprobó.
  - Se quitaron el botón "Ver y editar", la edición del nombre en la tarjeta (`usarRenombrarRutina`, `renombrarRutina` y `reemplazar`) y su CSS. El back conserva el `PATCH` del nombre.
  - Tests: se borraron los 3 de renombrar en la tarjeta. Se sumó uno que cambia el nombre en el editor. `PaginaEditarRutina.int.test.tsx` abre la rutina con el lápiz "Editar rutina", sin cambiar sus aserciones.
  - Verificación: front `yarn test` 196/196, lint y `tsc -b` OK.
- Pendientes:
  - ramas sin pushear ni PR;
  - mover US06 en Jira;
  - no se corrieron los e2e de Playwright del front.
## 2026-11-24 — Integración de US16 (récords) y limpieza de ramas [US16]

- Modelo: Opus 5.5 solo, sin subagentes. Pedido de Lisandro.
- Qué hizo la IA:
  - Relevó las ramas remotas adelantadas a `develop`: `feat/US16-record-personal` (back, Ramiro), `feat/US16-frontend-records` (front, Ramiro) y `feat/US18-consultar-entrenamientos-de-alumnos` (back, alex, un commit de docs del 22/11).
  - Revisó US16 y la mergeó con `--no-ff` en ambos repos, sin conflictos.
  - Detectó que el PR #17 del front y el PR #1 del back se habían mergeado a `main` por error y ya estaban revertidos (#18 y "vuelvo a la version cb9cb89"); `develop` no se vio afectado.
- Decisiones del desarrollador (Lisandro):
  - La rama de US18 de alex se borra: sus docs chocaban con versiones posteriores de `develop`.
  - Se aprueba corregir el test de récords del front: armaba una rutina sin bloques y, desde US15, «Finalizar» aparece solo en el último paso. Se agregó un bloque de una serie, sin cambiar las aserciones.
- Observación del review (sin cambio): `CerrarEntrenamientoConRecords` calcula los récords después de cerrar, fuera de la misma transacción; si falla, el entrenamiento queda cerrado y el usuario ve un error.
- Verificación: back `yarn test:cov` 463/463, `yarn test:int` 12/12 y lint OK; front `yarn test:cov` 203/203 y lint OK.
- Pendientes: mover US16 en Jira (ya figuraba en Listo antes de integrarse); e2e de Playwright no corridos.

## 2026-11-24 — Editar días del plan, alerta de incumplimiento y volver al inicio [US22, US23, T16]

- Desarrollador: Lisandro
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 orquesta; Haiku 5.5 low (tests en rojo del back de US22 y T16 completa) y Sonnet 5.5 (back y front de US22, US23 completa). US23 y T16 en worktrees aparte (`IyCS-wt/`) para trabajar en paralelo con US22.
- Objetivo: tres pedidos del desarrollador al probar el sistema: editar los días de un plan vigente (US22, CG-91, 8 pts), alertar al profesor cuando un alumno junta 3 entrenamientos seguidos por debajo de lo prescripto (US23, CG-92, 5 pts) y un enlace para salir del resumen del entrenamiento (T16, CG-93, 1 pt). Las tres quedan fuera de la base V1 de 129 pts.
- Qué hizo la IA:
  - Propuso RN-PLAN-23, RN-NOT-08 y RN-UI-ENT-05 con sus fichas; el desarrollador las confirmó antes de escribir tests. Creó las tarjetas en Jira (Sprint 4).
  - **US22:** `Plan.editarDia`, caso de uso `EditarDiaPlan`, `ConsultarPlanes.porId`, `GET /planificacion/planes/:id` y `PUT /planificacion/planes/:id/dias/:numero`. El chequeo de "entrenamiento iniciado hoy" usa un puerto propio con SQL sobre `entrenamientos`, para no crear un ciclo Planificación → Entrenamiento. Front: "Editar días" en la tarjeta del plan y grilla de 28 días con los pasados bloqueados.
  - **US23:** función de dominio `detectarRachasDeIncumplimiento`, tabla propia `finalizaciones_alumno` (Notificaciones no lee Entrenamiento), tipo de notificación (`entrenamiento` | `alerta-incumplimiento`) con índice único (`entrenamiento_id`, `tipo`). Front: tarjeta de alerta en la bandeja.
  - **T16:** enlace "Volver al inicio" debajo del resumen.
- Decisiones del desarrollador:
  - La alerta de US23 se suma a la notificación por entrenamiento; cuenta cualquier gravedad; abandonado no cuenta ni corta; la percepción mala sola no cuenta; la racha vuelve a cero al alertar.
  - Casos extra confirmados: el mismo evento dos veces no duplica la alerta; no hay alertas retroactivas.
  - Durante el desarrollo se corren solo los tests relacionados con lo trabajado y sin mutaciones; la suite completa, cuando él la pida.
  - develop se integra en main (decisión 39, con su permiso).
- Ideas descartadas: que Planificación importe el módulo de Entrenamiento (ciclo); reemplazar la notificación por entrenamiento por la alerta.
- Reglas afectadas: nuevas RN-PLAN-23, RN-NOT-08 y RN-UI-ENT-05.
- Verificación (tests relacionados, después de integrar): back planificación, entrenamiento y notificaciones 253/253 unitarios y 12/12 e2e (notificaciones y editar-dia-plan); front planificación, entrenamiento y notificaciones 165/165, tsc y lint OK. Mutaciones hechas antes del cambio de criterio: US22 front (bloqueo de días pasados) y US23 (corte de racha y reinicio), todas detectadas.
- Pendientes:
  - `finalizaciones_alumno` arranca vacía: los entrenamientos previos a US23 no cuentan para la racha.
  - Mutaciones del back de US22 no hechas (fecha pasada, entrenamiento iniciado, propietario).
  - Suite completa sin correr después de integrar; un e2e de ingreso falló una vez en corrida completa por la base de test compartida entre agentes y pasa solo.

## 2026-11-24 — Sistema de diseño «Tanteador de club» [T17]
- Desarrollador: Ulises
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 (orquestador y diseño, con la skill Impeccable) + Sonnet 5.5 medium (2 subagentes: revisión final y documentación).
- Objetivo: T17 (CG-95), primera tarea de la épica US24 (CG-94, "Embellecer todo el front-end"). Definir el sistema de diseño como tokens centralizados sin cambiar funcionalidad, y armar el plan secuencial de la épica.
- Qué hizo la IA:
  - **Plan de la épica:** T17 → T18 → T19 → T23 → T20, T21 y T22 → T24. T23 va antes de las pantallas para no rehacerlas.
  - **`PRODUCT.md`:** lo escribió después de tres preguntas de producto (marca, dispositivo por rol, accesibilidad).
  - **Dirección visual:** hizo las preguntas de experiencia de uso y corrió el sorteo de direcciones de la skill. Armó una página de decisión con:
    - cinco bocetos HTML de la pantalla del alumno en el celular;
    - la dirección asignada, su favorita, dos alternativas competitivas, cuatro descartadas y el estándar de la categoría.
  - **Contrato:** registró la dirección elegida en `.impeccable/surfaces/`.
  - **Dependencias:** las instaló con la regla de 24 h. `lucide-react` 1.79.0 tenía menos de 24 h y se usó 1.78.0.
  - **Código:**
    - `tokens.css`, con los contrastes verificados por cálculo;
    - `base.css`;
    - reemplazo de los valores sueltos de `estilos.css` por tokens, sin cambiar la forma de ningún componente.
  - **Verificación:**
    - lint, build, Vitest 210/210 y e2e de navegador 14/14;
    - capturas del ingreso en escritorio y móvil;
    - el detector de la skill, sin hallazgos.
  - **Revisión final:** delegó la revisión y aplicó sus ocho correcciones. Las más relevantes:
    - tokens de acción separados de los de enlace;
    - foco "actual" para la cancha;
    - iconos, estados de info y advertencia, `color-scheme`, `placeholder` y `theme-color`.
  - **Ajuste posterior:** al documentar oscureció el borde de los campos a #748A7E. Antes daba 2,85:1 sobre el fondo.
  - **`DESIGN.md`:** lo delegó; queda con las deudas anotadas para T18 a T24.
- Decisiones del desarrollador:
  - **Producto:** sin identidad previa; alumno en el celular y profesor y admin en escritorio; WCAG 2.2 AA.
  - **Objetivo:** el éxito es que se vea profesional y propio; lo que no puede pasar es que parezca un sistema administrativo genérico.
  - **Restricción:** los textos y los nombres accesibles no se tocan.
  - **Dirección:** eligió la del sorteo, «Tanteador de club».
  - **Dependencias:** fuentes con `@fontsource` e iconos Lucide.
  - **Confirmaciones:** el reparto de los dos subagentes y los microcommits.
- Ideas descartadas:
  - las direcciones "La planilla del profe", "App de consumo cálida", "Cuponera de viaje" y el estándar de la categoría;
  - las cuatro direcciones del catálogo que se descartaron en la tirada (de cada una quedó una idea en el tanteador: numeración de dos dígitos, una rampa fija de cifras, color por sección y jerarquía por escala);
  - Google Fonts por CDN o la fuente del sistema;
  - SVG propios o ningún icono;
  - el ámbar como color de una sección (queda solo para lo vivo).
- Reglas afectadas: ninguna regla de negocio. Rige la restricción de la épica: la estética no cambia textos, roles ni comportamiento.
- Verificación:
  - lint y build OK;
  - Vitest 210/210 y e2e de navegador 14/14 con la base recién sembrada;
  - el detector de la skill, sin hallazgos.
  - La revisión final puntuó siete correcciones resueltas y una parcial, que se corrigió después.
  - Solo se capturó el ingreso: la toma de un token de la semilla por terminal la bloqueó el clasificador de permisos.
- Pendientes:
  - rama `feat/T17-sistema-de-diseno` sin pushear ni PR;
  - mover CG-95 en Jira;
  - T18 a T24, con las deudas anotadas en `DESIGN.md`;
  - revisar las pantallas con sesión en T19 a T22;
  - actualizar Impeccable a v4.10.0 y correr `/impeccable doctor`, si el desarrollador quiere.

## 2026-11-24 — Componentes base del sistema de diseño [T18]
- Desarrollador: Ulises
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 (orquestador y diseño, skill Impeccable) + Sonnet 5.5 medium (1 subagente revisor, tres vueltas).
- Objetivo: T18 (CG-96) de la épica US24. Rediseñar los componentes compartidos con los tokens de T17 (botones, campos, tarjetas, tablas, insignias y modales), con todos sus estados y sin cambiar propiedades ni eventos.
- Qué hizo la IA:
  - **Relevamiento:** revisó las clases que usan las pantallas. No hay tablas ni botones de peligro, y hay dos diálogos.
  - **Decisiones:** preguntó las dos decisiones estéticas.
  - **`componentes.css`:** lo escribió aplicando los estilos por elemento o por las clases existentes, sin tocar JSX. `estilos.css` quedó solo con lo propio de cada pantalla.
  - **Muestrario:** armó uno con todos los estados en `.impeccable/mocks/`, que no se commitea.
  - **Capturas:** las tomó con un script de Playwright: páginas completas a 1280 y 375 px, foco por teclado en cada control y en el diálogo, error con el cursor encima, y cinco pantallas reales con la sesión de profesor01 contra el back de test.
  - **Revisión:** aplicó las correcciones del revisor en dos tandas:
    - hover que pisaba el error y el foco;
    - fecha de crear plan a todo el ancho y su etiqueta lejos del campo;
    - casilla de alumnos desalineada;
    - `.boton:active`;
    - `p.etiqueta` que no se partía;
    - "Volver al listado" estirado;
    - cajas anidadas;
    - "Por página" en dos líneas.
  - **Documentación:** actualizó `DESIGN.md`, el atlas, el `CHANGELOG` y `compartido`.
- Decisiones del desarrollador:
  - El ámbar va solo en la acción principal de cada pantalla (`.accion-principal`, que se marca en T20 a T22); el resto de los botones son verdes.
  - Las insignias son rectangulares, en caps condensadas.
  - Dentro de un formulario, los grupos van sin borde, separados solo por título y espacio.
  - Pidió la revisión antes de commitear.
- Ideas descartadas:
  - Todos los botones en verde, o todos en ámbar.
  - Insignias en píldora.
  - Grupos con fondo hundido, o dejar los tres niveles de borde.
- Reglas afectadas: ninguna regla de negocio. Los textos, roles y nombres accesibles no cambian: las mayúsculas son de CSS.
- Verificación:
  - Lint OK.
  - Vitest 210/210.
  - e2e de navegador 14/14 (antes y después de las correcciones).
  - Detector de la skill sin hallazgos.
  - Revisor: primero pidió volver a capturar, después marcó correcciones y al final aprobó las cinco correcciones de la última vuelta.
  - Hover y presionado no se capturaron: quedan como riesgo aceptado.
- Pendientes:
  - Rama `feat/T18-componentes-base` sin pushear ni PR.
  - Mover CG-96 en Jira.
  - En T20 a T22:
    - marcar `.accion-principal` y `.peligro` en cada pantalla;
    - mostrar la "Fecha de fin" de crear plan en dd/mm/aaaa;
    - decidir si "Fecha de inicio" va encima del campo en el celular.
  - Al detener el front del 5180 y el back de test, sus procesos (`vite` y `dist/main`) quedan vivos y hay que cerrarlos a mano.

## 2026-11-25 — Estructura general: marco de cancha y navegación [T19]
- Desarrollador: Ulises
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 (orquestador y diseño, skill Impeccable) + Sonnet 5.5 medium (1 subagente revisor, dos vueltas).
- Objetivo: T19 (CG-97) de la épica US24. Rediseñar la estructura general, es decir el marco con la marca, el menú por rol y "Salir", y la distribución de las páginas, con los tokens de T17 y sin cambiar opciones ni rutas.
- Qué hizo la IA:
  - **Decisiones:** preguntó las decisiones estéticas.
  - **`MenuPrincipal`:** lo reescribió como marco de cancha (`header.marco`) con la marca decorativa (`aria-hidden`), la navegación "Menú principal" con `NavLink` (la activa con `aria-current="page"`) y "Salir" fuera de la navegación.
  - **Color de sección:** sumó un color por opción en `opcionesMenu.ts`, agrupado por concepto, y `opcionActual(rol, ruta)`, que pinta la pestaña activa y la franja del marco.
  - **`estructura.css`:** lo creó con el marco, la tira de pestañas deslizable por debajo de 64rem (bordes desvanecidos y la pestaña activa llevada a la vista) y la distribución de las páginas. Sacó de `estilos.css` las reglas viejas del menú y de las páginas.
  - **Capturas:** las tomó con Playwright a 360, 375, 900, 1024, 1100 y 1280 px con profesor01 y alumno01 contra el back de test. Incluyen el foco por teclado, el control de desborde horizontal y el contador de no leídas simulado en 12.
  - **Revisión:** aplicó las correcciones del revisor:
    - el desvanecido atenuaba las pestañas de los bordes y su foco (se resolvió con `padding` y `scroll-padding-inline` iguales al desvanecido);
    - la marca no quedaba alineada con el título de las páginas anchas en escritorio;
    - la marca estaba en ámbar;
    - faltaban capturas con el contador mayor que cero y a 1024 y 1100 px.
  - **Documentación:** actualizó `DESIGN.md`, el atlas, el `CHANGELOG` y `compartido`.
- Decisiones del desarrollador:
  - En el celular, el menú es una tira de pestañas deslizable (no un menú hamburguesa).
  - La marca "CW-GYM" va en caps, en blanco de cancha: el ámbar queda solo para lo vivo y la acción principal.
  - Pidió la revisión antes de commitear.
- Ideas descartadas:
  - Menú hamburguesa o cajón lateral en el celular.
  - Barra de pestañas inferior.
  - Marca en ámbar.
- Reglas afectadas: ninguna regla de negocio. RN-UI-IDE-01 (menú por rol) se mantiene: las opciones, rutas y nombres accesibles no cambian.
- Verificación:
  - Lint OK.
  - Vitest 210/210.
  - e2e de navegador 14/14.
  - Sin desborde horizontal en ningún ancho.
  - Revisor: la primera vuelta pidió seis correcciones y la segunda aprobó las seis sin regresiones.
  - Queda sin captura el foco en la última pestaña con la tira deslizada hasta el final; el revisor no lo consideró bloqueante.
- Pendientes:
  - Rama `feat/T19-estructura-general` sin pushear ni PR.
  - Mover CG-95 a CG-97 en Jira.
  - Sigue T23 (CG-101) y después T20 a T22 y T24.

## 2026-11-25 — Rediseño de las pantallas del Profesor [T21]
- Desarrollador: Ulises
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 (orquestador y diseño, skill Impeccable) + Sonnet 5.5 medium (1 subagente revisor).
- Objetivo: T21 (CG-99) de la épica US24. Aplicar el sistema "Tanteador de club" a las pantallas del Profesor sin cambiar textos, filtros, orden ni paginación (RN-UI-LIS). La tarea se hizo antes que T23 por pedido del desarrollador.
- Qué hizo la IA:
  - **Relevamiento:** leyó la tarjeta en Jira y las de T20, T22 a T24, y vio que Ejercicios y Notificaciones del profesor no estaban en ninguna. Capturó el estado previo y armó datos de muestra en la base de test (alumnos vinculados, un plan y un entrenamiento) para ver las pantallas con contenido.
  - **Decisiones:** preguntó las cuatro decisiones estéticas.
  - **Rutinas:** tarjeta con el nombre a todo el ancho y un pie de acciones con icono de Lucide y texto ("Editar", "Importar"), con los nombres accesibles de siempre. Es el primer uso de Lucide en pantallas.
  - **Editor de rutina:** números en tres columnas (dos en el celular), GIF al costado del ejercicio, "Subir", "Bajar" y "Quitar" en una fila, y sangría para los ejercicios de un circuito.
  - **Planes:** fechas de tanteador y días en cifras. El título y el resumen completos siguen en el DOM para lectores de pantalla y para los tests.
  - **Calendario:** en crear plan y en editar días, el día con rutina lleva una franja lila y el de descanso va hundido; los días fuera del plan perdieron el desenfoque.
  - **Seguimiento:** notificaciones y entrenamientos de alumnos como tarjetas, con la gravedad en la tinta de su estado y las series en columnas.
  - **Otras pantallas:** el código del profesor en cifra grande y "Regenerar" en `.peligro`; "Volver a …" como enlace chico arriba del título; una acción principal en ámbar por pantalla.
  - **Arreglo de T19:** encontró que la pestaña activa del menú quedaba cortada en el celular cuando llegaba el contador de no leídas. Primero probó esperar a las fuentes, midió que no era eso y lo resolvió con un `ResizeObserver`. Después, a pedido del revisor, cambió `scrollIntoView` por un desplazamiento solo horizontal, para no mover la página.
  - **Revisión:** aplicó las correcciones del revisor: 44 px en "Volver a …" y en el enlace del pie de las notificaciones, el desplazamiento del menú y la nota de contraste de la franja lila en `DESIGN.md`. Quitó la franja lateral de las tarjetas de seguimiento porque el detector de la skill la marcó como patrón genérico.
  - **Fecha de fin:** la pasó a dd/mm/aaaa en un commit aparte y ajustó la aserción del test de US07, con aprobación del desarrollador. Antes comprobó que el test fallaba por la aserción.
  - **Commits:** separó `estilos.css` por partes para que cada microcommit lleve solo los estilos de sus pantallas.
  - **Documentación:** actualizó `DESIGN.md`, el atlas, el `CHANGELOG` y los `CLAUDE.md` de compartido, planificación, notificaciones, entrenamiento e identidad.
- Decisiones del desarrollador:
  - Ejercicios y Notificaciones entran en T21.
  - En la tarjeta de rutina, las acciones van al pie con icono y texto.
  - Las fechas de los planes se muestran como tanteador.
  - El calendario marca los días con rutina con una franja lila y atenúa los de descanso.
  - La "Fecha de fin" de crear plan pasa a dd/mm/aaaa, con el ajuste de la aserción en otro microcommit.
  - Pidió la revisión antes de commitear.
- Ideas descartadas:
  - Iconos solos arriba a la derecha de la tarjeta de rutina, o dejarla como estaba.
  - Fechas del plan como texto corrido.
  - Calendario sin diferenciar los días.
  - Franja lateral de color en las tarjetas de seguimiento.
  - Esperar a las fuentes para llevar la pestaña activa a la vista.
- Reglas afectadas: RN-PLAN-09, solo en la presentación: la fecha de fin se muestra en dd/mm/aaaa. Se cambió el literal de una aserción, con aprobación. El resto no cambia reglas: textos, roles, nombres accesibles, filtros, orden y paginación quedan iguales.
- Verificación:
  - Lint OK.
  - Vitest 210/210.
  - e2e de navegador 14/14.
  - Detector de la skill sin hallazgos.
  - Sin desborde horizontal a 375 y 1280 px.
  - Medido: 44 px en "Volver a …" y en el enlace del pie de las notificaciones, y la pestaña activa queda 16 px dentro del borde.
  - Revisor: pidió cinco correcciones; se aplicaron cuatro y la quinta ("Registrar ejercicio" deshabilitado) es intencional.
  - Quedan sin capturar el hover, el foco por teclado en las pantallas nuevas y las notificaciones leve y leída.
- Pendientes:
  - Rama `feat/T21-pantallas-profesor` sin pushear ni PR.
  - Mover CG-95 a CG-97 y CG-99 en Jira.
  - Siguen T23 (estados de carga, vacío y error), T20, T22 y T24.
  - La franja lila queda en 2,4:1, aceptada porque el texto del día dice lo mismo; se revisa en T24.

## 2026-11-25 — Rediseño de las pantallas del Alumno [T22]
- Desarrollador: Ulises
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 (orquestador y diseño, skill Impeccable) + Sonnet 5.5 medium (1 subagente revisor).
- Objetivo: T22 (CG-100) de la épica US24. Aplicar el sistema "Tanteador de club" a las pantallas del Alumno (vínculo, rutina del día, Mi plan, entrenamiento en curso, resumen, récords y percepción), priorizando el celular, sin cambiar el registro de series ni el resumen. Se hizo antes que T23 y T20 por pedido del desarrollador.
- Qué hizo la IA:
  - **Relevamiento:** leyó las pantallas y los textos que buscan los tests y los e2e. Capturó el estado previo con datos en la base de test: un entrenamiento en curso, uno finalizado y un alumno sin vínculo.
  - **Decisiones:** preguntó las cuatro decisiones estéticas.
  - **Entrenamiento en curso:**
    - **Tanteador:** fijo arriba en la cancha, con el tiempo en ámbar a `--cifra-1` (cierra la deuda del contador), "Paso N de M" y una barra de avance. `PasoActual` recibe el cronómetro como propiedad.
    - **Paso:** el GIF protagonista, con un tope de alto; los campos en fila, en cifras grandes; "Registrar" en ámbar a todo el ancho.
  - **Resumen:** marcador final en la cancha con el peso total, la duración y los récords; los grupos como insignias. "Volver al inicio" pasó al final de la pantalla, después de la percepción. Los textos del DOM no cambian.
  - **Rutina del día y Mi plan:** la rutina del día tiene la acción del día en una barra fija abajo y los ejercicios en filas. Mi plan pasa a una fila por día: el descanso hundido y un cuadrado lila en la rutina en lugar de una franja lateral.
  - **Vínculo:** el código se escribe en cifras grandes.
  - **Errores encontrados:**
    - Al mover el cronómetro al tanteador, desaparecía cuando el entrenamiento no tenía pasos. Lo detectó un test y se restituyó.
    - Al cambiar de paso, quedaba a la vista el GIF del ejercicio anterior mientras cargaba el nuevo. Ya pasaba antes de T22. Midió que el `src` era correcto y lo resolvió con `key={urlGif}`.
  - **Revisión:** aplicó las correcciones del revisor: las insignias en una fila, el nombre repetido en Mi plan y la confirmación del margen del tanteador. Sobre "Registrar" bajo el pliegue, puso un tope de alto al GIF sin achicarlo tanto como para contradecir la decisión del desarrollador. Midió que, del tanteador a "Registrar", hay 620 a 669 px: entra en 375×667, 360×740 y 375×812 después de un solo desplazamiento.
  - **Récords:** los capturó con la respuesta de finalización simulada solo en el navegador de la captura, sin cargar datos en la base.
  - **Commits:** el hook rechazó un primer `fix` del GIF hecho por separado, porque corre los tests con los demás archivos de la carpeta de trabajo. Se rearmó en cinco microcommits en lugar de seis: el tanteador, el paso y el resumen van juntos y el `fix` va después.
  - **Documentación:** actualizó `DESIGN.md`, el atlas, el `CHANGELOG` y los `CLAUDE.md` de entrenamiento, planificación e identidad.
- Decisiones del desarrollador:
  - Tanteador fijo arriba en el entrenamiento en curso.
  - GIF protagonista en el paso actual, en lugar de campos grandes con el GIF chico.
  - Resumen como marcador final, con el ámbar para los récords.
  - Mi plan en filas compactas, sin marcar el día de hoy.
  - Pidió la revisión antes de commitear.
- Ideas descartadas:
  - Tanteador sin fijar, o solo cifras grandes sin panel.
  - Campos grandes con el GIF chico al costado.
  - Resumen como lista sobria.
  - Mi plan con el día de hoy marcado (suma una comparación de fechas en el front), o tarjetas como antes.
  - Franja lateral lila en Mi plan.
  - Botones de más y menos en los campos de la serie (no tienen regla).
  - Un título nuevo en el formulario de percepción (no se inventan textos).
- Reglas afectadas: ninguna. RN-UI-ENT-03 (contador siempre visible) y RN-UI-ENT-05 ("Volver al inicio" en el resumen) se cumplen igual. Los textos, roles y nombres accesibles no cambian, y los tests tampoco.
- Verificación:
  - Lint OK.
  - Vitest 210/210.
  - e2e de navegador 14/14.
  - Detector de la skill sin hallazgos.
  - Sin desborde horizontal a 375 y 1280 px.
  - Revisor: primero pidió correcciones; se aplicaron todas menos achicar el GIF hasta que "Registrar" entre sin desplazar, que queda a decisión del desarrollador.
  - Quedan sin capturar el hover, el foco por teclado, los errores de series y de percepción, y un entrenamiento abandonado.
- Pendientes:
  - Rama `feat/T22-pantallas-alumno` sin pushear ni PR.
  - La "Fecha" de la rutina del día sigue en AAAA-MM-DD porque la lee un test de US08; pasarla a dd/mm/aaaa cambia una aserción.
  - Decidir si "Registrar" tiene que entrar sin desplazar al abrir el entrenamiento.
  - Mover CG-95 a CG-97, CG-99 y CG-100 en Jira.
  - Siguen T23, T20 y T24.

## 2026-11-25 — Rediseño del ingreso y de las pantallas del Administrador [T20]
- Desarrollador: Ulises
- Herramienta / modelo / esfuerzo: Claude Code · Opus 5.5 (orquestador y diseño, skill Impeccable) + Sonnet 5.5 medium (1 subagente revisor).
- Objetivo: T20 (CG-98) de la épica US24. Aplicar el sistema "Tanteador de club" al ingreso y a las pantallas del Administrador (US00, US02), sin cambiar textos, campos ni validación. Se hizo después de T22 porque otro desarrollador toma T23 y T24; la rama de T23 se había creado sin commits y se borró.
- Qué hizo la IA:
  - **Relevamiento:** leyó la tarjeta, las pantallas y lo que buscan los tests y los e2e. Para capturar el estado previo abrió Docker Desktop, levantó las bases y sembró la de test.
  - **Decisiones:** preguntó las tres decisiones estéticas.
  - **Ingreso:** la cancha hace de marco porque la pantalla no tiene menú. Va en la mitad izquierda en escritorio y en una banda arriba en el celular, con la marca, el lema y una franja con los seis colores de sección. Es decorativa (`aria-hidden`). "Ingresar" pasa a ámbar.
  - **Alta de profesor:** dos `fieldset`, "Datos personales" y "Cuenta", en dos columnas desde 48rem. "Dar de alta" en ámbar.
  - **Inicio (los tres roles):** una tarjeta de acceso por opción del menú, sacada de `opcionesMenu.ts`. El nombre accesible es "Ir a …" porque dos tests de integración buscan "Mi plan" y "Mi rutina del día" por nombre exacto y fallarían con un enlace repetido.
  - **Detector:** marcó la franja de color arriba de la tarjeta de acceso, primero como borde y después como pseudoelemento. Se cambió por el cuadrado de color que ya usa Mi plan.
  - **Revisión:** aplicó el único hallazgo importante del revisor: el ingreso dejaba 4 px de margen lateral a 360 px y ahora deja 16 px, medido a 360 y 375 px.
  - **Commits:** cuatro microcommits (ingreso, inicio, alta y documentación), cada uno con su parte de `estilos.css`.
  - **Documentación:** actualizó `DESIGN.md`, el atlas, el `CHANGELOG` y los `CLAUDE.md` de compartido e identidad.
- Decisiones del desarrollador:
  - Ingreso con la cancha partida.
  - Alta de profesor en dos grupos.
  - Accesos en el inicio de los tres roles, no solo del Administrador.
  - Pidió la revisión antes de commitear.
- Ideas descartadas:
  - Tarjeta de ingreso con la marca arriba, o el ingreso entero sobre la cancha (más superficie oscura).
  - Alta de profesor en una sola columna.
  - Accesos solo para el Administrador, o dejar el inicio vacío.
  - Franja de color arriba de las tarjetas de acceso (el detector la marca).
  - Del revisor, sin aplicar: "Contraseña inicial" a todo el ancho, otra grilla para las seis tarjetas del Profesor y cambiar el `nav` "Accesos del inicio" por un `div`.
- Reglas afectadas: ninguna. RN-IDE-01 y RN-IDE-04 se cumplen igual. Los textos, roles y nombres accesibles existentes no cambian, y los tests tampoco.
- Verificación:
  - Lint y `tsc` OK.
  - Vitest 210/210.
  - e2e de navegador 14/14.
  - Detector de la skill sin hallazgos.
  - Sin desborde horizontal de 360 a 1440 px.
  - Revisor: sin bloqueantes; el único hallazgo importante se corrigió.
- Pendientes:
  - Rama `feat/T20-ingreso-administrador` sin pushear ni PR.
  - Mover CG-95 a CG-100 en Jira.
  - Del lado de esta sesión, la épica queda cerrada; T23 y T24 los toma otro desarrollador.
