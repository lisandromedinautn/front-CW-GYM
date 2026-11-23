# ATLAS — front-CW-GYM

Mapa del repo para navegar sin recorrer carpetas. **Se actualiza en el mismo commit que crea, mueve o borra una pantalla, un hook o un test.** Estado: 📄 planificado · ✅ existe.

## Raíz

| Ruta | Qué es |
| :-- | :-- |
| `CLAUDE.md` | Reglas globales (arquitectura, paquetes, testing, git, IA) |
| `ATLAS.md` | Este mapa |
| `DECISIONES-IA.md` | Auditoría de sesiones con IA |
| `docs/PLANIFICACION.md` | Copia de la planificación (idéntica a la del back) |
| `docs/TESTING.md` | Protocolo de testing del front |
| `docs/TRAZABILIDAD.md` | Matriz US → RN → caso de uso → test (idéntica a la del back) |
| `docs/METRICAS-SPRINT-2.md` | Corte del 14/11: métricas del sprint 2, residual V2, fuentes y pronósticos condicionales |
| `docs/MODELOS-IA.md` | Modelos, delegación y plantillas (idéntica a la del back) |
| `.claude/settings.json` | Permisos: confirmación al editar tests e instalar paquetes |
| `.claude/skills/tdd`, `.claude/skills/coverage` | Skills de TDD y cobertura |
| `e2e/<modulo>/` | Tests e2e de Playwright. ✅ `e2e/planificacion/crear-rutina.e2e.ts` (US06), `crear-rutina-circuitos.e2e.ts` (US09), `crear-rutina-mixta.e2e.ts` (US10) e `importar-rutina.e2e.ts` (US20) |

## Configuración y arranque

| Ruta | Qué es |
| :-- | :-- |
| `package.json`, `yarn.lock` | Dependencias exactas, scripts y `resolutions` (regla de las 24 h) ✅ |
| `vite.config.ts` | Vite, Vitest y umbrales de cobertura ✅ |
| `playwright.config.ts`, `e2e/` | e2e de navegador ✅ |
| `src/pruebas/` | Preparación de Vitest y red falsa (MSW) ✅ |
| `eslint.config.js`, `.prettierrc.json` | Lint con las reglas de capas del `CLAUDE.md` y formato ✅ |
| `eslint/reglas-de-hooks.js` | Regla local de lint: reglas de los hooks también para `usar<Accion>` ✅ |
| `.husky/`, `scripts/` | Hooks, validador de mensajes y verificación de antigüedad de paquetes ✅ |
| `index.html`, `src/main.tsx`, `src/Aplicacion.tsx` | Arranque y raíz de composición (rutas por rol, US00) ✅ |
| `src/estilos.css` | Estilos globales de la app ✅ |
| `src/vite-env.d.ts` | Tipos de Vite para `import.meta.env` ✅ |
| `.env.example` | `VITE_URL_API` ✅ |
| `CHANGELOG.md` | Cambios por versión (decisión 38) ✅ |
| `src/modulos/planificacion/presentacion/detalle-rutina/DetalleRutina.tsx` | Detalle visual de ejercicios, objetivos y pausas; extraído de US08 para compartir con la vista de US11 |
| `src/modulos/planificacion/dominio/plan/miPlan.ts` | Contrato del plan vigente completo del alumno; reutiliza el detalle de rutina de US08 (US11) |

## Módulos

| Módulo | Reglas de UI | Fichas | Reglas completas (back) |
| :-- | :-- | :-- | :-- |
| Identidad y Vínculos | `src/modulos/identidad/CLAUDE.md` | `src/modulos/identidad/FICHAS-TEST.md` | `../back-CW-GYM/src/modulos/identidad/CLAUDE.md` |
| Catálogo | `src/modulos/catalogo/CLAUDE.md` | `src/modulos/catalogo/FICHAS-TEST.md` | `../back-CW-GYM/src/modulos/catalogo/CLAUDE.md` |
| Planificación | `src/modulos/planificacion/CLAUDE.md` | `src/modulos/planificacion/FICHAS-TEST.md` | `../back-CW-GYM/src/modulos/planificacion/CLAUDE.md` |
| Entrenamiento | `src/modulos/entrenamiento/CLAUDE.md` | `src/modulos/entrenamiento/FICHAS-TEST.md` | `../back-CW-GYM/src/modulos/entrenamiento/CLAUDE.md` |
| Compartido | `src/compartido/CLAUDE.md` | — | — |

## Pantallas → hook → endpoint del back

