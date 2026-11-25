# Compartido (`compartido`) — front

Lo mínimo que usan todos los módulos. Acá no va lógica de un módulo en particular. Estado: ✅ existe · 📄 planificado.

| Capa | Contenido |
| :-- | :-- |
| `dominio/` | `TAMANIOS_PAGINA`, `Pagina<T>` y `totalPaginas` (`paginacion/paginacion.ts`) ✅; `Rol`, `Sesion` y `RUTA_INICIO` (`sesion.ts`) ✅; `ErrorApi` (`{ codigo, mensaje }`) y `esErrorApi` (`errorApi.ts`) ✅; opciones del menú por rol (`opcionesMenu.ts`) ✅ |
| `aplicacion/` | `usarSesion` (`usarSesion.ts`) ✅; `usarTamanioPagina` (`paginacion/usarTamanioPagina.ts`) ✅ |
| `infraestructura/` | Cliente HTTP base `pedir()` (URL de la API por variable de entorno de Vite, adjunta el JWT, traduce errores a `ErrorApi`) ✅ (`clienteHttp.ts`); almacenamiento de la sesión (`almacenSesion.ts`) ✅ |
| `presentacion/` | `Paginador` (`paginador/Paginador.tsx`) ✅; `RutaProtegida` por rol (RN-IDE-03) ✅; layout con menú por rol (`DisenioConMenu`, `MenuPrincipal`, RN-UI-IDE-01) ✅; `PaginaInicio` ✅; `Proximamente` ✅; sistema de diseño `estilos/tokens.css` y `estilos/base.css` (T17) ✅; componentes base `estilos/componentes.css` (T18) ✅; estructura general `estilos/estructura.css` y marco de cancha en `MenuPrincipal` (T19) ✅; componentes genéricos de mensaje de error por `codigo`, carga y confirmación 📄 |

## Decisiones de implementación

- **Sistema de diseño** (T17, CG-95; decidido por Ulises el 24/11/2026):
  - La dirección visual es «Tanteador de club». Tiene un marco verde de cancha, ámbar de marcador solo para lo vivo, fondo claro, Barlow y Barlow Condensed, y cifras tabulares en una rampa fija de cuatro tamaños.
  - Todo valor visual vive en `presentacion/estilos/tokens.css`. `src/estilos.css` importa las fuentes (`@fontsource`, solo los pesos usados), los tokens y `presentacion/estilos/base.css`, y no repite colores, tamaños ni espaciados sueltos.
  - Los iconos son de Lucide (`lucide-react`).
  - Detalle en `DESIGN.md`. El producto (usuarios, contexto y WCAG 2.2 AA) está en `PRODUCT.md`.
- **Componentes base** (T18, CG-96; decidido por Ulises el 24/11/2026):
  - Viven en `presentacion/estilos/componentes.css` y se aplican por elemento o por las clases que ya usan las pantallas. `src/estilos.css` conserva solo lo propio de cada pantalla.
  - Botones en caps condensadas de 44 px. El ámbar (`.accion-principal`) va **solo en la acción principal de cada pantalla**; el resto, en verde de acción.
  - Variantes `.secundario`, `.peligro`, `.enlace` y `.boton-icono`.
  - Insignias rectangulares en caps condensadas (`.insignia-*`, `.etiqueta`, `.estado-plan-*`).
  - Las mayúsculas son de CSS: el texto del DOM y los nombres accesibles no cambian.
- **Estructura general** (T19, CG-97; decidido por Ulises el 25/11/2026):
  - `MenuPrincipal` es el marco de cancha (`header.marco`): marca "CW-GYM" decorativa (`aria-hidden`), la navegación "Menú principal" con `NavLink` (la opción activa lleva `aria-current="page"`) y "Salir", que queda fuera de la navegación.
  - Cada opción de `opcionesMenu.ts` tiene un color de sección, agrupado por concepto. `opcionActual(rol, ruta)` elige la opción de la ruta actual, que pinta su pestaña y la franja del marco.
  - Por debajo de 64rem el menú es una tira de pestañas que se desliza, con la activa llevada a la vista.
  - Las opciones y rutas no cambian (épica US24).

