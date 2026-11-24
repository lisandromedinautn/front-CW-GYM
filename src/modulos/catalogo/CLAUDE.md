# Módulo Catálogo (`catalogo`) — front

Listado de ejercicios del catálogo, que se carga desde el dataset de ejercicios (T01). El registro manual queda fuera del MVP (DT-06). El texto de las reglas RN-CAT está en `../back-CW-GYM/src/modulos/catalogo/CLAUDE.md`.

## Reglas que aplica la UI

| ID | Qué hace la UI | Estado |
| :-- | :-- | :-- |
| RN-CAT-01 | La lista de ejercicios muestra nombre, tipo, tipo de carga, músculo principal y grupo muscular. El botón "Registrar ejercicio" se ve deshabilitado (DT-06) | Vigente ✅ |
| RN-CAT-05 | El grupo muscular se muestra derivado del músculo. En los filtros, "Músculo principal" ofrece solo los músculos del grupo elegido; si el músculo elegido no pertenece al grupo nuevo, vuelve a "Todos" | Vigente ✅ |
| RN-CAT-02, 03, 05 | Las listas cerradas de los filtros (tipo, tipo de carga, grupos y músculos) están en `dominio/ejercicio/clasificacion.ts` y reflejan las del back | Vigente ✅ |
| RN-UI-LIS-01 a 04, T06 | El listado se consulta paginado (20 por defecto) con buscador y 4 filtros (Grupo muscular, Músculo principal, Tipo, Tipo de carga), "Limpiar filtros", GIF en miniatura y el aviso "No hay ejercicios con esos filtros" | Vigente ✅ |
| RN-CAT-09 | El GIF se muestra con la atribución "© Gym visual — https://gymvisual.com/" | Vigente ✅ |

## Pantallas y hooks

| Pantalla (`presentacion/`) | Hook (`aplicacion/`) | US | Estado |
| :-- | :-- | :-- | :-- |
| ~~`PaginaRegistrarEjercicio.tsx`~~ solo botón deshabilitado en `ListaEjercicios` (DT-06) | ~~`usarRegistrarEjercicio.ts`~~ | ~~US01~~ (DT-06) | — |
| `ListaEjercicios.tsx` | `usarConsultarEjercicios.ts` (`GET /catalogo/ejercicios/consulta`) | T01, T06, T07 | ✅ |

El cliente de la API del módulo está en `infraestructura/api/apiCatalogo.ts` ✅ (`consultarEjercicios`). El editor de rutinas no usa este módulo: pide `GET /catalogo/ejercicios` (sin paginar) con su propio cliente en planificación.

## Historial de cambios de reglas de UI

| Fecha | Regla | Cambio | Quién lo decidió |
| :-- | :-- | :-- | :-- |
| 01/11/2026 | Todas | Versión inicial | Lisandro |
| 01/11/2026 | RN-CAT-01, 04, 05 | Se reflejan ZG-03, ZG-04 y ZG-05 | Lisandro |
| 08/11/2026 | RN-CAT-01, 05, 09; se quitan RN-CAT-02, 03, 04 y 06 de la UI | Decisión 41: US01 sale del MVP (DT-06). La UI pasa a ser solo lista, con el grupo derivado y la atribución del GIF | Lisandro |
| 11/11/2026 | RN-UI-LIS-01 a 04, T06 | Se confirman las reglas de listados; el listado pasa a consulta paginada con filtros y GIF en miniatura | Lisandro |
