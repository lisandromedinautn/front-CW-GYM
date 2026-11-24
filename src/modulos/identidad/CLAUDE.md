# Módulo Identidad y Vínculos (`identidad`) — front

Ingreso al sistema, alta de profesores, código de profesor y vínculo del alumno. El texto de las reglas RN-IDE está en `../back-CW-GYM/src/modulos/identidad/CLAUDE.md`.

## Reglas que aplica la UI

| ID | Qué hace la UI | Estado |
| :-- | :-- | :-- |
| RN-IDE-01 | Ante credenciales inválidas muestra un mensaje genérico, sin decir qué dato falló. Con ingreso correcto guarda la sesión y lleva al inicio de su rol | Vigente (ingreso con email y contraseña) ✅ |
| RN-IDE-03 | Las rutas de cada rol están protegidas. Sin sesión → pantalla de ingreso. Con otro rol → "sin acceso" | Vigente ✅ |
| RN-IDE-04 | Formulario de alta de profesor (solo Admin) con datos personales y legajo. Si el legajo, el documento o el email ya existen, muestra el error del back | Vigente ✅ |
| RN-IDE-08 | El profesor ve y copia su código. Al regenerarlo se le avisa que el anterior deja de funcionar | Vigente ✅ |
| RN-IDE-10 | Si el alumno ya tiene profesor, se muestra el error del back y no se ofrece vincularse | Vigente ✅ |
| RN-IDE-11 | Un código inexistente o invalidado muestra el error del back | Vigente ✅ |
| RN-UI-IDE-01 | El menú muestra solo las opciones del rol de la sesión | Vigente ✅ |
| RN-UI-IDE-02 | Si el back responde 401 (sesión vencida), se cierra la sesión y se vuelve a la pantalla de ingreso | Vigente ✅ |

## Pantallas y hooks

| Pantalla (`presentacion/`) | Hook (`aplicacion/`) | US | Estado |
| :-- | :-- | :-- | :-- |
| `PaginaIngreso.tsx` | `usarIngresarAlSistema.ts` | US00 | ✅ |
| `PaginaAltaProfesor.tsx` | `usarDarAltaProfesor.ts` | US02 | ✅ |
| `PaginaCodigoProfesor.tsx` | `usarCodigoProfesor.ts` | US04 | ✅ |
| `PaginaVincularProfesor.tsx` | `usarVincularAlumno.ts` | US05 | ✅ |

El cliente de la API del módulo está en `infraestructura/api/apiIdentidad.ts` ✅.

## Historial de cambios de reglas de UI

| Fecha | Regla | Cambio | Quién lo decidió |
| :-- | :-- | :-- | :-- |
| 01/11/2026 | Todas | Versión inicial | Lisandro |
| 01/11/2026 | RN-IDE-01, 04, 08, 11 | Se reflejan ZG-01, ZG-02 y ZG-13 | Lisandro |