- **Sesión en `localStorage`**: se guarda con la clave `cwgym.sesion` como `{ token, rol }`. El almacén (`infraestructura/sesion/almacenSesion.ts`) avisa a sus suscriptores cuando cambia, y `usarSesion` lo lee con `useSyncExternalStore`. Así el menú y las rutas reaccionan al ingreso y al cierre de sesión sin recargar la página. Si el navegador no permite `localStorage`, la sesión no se puede guardar y el usuario vuelve al ingreso.
- **401 y sesión** (RN-UI-IDE-02): el cliente HTTP cierra la sesión solo si había una. Un 401 del ingreso (sin sesión) no borra nada y el mensaje llega a la pantalla.
- **Lint de hooks** (decidido por Lisandro el 08/11/2026): los hooks se llaman `usar<Accion>` y `react-hooks/rules-of-hooks` solo reconoce `use<Nombre>`. La regla local `cwgym-hooks/reglas-de-hooks` (`eslint/reglas-de-hooks.js`) controla las dos formas en todo `src/`: un hook solo se llama dentro de un componente o de otro hook, y nunca de forma condicional, en un bucle o en un callback. En `aplicacion/` la de React sigue apagada, porque marcaría como error los `use*` llamados dentro de un `usar*`.
- **Diálogos**: `div role="dialog" aria-modal="true"` con `aria-labelledby` que apunta al título del diálogo.
- **Validación de formularios**: el mensaje de un campo obligatorio se enlaza con el input por `aria-describedby`, y el input lleva `aria-invalid`. Los errores del back van en `role="alert"` y los avisos de éxito en `role="status"`.

## Paginación (T06)

Confirmada por Lisandro el 11/11/2026. Todo listado se pagina con el `Paginador` compartido: botones "Anterior" y "Siguiente" (deshabilitados en los extremos), el texto "Página X de Y" y un select "Por página" con 5, 10, 20, 50 y 100. El tamaño elegido se recuerda por listado en `localStorage['cwgym.tamanio.' + clave]` (`usarTamanioPagina(clave, porDefecto)`; claves hoy: `ejercicios` con 20 y `rutinas` con 10). Cambiar el tamaño vuelve a la página 1 (lo hace quien usa el paginador). La respuesta del back es `{ items, total, pagina, tamanio }` con `pagina` desde 1.

## Reglas de los listados (RN-UI-LIS)

Propuestas el 08/11/2026 a pedido de Lisandro (T07, CG-74) y confirmadas por él el 11/11/2026.

| ID | Qué hace la UI | Estado |
| :-- | :-- | :-- |
| RN-UI-LIS-01 | Todo listado ofrece filtros por sus atributos principales y un botón "Limpiar filtros" que borra también el buscador | Vigente ✅ (ejercicios, planes) |
| RN-UI-LIS-02 | Los filtros se combinan entre sí (Y lógico) y con el buscador por nombre | Vigente ✅ (ejercicios, planes) |
| RN-UI-LIS-03 | Al cambiar un filtro, el listado vuelve a la primera página | Vigente ✅ (ejercicios, planes) |
| RN-UI-LIS-04 | Filtros por listado: Ejercicios (grupo muscular, músculo principal, tipo, tipo de carga); Profesores (legajo, apellido, documento); Alumnos (apellido, documento, con o sin profesor); Planes (estado, alumno, fecha de inicio desde y hasta; agregado el 21/11/2026, T13); Entrenamientos de alumnos (solo el alumno, porque el back no tiene filtros; agregado el 23/11/2026, US18). Cada listado nuevo define los suyos en su historia | Vigente (Ejercicios; Planes en T13) |
