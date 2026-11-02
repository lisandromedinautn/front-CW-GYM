# Módulo Catálogo (`catalogo`) — front

Registro y listado de ejercicios (Admin). El texto de las reglas RN-CAT está en `../back-CW-GYM/src/modulos/catalogo/CLAUDE.md`.

## Reglas que aplica la UI

| ID | Qué hace la UI | Estado |
| :-- | :-- | :-- |
| RN-CAT-01 | El formulario exige nombre, descripción, tipo, tipo de carga y músculo principal. El secundario es opcional. Si el nombre ya existe, muestra el error del back (RN-CAT-07) | Vigente |
| RN-CAT-02 | El tipo de ejercicio se elige de una lista cerrada: por tiempo o por repeticiones | Vigente |
| RN-CAT-03 | El tipo de carga se elige de una lista cerrada de 4 valores | Vigente |
| RN-CAT-04 | El factor de peso corporal arranca en 100% y solo acepta valores mayores que 0% y hasta 100% | Vigente |
| RN-CAT-05 | Los músculos se eligen de la lista cerrada; el grupo muscular se muestra derivado y no se elige | Vigente |
| RN-CAT-06 | El campo factor solo se habilita si el tipo de carga incluye peso corporal | Vigente |

## Pantallas y hooks planificados

| Pantalla (`presentacion/`) | Hook (`aplicacion/`) | US |
| :-- | :-- | :-- |
| `PaginaRegistrarEjercicio.tsx` | `usarRegistrarEjercicio.ts` | US01 |
| `ListaEjercicios.tsx` (componente reutilizable por el editor de rutinas) | `usarListarEjercicios.ts` | US01, US06 |

## Historial de cambios de reglas de UI

| Fecha | Regla | Cambio | Quién lo decidió |
| :-- | :-- | :-- | :-- |
| 01/11/2026 | Todas | Versión inicial | Lisandro |
| 01/11/2026 | RN-CAT-01, 04, 05 | Se reflejan ZG-03, ZG-04 y ZG-05 | Lisandro |
