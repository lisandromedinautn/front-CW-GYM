# Módulo Notificaciones (`notificaciones`) — front

Bandeja del Profesor con los avisos de entrenamientos de sus alumnos que quedaron por debajo de lo prescripto (US21, CG-87). El texto de las reglas RN-NOT y RN-ENT-21 está en `../back-CW-GYM/src/modulos/notificaciones/CLAUDE.md` y `../back-CW-GYM/src/modulos/entrenamiento/CLAUDE.md`. **La gravedad y las series por debajo las calcula el back: el front solo las muestra.**

## Reglas que aplica la UI

| ID | Qué hace la UI | Estado |
| :-- | :-- | :-- |
| RN-NOT-01 | Cada notificación muestra alumno (apellido, nombre), rutina, fecha y hora de inicio (hora de Argentina), "Series por debajo: N de M" y cada serie por debajo con lo prescripto y lo realizado ("Sin registrar" si no se registró) | Vigente |
| RN-NOT-02 | La gravedad se muestra como texto, "Leve" o "Grave", no solo con color | Vigente |
| RN-NOT-03 | Las notificaciones se listan de la más nueva a la más vieja, con el `Paginador` compartido. Arriba se muestra la cantidad de no leídas | Vigente |
| RN-NOT-04 | Cada notificación no leída tiene el botón "Marcar como leída". Al marcarla deja de contarse como no leída. Si el back responde 404, se muestra su mensaje | Vigente |
| RN-NOT-05 | Si la notificación trae `percepcion` (US17), se muestran el RPE y la sensación de fuerza. Hasta US17 llega `null` y no se muestra nada | **A confirmar** (con US17): no se testea |
| RN-UI-NOT-01 | La opción "Notificaciones" del menú del Profesor muestra la cantidad de no leídas, si hay alguna. Se consulta al ingresar al sistema y cada 60 segundos mientras la sesión esté abierta | Vigente |
| RN-UI-NOT-02 | Cada notificación tiene un enlace a los entrenamientos de ese alumno (`/profesor/entrenamientos?alumno=<id>`). La página de US18 tiene que aceptar el alumno por la URL y elegirlo al abrir | Vigente |

## Pantallas y hooks planificados

| Pantalla (`presentacion/`) | Hook (`aplicacion/`) | US |
| :-- | :-- | :-- |
| `bandeja/PaginaNotificaciones.tsx` (`/profesor/notificaciones`), `bandeja/TarjetaNotificacion.tsx` | `consultar-notificaciones/usarNotificaciones.ts`, `marcar-leida/usarMarcarLeida.ts` | US21 |
| `contador/ContadorNoLeidas.tsx` (en el menú) | `contar-no-leidas/usarContadorNoLeidas.ts` | US21 |

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
