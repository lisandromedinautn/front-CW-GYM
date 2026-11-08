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

## Alta de profesor (US02)

| Test (archivo › caso) | Regla | Nivel | Entrada | Esperado | Obtenido (último run) | Fecha |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| PaginaAltaProfesor.int.test.tsx › con los 7 campos completos envía el alta con ese body y muestra "Profesor P-001 dado de alta" | RN-IDE-04 | Integración | Admin en `/admin/profesores`; completa Laura, Gómez, DNI (default), 30111222, P-001, laura@cwgym.test, Inicial123; API responde 201 `{ id, legajo: 'P-001' }` | `POST /identidad/profesores` con body `{ nombre, apellido, tipoDocumento: 'DNI', numeroDocumento, legajo, email, contrasenia }` exacto; `role="status"` "Profesor P-001 dado de alta" | = esperado | 08/11/2026 |
| PaginaAltaProfesor.int.test.tsx › con el legajo P-001 ya usado, muestra el mensaje del back en el alert y el campo Legajo conserva "P-001" | RN-IDE-04 | Integración | Formulario completo; API responde 409 `{ codigo: 'RN-IDE-04', mensaje: 'Ya existe un profesor con el legajo P-001' }` | `role="alert"` con ese mensaje; Legajo = "P-001" | = esperado | 08/11/2026 |
| PaginaAltaProfesor.int.test.tsx › con un documento ya usado, muestra el mensaje del back en el alert y el campo Legajo conserva "P-001" | RN-IDE-06 | Integración | Formulario completo; API responde 409 `{ codigo: 'RN-IDE-06', mensaje: 'Ya existe una persona con el documento DNI 30111222' }` | `role="alert"` con ese mensaje; Legajo = "P-001" | = esperado | 08/11/2026 |
| PaginaAltaProfesor.int.test.tsx › con un email ya usado, muestra el mensaje del back en el alert y el campo Legajo conserva "P-001" | RN-IDE-13 | Integración | Formulario completo; API responde 409 `{ codigo: 'RN-IDE-13', mensaje: 'Ya existe un usuario con el email laura@cwgym.test' }` | `role="alert"` con ese mensaje; Legajo = "P-001" | = esperado | 08/11/2026 |
| PaginaAltaProfesor.int.test.tsx › con Legajo vacío no envía nada y marca el campo con "Completá este campo" | RN-IDE-04 | Integración | Resto de campos completos; Legajo vacío; se toca "Dar de alta" | No se llama a `POST /identidad/profesores`; Legajo con `aria-invalid="true"` y texto "Completá este campo" | = esperado | 08/11/2026 |

## Código de profesor (US04)

| Test (archivo › caso) | Regla | Nivel | Entrada | Esperado | Obtenido (último run) | Fecha |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| PaginaCodigoProfesor.int.test.tsx › sin código, muestra "Todavía no generaste tu código" y "Generar código" lo genera sin abrir dialog | RN-IDE-08 | Integración | Profesor en `/profesor/codigo`; `GET` responde `{ codigo: null }`; `POST` responde 201 `{ codigo: 'ABC234' }` | Se ve "Todavía no generaste tu código"; tras "Generar código" se ve "ABC234" y no hay dialog | = esperado | 08/11/2026 |
| PaginaCodigoProfesor.int.test.tsx › con código existente, muestra el código y el botón "Regenerar código" | RN-IDE-08 | Integración | `GET` responde `{ codigo: 'ABC234' }` | Se ve "ABC234" y el botón "Regenerar código" | = esperado | 08/11/2026 |
| PaginaCodigoProfesor.int.test.tsx › "Regenerar" en el dialog llama al POST y muestra el código nuevo | RN-IDE-08 | Integración | `GET` responde 'ABC234'; "Regenerar código" → dialog → "Regenerar"; `POST` responde 201 `{ codigo: 'XYZ789' }` | Se abre dialog "Regenerar código" con "El código anterior deja de funcionar"; el POST se llama una vez; se ve "XYZ789" | = esperado | 08/11/2026 |
| PaginaCodigoProfesor.int.test.tsx › "Cancelar" en el dialog cierra sin llamar al POST | RN-IDE-08 | Integración | `GET` responde 'ABC234'; "Regenerar código" → dialog → "Cancelar" | El dialog se cierra; el POST no se llama; se ve "ABC234" | = esperado | 08/11/2026 |
| PaginaCodigoProfesor.int.test.tsx › "Copiar" deja el código en el portapapeles y muestra "Código copiado" | RN-IDE-08 | Integración | `GET` responde 'ABC234'; se toca "Copiar" | `role="status"` "Código copiado"; el portapapeles contiene "ABC234" | = esperado | 08/11/2026 |

## Vincularme (US05)

| Test (archivo › caso) | Regla | Nivel | Entrada | Esperado | Obtenido (último run) | Fecha |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| PaginaVincularProfesor.int.test.tsx › con un código válido envía { codigo } y muestra "Quedaste vinculado con Laura Gómez" | RN-IDE-09 | Integración | Alumno en `/alumno/vinculo`; escribe "ABC234"; API responde 200 `{ profesor: { nombre: 'Laura', apellido: 'Gómez' } }` | `POST /identidad/alumnos/vinculo` con body `{ codigo: 'ABC234' }`; `role="status"` "Quedaste vinculado con Laura Gómez" | = esperado | 08/11/2026 |
| PaginaVincularProfesor.int.test.tsx › con un código inválido muestra el mensaje del back en el alert y el campo sigue visible | RN-IDE-11 | Integración | Escribe "ZZZ999"; API responde 400 `{ codigo: 'RN-IDE-11', mensaje: 'El código de profesor no es válido' }` | `role="alert"` con ese mensaje; el campo "Código de profesor" sigue visible | = esperado | 08/11/2026 |
| PaginaVincularProfesor.int.test.tsx › si ya está vinculado, muestra el mensaje del back y el formulario desaparece | RN-IDE-10 | Integración | Escribe "ABC234"; API responde 409 `{ codigo: 'RN-IDE-10', mensaje: 'Ya estás vinculado con un profesor: no podés vincularte con otro' }` | `role="alert"` con ese mensaje; ya no está el campo "Código de profesor" | = esperado | 08/11/2026 |
