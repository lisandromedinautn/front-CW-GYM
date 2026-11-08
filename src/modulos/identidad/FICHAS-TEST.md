# Fichas de test — Identidad y Vínculos (front)

Una fila por caso de test. La entrada (acciones de la persona y respuesta de la API) y el esperado (lo que se ve o la request enviada) los **confirma el desarrollador antes** de escribir el test (ver `docs/TESTING.md`). Cambiar "Esperado" requiere que antes haya cambiado la regla.

| Test (archivo › caso) | Regla | Nivel | Entrada | Esperado | Obtenido (último run) | Fecha |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| PaginaIngreso.int.test.tsx › con credenciales válidas de un Admin guarda la sesión y lleva a "Panel del Admin" | RN-IDE-01 | Integración | Email y contraseña cargados; API responde 200 `{ token: 'tok', rol: 'Admin' }` | `localStorage` `cwgym.sesion` = `{"token":"tok","rol":"Admin"}` y se ve el heading "Panel del Admin" | = esperado | 08/11/2026 |
| PaginaIngreso.int.test.tsx › con credenciales válidas de un Profesor guarda la sesión y lleva a "Panel del Profesor" | RN-IDE-01 | Integración | Email y contraseña cargados; API responde 200 `{ token: 'tok', rol: 'Profesor' }` | `localStorage` `cwgym.sesion` = `{"token":"tok","rol":"Profesor"}` y se ve el heading "Panel del Profesor" | = esperado | 08/11/2026 |
| PaginaIngreso.int.test.tsx › con credenciales válidas de un Alumno guarda la sesión y lleva a "Panel del Alumno" | RN-IDE-01 | Integración | Email y contraseña cargados; API responde 200 `{ token: 'tok', rol: 'Alumno' }` | `localStorage` `cwgym.sesion` = `{"token":"tok","rol":"Alumno"}` y se ve el heading "Panel del Alumno" | = esperado | 08/11/2026 |
| PaginaIngreso.int.test.tsx › con credenciales inválidas muestra el mensaje genérico y se queda en el ingreso | RN-IDE-01 | Integración | Email y contraseña cargados; API responde 401 `{ codigo: 'RN-IDE-01', mensaje: 'Email o contraseña incorrectos' }` | En el alert se ve "Email o contraseña incorrectos" y sigue el heading "Ingresar al sistema" | = esperado | 08/11/2026 |

## Compartido (reglas de UI y guard de rutas)

Fichas de los tests que viven en `src/compartido/` y se escriben con el módulo Identidad (RN-IDE-03, RN-UI-IDE-01, RN-UI-IDE-02).

| Test (archivo › caso) | Regla | Nivel | Entrada | Esperado | Obtenido (último run) | Fecha |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| RutaProtegida.int.test.tsx › sin sesión, la ruta /admin lleva a la pantalla de ingreso | RN-IDE-03 | Integración | Sin `cwgym.sesion`; se navega a `/admin` | Se ve el heading "Ingresar al sistema" | = esperado | 08/11/2026 |
| RutaProtegida.int.test.tsx › con sesión de Profesor, la ruta /admin muestra que no tiene acceso | RN-IDE-03 | Integración | Sesión `{"token":"t","rol":"Profesor"}`; se navega a `/admin` | Se ve el texto "No tenés acceso a esta sección" | = esperado | 08/11/2026 |
| MenuPrincipal.int.test.tsx › Admin ve "Profesores" y "Ejercicios", y no ve "Mi código" ni "Vincularme con mi profesor" | RN-UI-IDE-01 | Integración | Sesión Admin; se navega a `/admin` | En el nav "Menú principal" hay links "Profesores" y "Ejercicios"; no hay "Mi código" ni "Vincularme con mi profesor" | = esperado | 08/11/2026 |
| MenuPrincipal.int.test.tsx › Profesor ve "Mi código" y "Ejercicios", y no ve "Profesores" | RN-UI-IDE-01 | Integración | Sesión Profesor; se navega a `/profesor` | En el nav "Menú principal" hay links "Mi código" y "Ejercicios"; no hay "Profesores" | = esperado | 08/11/2026 |
| MenuPrincipal.int.test.tsx › Alumno ve "Vincularme con mi profesor", y no ve "Profesores" ni "Mi código" | RN-UI-IDE-01 | Integración | Sesión Alumno; se navega a `/alumno` | En el nav "Menú principal" hay link "Vincularme con mi profesor"; no hay "Profesores" ni "Mi código" | = esperado | 08/11/2026 |
| clienteHttp.int.test.tsx › con sesión Admin, una respuesta 401 borra la sesión y muestra la pantalla de ingreso | RN-UI-IDE-02 | Integración | Sesión Admin en `/admin`; `pedir('/algo')` recibe 401 `{ codigo: 'RN-IDE-03', mensaje: 'Tenés que ingresar al sistema' }` | La promesa rechaza con ese `codigo` y `mensaje`; `cwgym.sesion` queda vacío; se ve el heading "Ingresar al sistema" | = esperado | 08/11/2026 |