| Módulo | Pantalla | Hook | Endpoint | US | Estado |
| :-- | :-- | :-- | :-- | :-- | :-- |
| identidad | `PaginaIngreso.tsx` | `usarIngresarAlSistema.ts` | `POST /identidad/ingreso` | US00 | ✅ |
| identidad | `PaginaAltaProfesor.tsx` | `usarDarAltaProfesor.ts` | `POST /identidad/profesores` | US02 | ✅ |
| identidad | `PaginaCodigoProfesor.tsx` | `usarCodigoProfesor.ts` | `GET` y `POST /identidad/profesores/codigo` | US04 | ✅ |
| identidad | `PaginaVincularProfesor.tsx` | `usarVincularAlumno.ts` | `POST /identidad/alumnos/vinculo` | US05 | ✅ |
| catalogo | ~~`PaginaRegistrarEjercicio.tsx`~~ solo botón deshabilitado en ListaEjercicios (DT-06) | ~~`usarRegistrarEjercicio.ts`~~ | ~~`POST /catalogo/ejercicios`~~ | US01 (DT-06) | — |
| catalogo | `ListaEjercicios.tsx` | `usarConsultarEjercicios.ts` | `GET /catalogo/ejercicios/consulta` | T01, T06, T07 | ✅ |
| planificacion | `PaginaRutinas.tsx` (ruta `/profesor/rutinas`) | `usarConsultarRutinas.ts`, `usarRenombrarRutina.ts` | `GET /planificacion/rutinas`, `PATCH /planificacion/rutinas/:id/nombre` | T06, T08, T09 | ✅ |
| planificacion | `EditorRutina.tsx` (ruta `/profesor/rutinas`, menú "Rutinas") | `usarCrearRutina.ts`, `usarEjerciciosParaRutina.ts`, `usarEditarRutina.ts` | `GET /catalogo/ejercicios`, `POST /planificacion/rutinas`, `PUT /planificacion/rutinas/:id` | US06, US09, US10 | ✅ crear con bloques (US06), con circuitos (US09) y mixta (US10); editar 📄 |
| planificacion | `PaginaRutinas.tsx` (acción "Importar como copia") | `usarImportarRutina.ts` | `POST /planificacion/rutinas/:id/importacion` | US20 | ✅ |
| planificacion | `PaginaCrearPlan.tsx` (ruta `/profesor/planes`) | `usarCrearPlan.ts`, `usarDatosParaPlan.ts` | `GET /identidad/alumnos`, `GET /planificacion/rutinas`, `POST /planificacion/planes` | US07 | ✅ |
| planificacion | `PaginaPlanes.tsx` (`consultar-planes/`, ruta `/profesor/planes`, menú "Planes"; "Nuevo plan" navega a `/profesor/planes/nuevo`, `crear-plan/PaginaNuevoPlan.tsx`, que muestra `PaginaCrearPlan`) | `usarConsultarPlanes.ts` (`consultar-planes/`) | `GET /planificacion/planes`, `GET /identidad/alumnos` | T13 | ✅ |
| planificacion | `PaginaAlumnosDelPlan.tsx` | `usarAlumnosDelPlan.ts` | `GET/POST/DELETE /planificacion/planes/:id/alumnos` | US12 | ✅ |
| planificacion | `PaginaRutinaDelDia.tsx` (`presentacion/rutina-del-dia/`, ruta `/alumno/rutina-del-dia`) | `usarRutinaDelDia.ts` (`aplicacion/consultar-rutina-del-dia/`) | `GET /planificacion/mi-rutina-del-dia` | US08 | ✅ |
| planificacion | `mi-plan/PaginaMiPlan.tsx` | `consultar-plan-del-alumno/usarMiPlan.ts` | `GET /planificacion/mi-plan` | US11 | ✅ `PaginaMiPlan.int.test.tsx` (9 casos) |
| entrenamiento | `AccionesEntrenamiento.tsx`, `PaginaEntrenamientoEnCurso.tsx` (`/alumno/entrenamiento`) | `usarIniciarEntrenamiento.ts`, `usarEntrenamientoEnCurso.ts` | `POST /entrenamiento/entrenamientos`, `GET /entrenamiento/mi-entrenamiento-en-curso` | US13 | ✅ `entrenamiento.int.test.tsx` |
| entrenamiento | `PaginaEntrenamientoEnCurso.tsx`, `PasoActual.tsx` (paso a paso), `FormularioSerie.tsx` y `ListaSeries.tsx` (solo lectura si está abandonado), en `/alumno/entrenamiento` | `usarRegistrarSerie.ts` (`aplicacion/registrar-serie/`) | `POST /entrenamiento/entrenamientos/:id/series` | US14 | ✅ `RegistrarSerie.int.test.tsx`; dominio `serie/serie.ts` (validación, `serie.test.ts`) y `serie/filasSeries.ts` (pasos por bloque y vuelta, con el GIF de cada ejercicio, T14) |
| entrenamiento | `ResumenEntrenamiento.tsx`, `PaginaEntrenamientoEnCurso.tsx` | `usarFinalizarEntrenamiento.ts` | `POST .../:id/finalizacion` | US15 | ✅ 4 pruebas de integración |
| entrenamiento | `PaginaResumenEntrenamiento.tsx` (planificada; récords en US16, percepción en US17) | `usarRegistrarPercepcion.ts` | `PUT .../:id/percepcion` | US16, US17 | 📄 |
| entrenamiento | `PaginaEntrenamientosDeAlumnos.tsx` (`presentacion/entrenamientos-de-alumnos/`, ruta `/profesor/entrenamientos`, menú "Entrenamientos") | `usarEntrenamientosDeAlumnos.ts` (`aplicacion/consultar-entrenamientos-de-alumnos/`) | `GET /identidad/alumnos`, `GET /entrenamiento/alumnos/:alumnoId/entrenamientos` | US18 | ✅ `PaginaEntrenamientosDeAlumnos.int.test.tsx` (8 casos); dominio `entrenamientos-de-alumnos/entrenamientosDeAlumnos.ts` (fecha en hora de Argentina, estado, orden y total de series; `entrenamientosDeAlumnos.test.ts`) |

