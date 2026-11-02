# Compartido (`compartido`) — front

Lo mínimo que usan todos los módulos. Acá no va lógica de un módulo en particular.

| Capa | Contenido planificado |
| :-- | :-- |
| `dominio/` | Tipos comunes: `Rol`, `ErrorApi` (`{ codigo, mensaje }`), `Sesion` |
| `infraestructura/` | Cliente HTTP base (URL de la API por variable de entorno de Vite, adjunta el JWT, traduce errores a `ErrorApi`), almacenamiento de la sesión |
| `presentacion/` | `RutaProtegida` por rol (RN-IDE-03), layout con menú por rol (RN-UI-IDE-01), componentes genéricos (mensaje de error por `codigo`, carga, confirmación) |
