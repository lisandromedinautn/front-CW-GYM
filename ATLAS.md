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
| `e2e/<modulo>/` | Tests e2e de Playwright (se crean con la suite) 📄 |

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
| catalogo | `ListaEjercicios.tsx` | `usarListarEjercicios.ts` | `GET /catalogo/ejercicios` | T01, US06 | ✅ |
| planificacion | `EditorRutina.tsx` | `usarCrearRutina.ts`, `usarEditarRutina.ts` | `POST /planificacion/rutinas`, `PUT /planificacion/rutinas/:id` | US06, US09, US10 | 📄 |
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
| `src/modulos/identidad/infraestructura/apiIdentidad.ts` | Ingreso, alta de profesor, código de profesor y vínculo del alumno | ✅ |
| `src/modulos/catalogo/infraestructura/apiCatalogo.ts` | Listado de ejercicios | ✅ |

## Compartido (`src/compartido/`)

| Ruta | Qué es | Estado |
| :-- | :-- | :-- |
| `dominio/sesion.ts` | Tipo `Rol`, interfaz `Sesion` y `RUTA_INICIO` por rol | ✅ |
| `dominio/errorApi.ts` | Contrato de error del back (`{ codigo, mensaje }`) y `esErrorApi` | ✅ |
| `dominio/opcionesMenu.ts` | Opciones del menú por rol (RN-UI-IDE-01) | ✅ |
| `infraestructura/almacenSesion.ts` | Sesión en `localStorage` (`cwgym.sesion`) con suscripción | ✅ |
| `infraestructura/clienteHttp.ts` | `pedir()`: URL base, JWT, traducción a `ErrorApi` y cierre de sesión ante 401 (RN-UI-IDE-02) | ✅ |
| `aplicacion/usarSesion.ts` | Hook de sesión sobre `useSyncExternalStore` | ✅ |
| `presentacion/RutaProtegida.tsx` | Guard por rol: sin sesión lleva al ingreso, con otro rol muestra "sin acceso" (RN-IDE-03) | ✅ |
| `presentacion/MenuPrincipal.tsx` | Menú por rol y "Salir" (RN-UI-IDE-01) | ✅ |
| `presentacion/DisenioConMenu.tsx` | Layout con el menú para las rutas por rol | ✅ |
| `presentacion/PaginaInicio.tsx` | Inicio de cada rol (placeholder "Panel del {rol}") | ✅ |
| `presentacion/Proximamente.tsx` | Texto para las rutas que todavía no tienen página | ✅ |

## Tests de integración (front)

Los tests viven junto a la pantalla o componente que prueban. Las fichas de cada uno están en `FICHAS-TEST.md` del módulo.

| Ruta | Reglas | Estado |
| :-- | :-- | :-- |
| `src/modulos/identidad/presentacion/PaginaIngreso.int.test.tsx` | RN-IDE-01 | ✅ |
| `src/compartido/presentacion/RutaProtegida.int.test.tsx` | RN-IDE-03 | ✅ |
| `src/compartido/presentacion/MenuPrincipal.int.test.tsx` | RN-UI-IDE-01 | ✅ |
| `src/compartido/infraestructura/clienteHttp.int.test.tsx` | RN-UI-IDE-02 | ✅ |
| `src/modulos/identidad/presentacion/PaginaAltaProfesor.int.test.tsx` | RN-IDE-04, 06, 13 | ✅ |
| `src/modulos/identidad/presentacion/PaginaCodigoProfesor.int.test.tsx` | RN-IDE-08 | ✅ |
| `src/modulos/identidad/presentacion/PaginaVincularProfesor.int.test.tsx` | RN-IDE-09, 10, 11 | ✅ |
| `src/modulos/catalogo/presentacion/ListaEjercicios.int.test.tsx` | RN-CAT-01, 09 | ✅ |

## Nombres de archivo

| Tipo | Patrón | Capa |
| :-- | :-- | :-- |
| Tipos y validaciones | `<nombre>.ts` | dominio |
| Caso de uso de UI (hook) | `usar<Accion>.ts` | aplicacion |
| Cliente de API del módulo | `api<Modulo>.ts` | infraestructura |
| Página / componente | `Pagina<Nombre>.tsx` / `<Nombre>.tsx` | presentacion |
| Test unitario / integración | `*.test.ts` / `*.int.test.tsx` | junto al archivo |
