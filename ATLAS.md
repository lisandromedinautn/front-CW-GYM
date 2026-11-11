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
| `docs/MODELOS-IA.md` | Modelos, delegación y plantillas (idéntica a la del back) |
| `.claude/settings.json` | Permisos: confirmación al editar tests e instalar paquetes |
| `.claude/skills/tdd`, `.claude/skills/coverage` | Skills de TDD y cobertura |
| `e2e/<modulo>/` | Tests e2e de Playwright. ✅ `e2e/planificacion/crear-rutina.e2e.ts` (US06) y `e2e/planificacion/crear-rutina-circuitos.e2e.ts` (US09); el resto 📄 |

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
| planificacion | `EditorRutina.tsx` (ruta `/profesor/rutinas`, menú "Rutinas") | `usarCrearRutina.ts`, `usarEjerciciosParaRutina.ts`, `usarEditarRutina.ts` | `GET /catalogo/ejercicios`, `POST /planificacion/rutinas`, `PUT /planificacion/rutinas/:id` | US06, US09, US10 | ✅ crear con bloques (US06) y con circuitos (US09); editar y mixta 📄 |
| planificacion | `PaginaImportarRutina.tsx` | `usarImportarRutina.ts` | `POST /planificacion/rutinas/:id/importacion` | US20 | 📄 |
| planificacion | `PaginaCrearPlan.tsx` | `usarCrearPlan.ts` | `POST /planificacion/planes` | US07 | 📄 |
| planificacion | `PaginaAlumnosDelPlan.tsx` | `usarAlumnosDelPlan.ts` | `POST/DELETE /planificacion/planes/:id/alumnos` | US12 | 📄 |
| planificacion | `PaginaRutinaDelDia.tsx` | `usarRutinaDelDia.ts` | `GET /planificacion/mi-rutina-del-dia` | US08 | 📄 |
| planificacion | `PaginaMiPlan.tsx` | `usarMiPlan.ts` | `GET /planificacion/mi-plan` | US11 | 📄 |
| entrenamiento | `PaginaEntrenamientoEnCurso.tsx` | `usarIniciarEntrenamiento.ts`, `usarEntrenamientoEnCurso.ts`, `usarRegistrarSerie.ts` | `POST /entrenamiento/entrenamientos`, `GET /entrenamiento/mi-entrenamiento-en-curso`, `POST .../:id/series` | US13, US14 | 📄 |
| entrenamiento | `PaginaResumenEntrenamiento.tsx` | `usarFinalizarEntrenamiento.ts`, `usarRegistrarPercepcion.ts` | `POST .../:id/finalizacion`, `PUT .../:id/percepcion` | US15, US16, US17 | 📄 |
| entrenamiento | `PaginaEntrenamientosDeAlumnos.tsx` | `usarEntrenamientosDeAlumnos.ts` | `GET /entrenamiento/alumnos/:alumnoId/entrenamientos` | US18 | 📄 |

## Clientes de API del módulo

| Ruta | Qué es | Estado |
| :-- | :-- | :-- |
| `src/modulos/identidad/infraestructura/api/apiIdentidad.ts` | Ingreso, alta de profesor, código de profesor y vínculo del alumno | ✅ |
| `src/modulos/catalogo/infraestructura/api/apiCatalogo.ts` | Consulta paginada de ejercicios con filtros | ✅ |
| `src/modulos/planificacion/infraestructura/api/apiPlanificacion.ts` | Catálogo para el editor, listado, alta y renombrado de rutinas | ✅ |

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

## Carpetas por concepto

Decidido por Lisandro el 08/11/2026 (igual que en el back): en todas las capas de cada módulo y en `src/compartido/`, cada concepto o pantalla tiene su carpeta, con el código y su test juntos.

| Módulo | Capa | Carpetas |
| :-- | :-- | :-- |
| identidad | aplicacion · presentacion | ingreso, alta-profesor, codigo-profesor, vinculo (hook y página de cada pantalla, con el mismo nombre de carpeta en las dos capas) |
| identidad | infraestructura | api (`apiIdentidad.ts`) |
| catalogo | dominio | ejercicio (`ejercicio.ts`, `clasificacion.ts`) |
| catalogo | aplicacion · presentacion | consultar-ejercicios · lista-ejercicios |
| catalogo | infraestructura | api (`apiCatalogo.ts`) |
| planificacion | dominio | bloque (`reglasBloque.ts` y su test), circuito (`reglasCircuito.ts` y su test), rutina (tipos del contrato y `nombreRutina.ts` con su test) |
| planificacion | aplicacion · presentacion | editor-rutina · editor-rutina; consultar-rutinas · consultar-rutinas; renombrar-rutina (solo aplicacion) |
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
