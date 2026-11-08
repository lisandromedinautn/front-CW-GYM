# Compartido (`compartido`) — front

Lo mínimo que usan todos los módulos. Acá no va lógica de un módulo en particular. Estado: ✅ existe · 📄 planificado.

| Capa | Contenido |
| :-- | :-- |
| `dominio/` | `Rol`, `Sesion` y `RUTA_INICIO` (`sesion.ts`) ✅; `ErrorApi` (`{ codigo, mensaje }`) y `esErrorApi` (`errorApi.ts`) ✅; opciones del menú por rol (`opcionesMenu.ts`) ✅ |
| `aplicacion/` | `usarSesion` (`usarSesion.ts`) ✅ |
| `infraestructura/` | Cliente HTTP base `pedir()` (URL de la API por variable de entorno de Vite, adjunta el JWT, traduce errores a `ErrorApi`) ✅ (`clienteHttp.ts`); almacenamiento de la sesión (`almacenSesion.ts`) ✅ |
| `presentacion/` | `RutaProtegida` por rol (RN-IDE-03) ✅; layout con menú por rol (`DisenioConMenu`, `MenuPrincipal`, RN-UI-IDE-01) ✅; `PaginaInicio` ✅; `Proximamente` ✅; componentes genéricos de mensaje de error por `codigo`, carga y confirmación 📄 |

## Decisiones de implementación

- **Sesión en `localStorage`**: se guarda con la clave `cwgym.sesion` como `{ token, rol }`. El almacén (`infraestructura/almacenSesion.ts`) avisa a sus suscriptores cuando cambia, y `usarSesion` lo lee con `useSyncExternalStore`. Así el menú y las rutas reaccionan al ingreso y al cierre de sesión sin recargar la página. Si el navegador no permite `localStorage`, la sesión no se puede guardar y el usuario vuelve al ingreso.
- **401 y sesión** (RN-UI-IDE-02): el cliente HTTP cierra la sesión solo si había una. Un 401 del ingreso (sin sesión) no borra nada y el mensaje llega a la pantalla.
- **Lint de hooks** (decidido por Lisandro el 08/11/2026): los hooks se llaman `usar<Accion>` y `react-hooks/rules-of-hooks` solo reconoce `use<Nombre>`. La regla local `cwgym-hooks/reglas-de-hooks` (`eslint/reglas-de-hooks.js`) controla las dos formas en todo `src/`: un hook solo se llama dentro de un componente o de otro hook, y nunca de forma condicional, en un bucle o en un callback. En `aplicacion/` la de React sigue apagada, porque marcaría como error los `use*` llamados dentro de un `usar*`.
- **Diálogos**: `div role="dialog" aria-modal="true"` con `aria-labelledby` que apunta al título del diálogo.
- **Validación de formularios**: el mensaje de un campo obligatorio se enlaza con el input por `aria-describedby`, y el input lleva `aria-invalid`. Los errores del back van en `role="alert"` y los avisos de éxito en `role="status"`.