## Clientes de API del módulo

| Ruta | Qué es | Estado |
| :-- | :-- | :-- |
| `src/modulos/identidad/infraestructura/api/apiIdentidad.ts` | Ingreso, alta de profesor, código de profesor y vínculo del alumno | ✅ |
| `src/modulos/catalogo/infraestructura/api/apiCatalogo.ts` | Consulta paginada de ejercicios con filtros | ✅ |
| `src/modulos/planificacion/infraestructura/api/apiPlanificacion.ts` | Catálogo para el editor, listado, alta y renombrado de rutinas; alumnos del profesor, rutinas y alta de plan (US07); rutina del día del alumno (US08) | ✅ |
| `src/modulos/entrenamiento/infraestructura/api/apiEntrenamiento.ts` | Inicio y consulta del entrenamiento (US13); registro de una serie realizada (US14); alumnos vinculados y entrenamientos de un alumno, paginados (US18) | ✅ |

## Compartido (`src/compartido/`)

| Ruta | Qué es | Estado |
| :-- | :-- | :-- |
| `dominio/sesion/sesion.ts` | Tipo `Rol`, interfaz `Sesion` y `RUTA_INICIO` por rol | ✅ |
| `dominio/paginacion/paginacion.ts` | `TAMANIOS_PAGINA`, `Pagina<T>` y `totalPaginas` (T06) | ✅ |
| `aplicacion/paginacion/usarTamanioPagina.ts` | Tamaño de página recordado por listado en `localStorage` | ✅ |
| `presentacion/paginador/Paginador.tsx` | Anterior, Siguiente, "Página X de Y" y "Por página" (T06) | ✅ |
| `dominio/error-api/errorApi.ts` | Contrato de error del back (`{ codigo, mensaje }`) y `esErrorApi` | ✅ |
| `dominio/menu/opcionesMenu.ts` | Opciones del menú por rol (RN-UI-IDE-01) | ✅ |
| `infraestructura/sesion/almacenSesion.ts` | Sesión en `localStorage` (`cwgym.sesion`) con suscripción | ✅ |
| `infraestructura/cliente-http/clienteHttp.ts` | `pedir()`: URL base, JWT, traducción a `ErrorApi` y cierre de sesión ante 401 (RN-UI-IDE-02) | ✅ |
| `aplicacion/sesion/usarSesion.ts` | Hook de sesión sobre `useSyncExternalStore` | ✅ |
| `presentacion/ruta-protegida/RutaProtegida.tsx` | Guard por rol: sin sesión lleva al ingreso, con otro rol muestra "sin acceso" (RN-IDE-03) | ✅ |
| `presentacion/menu/MenuPrincipal.tsx` | Menú por rol y "Salir" (RN-UI-IDE-01) | ✅ |
| `presentacion/menu/DisenioConMenu.tsx` | Layout con el menú para las rutas por rol | ✅ |
| `presentacion/inicio/PaginaInicio.tsx` | Inicio de cada rol (placeholder "Panel del {rol}") | ✅ |
| `presentacion/proximamente/Proximamente.tsx` | Texto para las rutas que todavía no tienen página | ✅ |

## Tests de integración (front)

Los tests viven junto a la pantalla o componente que prueban. Las fichas de cada uno están en `FICHAS-TEST.md` del módulo.

