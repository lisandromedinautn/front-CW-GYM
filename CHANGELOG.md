# Changelog — front-CW-GYM

Cambios por versión (decisión 38 de `docs/PLANIFICACION.md`). Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y [versionado semántico](https://semver.org/lang/es/). Front y back publican la misma `MAJOR.MINOR` en cada hito.

Categorías: Agregado, Cambiado, Corregido, Eliminado, Seguridad. Cada entrada cita su tarjeta.

## [Sin publicar]

### Agregado

- Pantalla "Nuevo plan" en `/profesor/planes`: el profesor elige la fecha de inicio (el fin se calcula solo), asigna una rutina o descanso a cada uno de los 28 días y selecciona los alumnos vinculados (US07).
- Opción "Planes" en el menú del Profesor.
- Helpers de fechas y contrato del plan en `dominio/plan/plan.ts`, y hooks `usarCrearPlan` y `usarDatosParaPlan` (US07).

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
