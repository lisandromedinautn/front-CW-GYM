# Changelog — front-CW-GYM

Cambios por versión (decisión 38 de `docs/PLANIFICACION.md`). Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y [versionado semántico](https://semver.org/lang/es/). Front y back publican la misma `MAJOR.MINOR` en cada hito.

Categorías: Agregado, Cambiado, Corregido, Eliminado, Seguridad. Cada entrada cita su tarjeta.

## [Sin publicar]

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