| Ruta | Reglas | Estado |
| :-- | :-- | :-- |
| `src/modulos/identidad/presentacion/ingreso/PaginaIngreso.int.test.tsx` | RN-IDE-01 | ✅ |
| `src/compartido/presentacion/ruta-protegida/RutaProtegida.int.test.tsx` | RN-IDE-03 | ✅ |
| `src/compartido/presentacion/menu/MenuPrincipal.int.test.tsx` | RN-UI-IDE-01 | ✅ |
| `src/compartido/infraestructura/cliente-http/clienteHttp.int.test.tsx` | RN-UI-IDE-02 | ✅ |
| `src/modulos/identidad/presentacion/alta-profesor/PaginaAltaProfesor.int.test.tsx` | RN-IDE-04, 06, 13 | ✅ |
| `src/modulos/identidad/presentacion/codigo-profesor/PaginaCodigoProfesor.int.test.tsx` | RN-IDE-08 | ✅ |
| `src/modulos/identidad/presentacion/vinculo/PaginaVincularProfesor.int.test.tsx` | RN-IDE-09, 10, 11 | ✅ |
| `src/modulos/catalogo/presentacion/lista-ejercicios/ListaEjercicios.int.test.tsx` | RN-CAT-01, 09 | ✅ |
| `src/modulos/catalogo/presentacion/lista-ejercicios/ListaEjerciciosPaginada.int.test.tsx` | RN-CAT-09, T06, RN-UI-LIS-01, 02, 03 | ✅ |
| `src/compartido/presentacion/paginador/Paginador.test.tsx` | T06 | ✅ |
| `src/modulos/planificacion/dominio/rutina/nombreRutina.test.ts` | RN-PLAN-21 | ✅ |
| `src/modulos/planificacion/presentacion/consultar-rutinas/PaginaRutinas.int.test.tsx` | RN-PLAN-21, 08, T06 | ✅ |
| `src/modulos/planificacion/presentacion/crear-plan/PaginaCrearPlan.int.test.tsx` | RN-PLAN-09, 11, 12, 13, 14, US07 | ✅ |
| `src/modulos/planificacion/presentacion/consultar-planes/PaginaPlanes.int.test.tsx` | RN-PLAN-22, RN-UI-LIS-01, 02, 03 | ✅ |
| `src/modulos/planificacion/dominio/plan/rutinaDelDia.test.ts` | Objetivos y etiqueta del día (US08) | ✅ |
| `src/modulos/planificacion/presentacion/rutina-del-dia/PaginaRutinaDelDia.int.test.tsx` | RN-PLAN-11, 18; rutina, descanso, sin plan y error HTTP | ✅ |
| `src/modulos/planificacion/presentacion/rutina-del-dia/PaginaRutinaDelDiaDetalles.int.test.tsx` | RN-PLAN-11, 18, 02, 03; fecha, pausas y acceso por rol (RN-IDE-03) | ✅ |

## Carpetas por concepto

Decidido por Lisandro el 08/11/2026 (igual que en el back): en todas las capas de cada módulo y en `src/compartido/`, cada concepto o pantalla tiene su carpeta, con el código y su test juntos.

| Módulo | Capa | Carpetas |
| :-- | :-- | :-- |
| identidad | aplicacion · presentacion | ingreso, alta-profesor, codigo-profesor, vinculo (hook y página de cada pantalla, con el mismo nombre de carpeta en las dos capas) |
| identidad | infraestructura | api (`apiIdentidad.ts`) |
| catalogo | dominio | ejercicio (`ejercicio.ts`, `clasificacion.ts`) |
| catalogo | aplicacion · presentacion | consultar-ejercicios · lista-ejercicios |
| catalogo | infraestructura | api (`apiCatalogo.ts`) |
| planificacion | dominio | bloque (`reglasBloque.ts` y su test), circuito (`reglasCircuito.ts` y su test), rutina (tipos del contrato y `nombreRutina.ts` con su test), plan (fechas del plan y tipos del contrato, con su test) |
| planificacion | aplicacion · presentacion | editor-rutina · editor-rutina; consultar-rutinas · consultar-rutinas; renombrar-rutina (solo aplicacion); crear-plan · crear-plan; consultar-planes · consultar-planes; consultar-rutina-del-dia · rutina-del-dia; consultar-plan-del-alumno · mi-plan; detalle-rutina (componente compartido del módulo) |
| planificacion | infraestructura | api (`apiPlanificacion.ts`) |
| compartido | dominio | error-api, menu, paginacion, sesion |
| compartido | aplicacion · infraestructura | paginacion, sesion · sesion, cliente-http |
| compartido | presentacion | menu, inicio, paginador, proximamente, ruta-protegida |

## Nombres de archivo

| Tipo | Patrón | Capa |
| :-- | :-- | :-- |
| Tipos y validaciones | `<nombre>.ts` | dominio |
| Caso de uso de UI (hook) | `usar<Accion>.ts` | aplicacion |
| Cliente de API del módulo | `api<Modulo>.ts` | infraestructura |
| Página / componente | `Pagina<Nombre>.tsx` / `<Nombre>.tsx` | presentacion |
| Test unitario / integración | `*.test.ts` / `*.int.test.tsx` | junto al archivo |
