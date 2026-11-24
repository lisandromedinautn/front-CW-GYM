# Módulo Notificaciones (`notificaciones`) — front

Bandeja del Profesor con los avisos de entrenamientos de sus alumnos que quedaron por debajo de lo prescripto (US21, CG-87). El texto de las reglas RN-NOT y RN-ENT-21 está en `../back-CW-GYM/src/modulos/notificaciones/CLAUDE.md` y `../back-CW-GYM/src/modulos/entrenamiento/CLAUDE.md`. **La gravedad y las series por debajo las calcula el back: el front solo las muestra.**

## Reglas que aplica la UI

| ID | Qué hace la UI | Estado |
| :-- | :-- | :-- |
| RN-NOT-01 | Cada notificación muestra alumno (apellido, nombre), rutina, fecha y hora de inicio (hora de Argentina), "Series por debajo: N de M" y cada serie por debajo con lo prescripto y lo realizado ("Sin registrar" si no se registró) | Vigente |
| RN-NOT-02 | La gravedad se muestra como texto, "Leve" o "Grave", no solo con color | Vigente |
| RN-NOT-03 | Las notificaciones se listan de la más nueva a la más vieja, con el `Paginador` compartido. Arriba se muestra la cantidad de no leídas | Vigente |
| RN-NOT-04 | Cada notificación no leída tiene el botón "Marcar como leída". Al marcarla deja de contarse como no leída. Si el back responde 404, se muestra su mensaje | Vigente |
| RN-NOT-05 | Si la notificación trae `percepcion`, se muestra "RPE: N · Sensación de fuerza: N". Una notificación que volvió a no leída por la percepción se ve y se cuenta como cualquier no leída | Vigente |
| RN-NOT-06 | Una notificación solo por percepción mala (`seriesPorDebajo` vacío) no muestra "Series por debajo" ni la lista de series: muestra "Percepción mala" junto a la percepción | Vigente |
| RN-UI-NOT-01 | La opción "Notificaciones" del menú del Profesor muestra la cantidad de no leídas, si hay alguna. Se consulta al ingresar al sistema, cada 60 segundos mientras la sesión esté abierta y enseguida después de marcar una como leída | Vigente |
| RN-UI-NOT-02 | Cada notificación tiene un enlace a los entrenamientos de ese alumno (`/profesor/entrenamientos?alumno=<id>`). La página de US18 tiene que aceptar el alumno por la URL y elegirlo al abrir | Vigente |

## Pantallas y hooks

| Pantalla (`presentacion/`) | Hook (`aplicacion/`) | US |
| :-- | :-- | :-- |
| `bandeja/PaginaNotificaciones.tsx` (`/profesor/notificaciones`), `bandeja/TarjetaNotificacion.tsx` ✅ | `consultar-notificaciones/usarNotificaciones.ts`, `marcar-leida/usarMarcarLeida.ts` ✅ | US21 |
| `contador/ContadorNoLeidas.tsx` (en el menú) ✅ | `contar-no-leidas/usarContadorNoLeidas.ts` ✅, `cambios-no-leidas.ts` ✅ | US21 |

## Modelo (decidido por Ulises el 24/11/2026)

* **Dominio** (`dominio/notificacion/notificacion.ts`): tipos `Notificacion`, `Gravedad` (`'leve' | 'grave'`), `SeriePorDebajo` y `Percepcion`, iguales al contrato del back. Más funciones puras de presentación:
  * etiqueta de la gravedad;
  * texto de lo prescripto y de lo realizado;
  * fecha en hora de Argentina, como en US18.
  * No se recalcula la gravedad.
* **Infraestructura**: `infraestructura/apiNotificaciones.ts` sobre `clienteHttp`.
  * `GET /notificaciones/mis-notificaciones?pagina&tamanio`
  * `GET /notificaciones/mis-notificaciones/no-leidas`
  * `PUT /notificaciones/mis-notificaciones/:id/lectura`
* **Aplicación**: un hook por caso de uso, sin `fetch` en los componentes.
  * `usarMarcarLeida` actualiza la tarjeta y el contador sin recargar la lista.
  * `usarContadorNoLeidas` usa un intervalo de 60 s. En los tests se controla el reloj con los temporizadores falsos de Vitest (se mockean solo la red y el reloj).
* **Composición del menú**: `compartido` no puede importar el interior de un módulo (regla de dependencia 2).
  * `MenuPrincipal` recibe por props un contenido opcional por ruta (por ejemplo `extras: Record<string, ReactNode>`).
  * `Aplicacion.tsx`, que ya compone los módulos, le pasa `<ContadorNoLeidas />` para `/profesor/notificaciones`. Es el mismo criterio que las acciones de Entrenamiento en "Mi rutina del día".
* **Rutas**: `/profesor/notificaciones` en `PAGINAS` y "Notificaciones" en `OPCIONES_MENU` del Profesor.
* **Errores**: se muestran por `codigo` en un `alert`.

## Historial de cambios de reglas de UI

| Fecha | Regla | Cambio | Quién lo decidió |
| :-- | :-- | :-- | :-- |
| 24/11/2026 | RN-NOT-01 a 05 (UI), RN-UI-NOT-01 y 02 | Versión inicial (US21) | Ulises |
| 24/11/2026 | RN-UI-NOT-01 | El contador también se actualiza enseguida después de marcar una como leída. Lo pide la ficha del e2e confirmada ("el menú vuelve a Notificaciones") | Ulises |
| 24/11/2026 | RN-NOT-05 (UI), nueva RN-NOT-06 (UI) | Percepción en la notificación y notificación solo por percepción mala (US17, decisión 46) | Ulises |

## Decisiones de implementación (CG-90, US21)

Implementado el 24/11/2026.

* **Textos de pantalla:**
  * encabezado "Notificaciones";
  * sin notificaciones: "Todavía no tenés notificaciones.";
  * mientras carga: "Cargando tus notificaciones…".
* **Tarjeta:**
  * cada tarjeta es un `<article>` con la gravedad como título;
  * cada serie se rotula "Serie N · ejercicio" en un bloque y "Vuelta N · ejercicio" en un circuito;
  * medidas "10 repeticiones · 30 kg" y "60 segundos", con coma decimal y sin peso si no hay.
* **Contador del menú:**
  * `ContadorNoLeidas` agrega " (N)" dentro del enlace, así que el nombre accesible queda "Notificaciones (2)". Con 0 no agrega nada.
  * `Aplicacion.tsx` le pasa el contador al menú (`EXTRAS_MENU`) solo para el rol Profesor: Admin y Alumno no consultan.
  * `MenuPrincipal` y `DisenioConMenu` reciben contenido extra por ruta sin importar ningún módulo.
* **Actualización inmediata:** al marcar, `usarMarcarLeida` llama a `avisarCambioNoLeidas()` (`aplicacion/cambios-no-leidas.ts`, un aviso interno del módulo), y `usarContadorNoLeidas` vuelve a consultar.
* **Errores de red del contador:** se ignoran y queda el último valor. Por eso los tests de otras pantallas del Profesor, que no declaran esa respuesta en MSW, no se rompieron.
* **Percepción:** `Percepcion` ya tiene la forma del back (`{ rpe, sensacionFuerza }`), aunque hasta US17 llega `null`.
