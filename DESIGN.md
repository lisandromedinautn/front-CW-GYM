---
name: CW-GYM
description: Tanteador de club. Marco verde de cancha, ámbar de marcador solo para lo vivo y área de trabajo clara, con cifras tabulares en una rampa fija.
colors:
  cancha: "#0e2a20"
  cancha-alto: "#163a2c"
  cancha-linea: "#1e4434"
  sobre-cancha: "#e9efea"
  sobre-cancha-tenue: "#a9c2b5"
  ambar: "#f2b632"
  ambar-hundido: "#d99a12"
  sobre-ambar: "#14201a"
  accion: "#1e5c44"
  accion-hover: "#163a2c"
  sobre-accion: "#ffffff"
  fondo: "#eef1ee"
  superficie: "#ffffff"
  superficie-hundida: "#f6f8f6"
  tinta: "#14201a"
  tinta-secundaria: "#4b5b52"
  tinta-tenue: "#5f6e66"
  borde: "#d3dbd5"
  borde-control: "#748a7e"
  enlace: "#1e5c44"
  exito: "#1f7a4d"
  exito-fondo: "#e3f2e9"
  exito-tinta: "#1a6b43"
  advertencia: "#a86f00"
  advertencia-fondo: "#fff1cc"
  advertencia-tinta: "#7a4e00"
  error: "#b3261e"
  error-fondo: "#fbe9e7"
  error-tinta: "#9c2119"
  info-fondo: "#e6f0f7"
  info-tinta: "#1d4e73"
  neutro-fondo: "#e4e9e5"
  neutro-tinta: "#3d4a43"
  seccion-turquesa: "#4fd1c5"
  seccion-coral: "#f07b5a"
  seccion-celeste: "#5db7e8"
  seccion-lila: "#b49af0"
  seccion-lima: "#9bd35a"
  seccion-rosa: "#f28db2"
  velo: "rgba(14, 42, 32, 0.55)"
typography:
  titulo-1:
    fontFamily: "Barlow Condensed, Barlow, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.01em"
  titulo-2:
    fontFamily: "Barlow Condensed, Barlow, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.01em"
  titulo-3:
    fontFamily: "Barlow Condensed, Barlow, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.01em"
  texto-medio:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.5
  texto-base:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  texto-chico:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  rotulo:
    fontFamily: "Barlow Condensed, Barlow, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    letterSpacing: "0.06em"
  cifra-1:
    fontFamily: "Barlow Condensed, Barlow, system-ui, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 700
    lineHeight: 1.1
  cifra-2:
    fontFamily: "Barlow Condensed, Barlow, system-ui, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 700
    lineHeight: 1.1
  cifra-3:
    fontFamily: "Barlow Condensed, Barlow, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.1
  cifra-4:
    fontFamily: "Barlow Condensed, Barlow, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.1
rounded:
  chico: "4px"
  medio: "6px"
  grande: "10px"
  pildora: "999px"
spacing:
  esp-1: "0.25rem"
  esp-2: "0.5rem"
  esp-3: "0.75rem"
  esp-4: "1rem"
  esp-5: "1.25rem"
  esp-6: "1.5rem"
  esp-7: "2rem"
  esp-8: "3rem"
components:
  marco-cancha:
    backgroundColor: "{colors.cancha}"
    textColor: "{colors.sobre-cancha}"
  tanteador-cifra:
    backgroundColor: "{colors.cancha}"
    textColor: "{colors.ambar}"
    typography: "{typography.cifra-2}"
  boton-accion:
    backgroundColor: "{colors.accion}"
    textColor: "{colors.sobre-accion}"
    rounded: "{rounded.chico}"
    height: "44px"
  boton-accion-hover:
    backgroundColor: "{colors.accion-hover}"
    textColor: "{colors.sobre-accion}"
  boton-secundario:
    backgroundColor: "{colors.neutro-fondo}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.chico}"
  tarjeta:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.medio}"
    padding: "1rem"
  aviso-error:
    backgroundColor: "{colors.error-fondo}"
    textColor: "{colors.error-tinta}"
    rounded: "{rounded.medio}"
---

# Design System: CW-GYM

Este archivo documenta lo construido en T17 (CG-95, épica US24). La fuente de verdad de los valores es `src/compartido/presentacion/estilos/tokens.css`; la base global está en `base.css` y `src/estilos.css` los importa junto con las fuentes `@fontsource`. El frontmatter es normativo: si un valor cambia, cambia primero en `tokens.css` y acá se actualiza.

## Overview

**Creative North Star: "Tanteador de club"**

La interfaz se lee como el marcador de un club de barrio: un marco verde oscuro de cancha, cifras grandes y tabulares, rótulos en mayúsculas condensadas y un único color vivo, el ámbar. El área de trabajo es clara y fría, con superficies blancas y tinta verdosa, para que el profesor escanee listados y el alumno vea de un vistazo lo prescripto y lo hecho. La jerarquía se logra con escala (tamaño y peso), no con adornos.

La regla de uso de la dirección: la cancha (#0E2A20) es la **única superficie oscura** (marco y tanteador); el ámbar (#F2B632) se reserva para **lo vivo** (el contador, lo hecho y, cuando T18 lo decida, la acción principal); el área de trabajo es clara; no hay sombras decorativas.

El producto es de uso con el celular en la mano (alumno, durante el Entrenamiento) y de escritorio (profesor y admin). Cumple WCAG 2.2 AA: texto a 4,5:1, foco visible, navegación por teclado y objetivos táctiles de 24 px o más.

**Key Characteristics:**
- Una sola superficie oscura (cancha); todo lo demás es claro.
- Ámbar solo para lo vivo; ninguna sección del menú lo usa.
- Cifras tabulares en cuatro tamaños fijos; la cifra más importante de la pantalla es la más grande.
- Esquinas firmes (4 a 10 px), sin redondeos blandos; sombras solo en capas flotantes.
- Restricción del proyecto: textos, roles y nombres accesibles no cambian por motivos estéticos; los tests buscan por ellos.

## Colors

Paleta de estrategia restringida: un verde profundo como marco, un ámbar como acento raro, neutros verdosos y estados con tres variantes. Todos los contrastes están anotados en `tokens.css` y se verificaron contra WCAG 2.2 AA.

### Primary
- **Cancha** (`{colors.cancha}`): encabezado, navegación y tanteador. Sobre ella, `sobre-cancha` (#E9EFEA, 13,1:1) para texto y `sobre-cancha-tenue` (#A9C2B5, 8,1:1) para texto secundario. `cancha-alto` (#163A2C) y `cancha-linea` (#1E4434) son el relieve y los separadores dentro del marco.
- **Ámbar de marcador** (`{colors.ambar}`): contador, lo hecho y la acción principal si T18 lo decide. 8,4:1 sobre cancha; con `sobre-ambar` (#14201A) encima, 9,2:1. `ambar-hundido` (#D99A12) es el estado presionado o hover del ámbar.
- **Acción** (`{colors.accion}`, #1E5C44): hoy verde, con texto `sobre-accion` blanco (7,9:1) y hover `accion-hover` (#163A2C). Está separado del color de enlace a propósito, para que T18 pueda pasar la acción principal a ámbar sin mover los enlaces.

### Neutral
- **Fondo** (#EEF1EE) y **superficie** (#FFFFFF) y **superficie-hundida** (#F6F8F6): fondo de la app, tarjetas y zonas rehundidas.
- **Tinta** (#14201A, 14,8:1), **tinta-secundaria** (#4B5B52, 6,3:1) y **tinta-tenue** (#5F6E66, 4,7:1 sobre el fondo y 5,4:1 sobre blanco; también el placeholder).
- **Borde** (#D3DBD5): separadores sin función de control. **Borde-control** (#748A7E, 3,3:1 sobre el fondo y 3,7:1 sobre blanco): bordes de campos, que sí necesitan 3:1.
- **Enlace** (#1E5C44, 6,9:1 sobre el fondo).

### Estados
Cada estado tiene hasta tres variantes con su propio uso:

| Estado | Sólido | Tinta | Fondo | Cuándo |
| :-- | :-- | :-- | :-- | :-- |
| Éxito | #1F7A4D | #1A6B43 (5,6:1) | #E3F2E9 | Sólido para bordes e iconos; tinta para el texto; fondo para el aviso o la insignia |
| Advertencia | #A86F00 (3,7:1, solo bordes e iconos) | #7A4E00 (6,4:1) | #FFF1CC | Igual; el sólido nunca es texto |
| Error | #B3261E (5,7:1 sobre el fondo, 6,5:1 sobre blanco; sirve también de texto) | #9C2119 (6,8:1) | #FBE9E7 | Igual |
| Info | (no tiene) | #1D4E73 (7,6:1) | #E6F0F7 | Solo tinta y fondo |
| Neutro | (no tiene) | #3D4A43 (7,6:1) | #E4E9E5 | Estados sin gravedad (por ejemplo "finalizado") |

Regla de composición: **texto sobre el fondo de su estado usa la tinta; los bordes y los iconos usan el sólido; nunca texto en el color sólido de advertencia.**

### Color por sección (T19)
Seis tonos: turquesa #4FD1C5, coral #F07B5A, celeste #5DB7E8, lila #B49AF0, lima #9BD35A y rosa #F28DB2. Todos superan 5,6:1 sobre la cancha. Se usan solo en la pestaña activa del menú y en la franja del encabezado. El ámbar no es de ninguna sección. Se asignan por concepto, igual en todos los roles (`opcionesMenu.ts`): turquesa para el vínculo (Mi código, Profesores, Vincularme con mi profesor), lima para Ejercicios, celeste para Rutinas, lila para planes (Planes, Mi plan), coral para entrenar (Entrenamientos, Mi rutina del día) y rosa para Notificaciones. Inicio no tiene color: la franja queda en `cancha-linea`.

### Velo
`velo` (rgba(14, 42, 32, 0.55)) tapa la pantalla detrás de un diálogo.

### Named Rules
**The Una Sola Cancha Rule.** La cancha es la única superficie oscura. No hay tarjetas oscuras, ni modo oscuro, ni segundos verdes de fondo.

**The Ámbar Vivo Rule.** El ámbar aparece solo donde algo está pasando o ya pasó (contador, lo hecho, acción principal). Un ámbar en un adorno o en un estado de advertencia es un error.

**The Tinta Por Estado Rule.** Texto de estado = tinta; borde o icono = sólido; relleno = fondo. No se mezclan.

## Typography

**Texto:** Barlow (400, 500, 600, 700), con `system-ui, sans-serif` de reserva.
**Rótulos, títulos y cifras:** Barlow Condensed (500, 600, 700), con Barlow de reserva.

**Character:** Barlow da lectura amable en bloques; Barlow Condensed en mayúsculas y tabular da la voz de marcador. Los títulos h1 a h3 usan la condensada en peso 700 con interlineado 1,1 y `text-wrap: balance`; los párrafos usan `text-wrap: pretty`.

### Hierarchy
- **Título 1** (700, 2rem, 1,1): un h1 por pantalla.
- **Título 2** (700, 1.5rem, 1,1): secciones; más margen arriba (1.5rem) que abajo (0.5rem) para pegarse a lo que encabeza.
- **Título 3** (700, 1.25rem, 1,1).
- **Texto medio / base / chico** (400, 1.125 / 1 / 0.875rem, 1,5): cuerpo, con 1rem por defecto y 0.875rem para ayudas y metadatos.
- **Rótulo** (`.rotulo`: 700, mayúsculas, tracking 0.06em; ancho 0.12em para códigos): etiquetas cortas.
- **Cifras** (`.cifra`: Barlow Condensed 700, tabulares, interlineado 1,1).

### Rampa de cifras
Rampa fija de cuatro tamaños: la cifra más importante de la pantalla es la más grande.

| Token | Tamaño | Uso previsto |
| :-- | :-- | :-- |
| `--cifra-1` | 3.5rem | Contador del Entrenamiento |
| `--cifra-2` | 2.75rem | Tanteador prescripto \| hecho (Serie Realizada) |
| `--cifra-3` | 1.75rem | Cifras destacadas de un listado |
| `--cifra-4` | 1.25rem | Cifras dentro de una fila |

`input`, `table`, `time` y `output` llevan `font-variant-numeric: tabular-nums` por base.

### Named Rules
**The Cifra Grande Rule.** En una pantalla, la cifra más importante usa el tamaño más alto de la rampa que le corresponde; no se inventan tamaños intermedios.

**The Rótulo En Caps Rule.** Mayúsculas condensadas solo para rótulos y códigos cortos; los textos de lectura nunca van en mayúsculas.

## Layout

Base de espaciado de 4 px: `esp-1` 0.25rem, `esp-2` 0.5, `esp-3` 0.75, `esp-4` 1, `esp-5` 1.25, `esp-6` 1.5, `esp-7` 2, `esp-8` 3.

Anchos: `--ancho-pagina` 40rem (lectura y formularios), `--ancho-pagina-ancha` 64rem (listados y editores), `--ancho-tarjeta-ingreso` 22rem, `--ancho-dialogo` 28rem.

Breakpoints (`min-width`, mobile primero), los que hoy usa `src/estilos.css`: **40rem**, **48rem** (calendario del plan en siete columnas) y **64rem**. El alumno usa sobre todo el celular; el profesor, escritorio.

**Objetivos táctiles:** `--toque-minimo` 24px (WCAG 2.2) para todo control; `--toque-comodo` 44px para lo que el alumno toca entrenando (registrar una Serie Realizada, finalizar, avanzar). Hoy estos tokens todavía no se usan en componentes.

## Elevation & Depth

Plano por defecto. La jerarquía es por escala y por superficie (blanco sobre fondo claro, cancha para el marco), no por sombra. Solo las capas que flotan llevan sombra.

### Shadow Vocabulary
- **Capa** (`--sombra-capa`: `0 12px 32px rgb(14 42 32 / 22%), 0 2px 6px rgb(14 42 32 / 12%)`): diálogos y menús desplegables.
- **Fija** (`--sombra-fija`: `0 2px 8px rgb(14 42 32 / 14%)`): elementos fijos que se despegan del contenido al desplazarse.
- **Velo** (`--color-velo`): fondo de los diálogos.

**Capas (z-index):** `--capa-fija` 1 (por ejemplo el contador pegajoso) y `--capa-dialogo` 10.

### Named Rules
**The Plano Salvo Que Flote Rule.** Una tarjeta o un botón en reposo no lleva sombra; la sombra solo dice "esto flota sobre lo demás". Hoy las sombras todavía no se usan.

## Shapes

Esquinas firmes de marcador: `chico` 4px (botones), `medio` 6px (tarjetas), `grande` 10px (reservado para diálogos; hoy las tarjetas usan `medio`), `pildora` 999px (insignias de estado). Bordes: `--borde-fino` 1px (separadores, bordes de control), `--borde-grueso` 2px (selección o énfasis). Todo `button` lleva un borde transparente de 1px para que el contorno siga visible en modo de alto contraste. Deshabilitado: `--opacidad-deshabilitado` 0.6.

## Components

Los componentes base viven en `src/compartido/presentacion/estilos/componentes.css` (T18, CG-96). Se aplican por elemento (`button`, `input`, `select`, `table`, `label`) o por las clases que ya usan las pantallas; no cambian textos, roles ni propiedades de React. Lo propio de cada pantalla queda en `src/estilos.css`.

### Marco y tanteador
El tanteador (cifras en ámbar con la rampa de cifras) es de T22.

### Marco y navegación (T19)
`src/compartido/presentacion/estilos/estructura.css` y `MenuPrincipal.tsx` (CG-97, decidido por Ulises el 25/11/2026).
- **Marco de cancha** (`.marco`, un `header`): la única superficie oscura. Lleva la marca "CW-GYM" en Barlow Condensed y `sobre-cancha` (decorativa, `aria-hidden`; no es ámbar, que queda solo para lo vivo: decidido por Ulises el 25/11/2026), el menú por rol (`nav` "Menú principal", RN-UI-IDE-01) y "Salir" con contorno claro. Abajo tiene una franja de 4px con el color de sección de la opción actual. No queda fijo al desplazarse, para no competir con el contador fijo del entrenamiento.
- **Pestañas**: rótulos en caps condensadas en `sobre-cancha-tenue` (8,1:1). La activa (`NavLink`, `aria-current="page"`) va en `sobre-cancha` con su color de sección abajo (4px); el hover marca la línea en `cancha-linea`. Dentro del marco el foco es ámbar (`--anillo-foco-actual`).
- **Celular y tableta** (menos de 64rem): marca y "Salir" arriba; debajo, una **tira de pestañas que se desliza** con el dedo, con los bordes desvanecidos (16px, igual al margen interno, para que ninguna pestaña ni su foco queden atenuados) y la pestaña activa llevada a la vista al cambiar de página (`scroll-padding-inline`). Pestañas de 44px. En escritorio, una sola fila: marca, menú y "Salir".
- **Pestaña activa a la vista**: la tira se desplaza solo en horizontal (nunca mueve la página) y vuelve a hacerlo si la pestaña cambia de ancho, por ejemplo cuando llega el contador de no leídas (corregido en T21).
- **Páginas**: `.contenido` con aire arriba y abajo; columna de lectura `.pagina` (40rem) o ancha `.pagina-ancha` (64rem), centradas; la marca del marco queda alineada con el borde de las páginas anchas. Sin desbordes horizontales desde 360px (verificado en las pantallas del Profesor y del Alumno).

### Pantallas del Profesor (T21)
Lo propio de cada pantalla, en `src/estilos.css` (CG-99, decidido por Ulises el 25/11/2026). Incluye Ejercicios y Notificaciones, que no estaban en otra tarjeta.
- **Tarjeta de listado** (`.tarjeta-rutina`, rutinas y planes): columna flexible. Arriba van el título a todo el ancho y el rótulo (tipo o estado); abajo, un **pie de acciones** (`.tarjeta-acciones`) separado por una línea, con botones secundarios de icono y texto ("Editar", "Importar", "Alumnos", "Editar días"). El nombre accesible completo ("Editar rutina", "Importar como copia") contiene el texto visible. Un enlace de texto del pie también mide 44 px.
- **Fechas de tanteador** (planes): día y mes en `--cifra-3`, el año chico debajo y una flecha entre inicio y fin; los días con rutina y de descanso en `--cifra-4` con su rótulo en caps. El título "Del … al …" y el resumen quedan para lectores de pantalla (`.solo-lectores`) y la versión visual es `aria-hidden`.
- **Calendario del plan** (crear y editar días): el día con rutina lleva una franja lila de 4px arriba (el color de Planes) sobre superficie blanca; el de descanso va en `superficie-hundida` con el número y la rutina en tenue. La franja lila tiene 2,4:1 sobre blanco, por debajo del 3:1 de un gráfico con información: se acepta porque el nombre de la rutina o "Descanso" dice lo mismo en texto. Los días fuera del plan ya no llevan desenfoque.
- **Editor de rutina**: los números de un bloque o circuito van en tres columnas (dos por debajo de 30rem); el ejercicio, los grupos anidados y las acciones ocupan la fila. El GIF de vista previa (5rem) va al costado del ejercicio. Subir, Bajar y Quitar comparten una fila. Los ejercicios de un circuito llevan sangría con una línea gruesa a la izquierda (es jerarquía, no una caja). Entre un bloque y el siguiente hay aire; no hay borde (regla de T18).
- **Seguimiento** (`.tarjeta-registro`: entrenamientos de alumnos y notificaciones): tarjeta blanca sin franja lateral (el detector la marca como patrón genérico). La gravedad va en caps con la tinta de su estado (`error-tinta`, `advertencia-tinta`) y en tenue una vez leída. Las series van en filas con línea fina; desde 48rem, en tres columnas: serie, prescripto y realizado.
- **Código del profesor**: el código en `--cifra-2`. "Copiar" o "Generar código" son la acción principal y el "Regenerar" del diálogo va en `.peligro`.
- **"Volver a …"** (`.volver`): enlace chico arriba del título de cada subpágina, con 44 px de blanco de toque.
- **Acción principal en ámbar**: Nueva rutina, Guardar rutina o Guardar cambios, Nuevo plan, Crear plan, Copiar o Generar código.

### Botones
Todos en caps condensadas (Barlow Condensed 600, `--tracking-rotulo`), 44 px de alto mínimo, radio chico (4px), con transición corta de color.
- **Base** (`button`, `.boton`): fondo `accion`, texto blanco (7,9:1), hover `accion-hover`.
- **Acción principal** (`.accion-principal`): ámbar con tinta (9,2:1), hover `ambar-hundido`. **Una sola por pantalla** (Registrar, Ingresar, Crear plan, Guardar…); se marca en T20 a T22. Decidido por Ulises el 24/11/2026.
- **Secundario** (`.secundario`): contorno `accion` sobre transparente, hover `exito-fondo`.
- **Peligro** (`.peligro`): fondo `error`, texto blanco (6,5:1); acciones que borran o invalidan.
- **Enlace** (`button.enlace`): se lee como texto subrayado, en `enlace`, 24 px mínimos.
- **Icono** (`.boton-icono`): cuadrado de 44 px con icono `--icono-medio`; el nombre accesible lo da `aria-label`.
- **Deshabilitado**: `--opacidad-deshabilitado` y cursor bloqueado, sin hover.

### Campos
Texto, selección, fecha y número: ancho completo, 44 px de alto, borde `borde-control` (3,3:1 sobre el fondo, 3,7:1 sobre blanco), hover en `tinta-tenue`, foco con anillo y borde `accion`, deshabilitado sobre `superficie-hundida`. Error (`aria-invalid="true"`): borde `error` engrosado con sombra interior, sin mover el contenido; el mensaje va en `.error-campo`. Rótulos (`label`) en semibold y `tinta-secundaria`. Casillas y radios de `--icono-medio` con `accent-color`; una casilla con su texto va en una línea. Caret en cancha, placeholder en `tinta-tenue` con opacidad 1.

### Tarjetas y superficies
`.tarjeta`, `.formulario`, `.tarjeta-item`, `.bloque` (y `.tarjeta-rutina`): superficie blanca, borde fino, radio medio (6px), **sin sombra**. La leyenda de un `.bloque` va en Barlow Condensed. **Sin cajas anidadas:** dentro de un `.formulario`, el `.bloque` pierde borde, radio y fondo; lo separan su título y el espacio (decidido por Ulises el 24/11/2026). Un botón suelto de la página (`.pagina > button`, por ejemplo "Volver al listado") no se estira a todo el ancho.

### Tablas
Todavía no hay tablas en pantallas; el estilo queda listo. Encabezados en caps condensadas con línea inferior de cancha (2px), filas con borde fino, cifras tabulares y hover en `superficie-hundida`. Una tabla ancha va dentro de `.tabla-contenedor` para desplazarse en el celular.

### Insignias
Rectángulos de esquinas firmes (4px) en caps condensadas, como los rótulos de un marcador (decidido por Ulises el 24/11/2026). Clases: `.insignia` con `-exito`, `-advertencia`, `-error`, `-info` y `-neutro`; las existentes `.etiqueta` (neutra) y `.estado-plan-proximo/-vigente/-finalizado` comparten el mismo componente.

### Avisos
`.error` y `.exito` en su tinta con peso medio. Los errores del back se muestran por `codigo` en `role="alert"`; los éxitos en `role="status"`. El tratamiento unificado de avisos, carga y vacío es de T23.

### Diálogos
Velo `color-velo` sobre toda la pantalla; el diálogo es la **única capa que flota**: radio grande (10px), `--sombra-capa`, título de nivel 2 y acciones en `.acciones`. Hasta 90 % del alto visible, con desplazamiento interno.

### Foco
Anillo de `--grosor-foco` 3px con offset de 2px usando `--anillo-foco-actual`. Sobre fondo claro es `--anillo-foco` (#1E5C44); dentro del marco de cancha, T19 sobrescribe `--anillo-foco-actual` con `--anillo-foco-sobre-cancha` (#F2B632) sin tocar `base.css`.

### Movimiento
`--duracion-corta` 120ms y `--duracion-media` 200ms con `--curva-salida` `cubic-bezier(0.16, 1, 0.3, 1)`. Con `prefers-reduced-motion: reduce` las duraciones pasan a 0ms y `base.css` fuerza animaciones y transiciones a 0,01ms.

### Iconografía
Lucide (`lucide-react` 1.78.0). En uso desde T21: `Pencil`, `Copy`, `Users`, `CalendarDays` (pie de las tarjetas, `--icono-chico`) y `ArrowRight` (fechas del plan). Tamaños `--icono-chico` 1rem, `--icono-medio` 1.25rem y `--icono-grande` 1.5rem; trazo único `--icono-trazo` 2; `svg.lucide` no se encoge (`flex: none`). Un icono nunca va solo: acompaña un texto o lleva nombre accesible.

### Navegador
`color-scheme: light`, `accent-color: var(--color-accion)`, selección en ámbar con tinta, barras de desplazamiento con `borde-control`.

## Do's and Don'ts

### Do:
- **Do** definir todo valor visual en `tokens.css` y usarlo por variable; ningún color, tamaño o espaciado suelto en componentes.
- **Do** usar el ámbar solo para lo vivo y la cancha solo como marco y tanteador.
- **Do** ordenar la jerarquía por escala (rampa de cifras, títulos) y por superficie.
- **Do** garantizar 44 px de objetivo táctil en lo que el alumno toca entrenando.
- **Do** mantener textos, roles y nombres accesibles intactos al cambiar lo estético (los tests buscan por ellos).
- **Do** usar los términos del glosario ("Entrenamiento", "ingresar al sistema", "Serie Realizada") en cualquier texto de pantalla.

### Don't:
- **Don't** agregar una segunda superficie oscura ni un modo oscuro.
- **Don't** usar el color sólido de advertencia como texto.
- **Don't** poner sombras decorativas, desenfoques ni opacidades sueltas (la deshabilitada es `--opacidad-deshabilitado`).
- **Don't** inventar tamaños de cifra fuera de la rampa de cuatro.
- **Don't** sacar el foco visible ni bajar de 3px el anillo.
- **Don't** mezclar el color de enlace con el de acción: están separados a propósito.

## Qué queda para las tareas siguientes (épica US24)

- **T18 componentes base (CG-96):** ✅ hecho el 24/11/2026: acción principal en ámbar (una por pantalla), 44 px en botones y campos, `.secundario` con contorno, peligro, enlace, icono, campos con todos sus estados, tarjetas, tablas, insignias rectangulares y diálogos. Los tamaños de miniaturas (2.5rem y 3rem en listas) y de GIF (7.5rem en el editor, 14rem en el paso) quedan como medidas de componente; los revisa cada pantalla en T21 y T22.
- **T20 y T22:** marcar con `.accion-principal` la acción principal de cada pantalla y con `.peligro` las destructivas. En T21 la gravedad de las notificaciones va como texto en la tinta de su estado, no como insignia. La "Fecha de fin" de crear plan sigue en formato ISO: pasarla a dd/mm/aaaa cambia una aserción de `PaginaCrearPlan.int.test.tsx` y espera la decisión del desarrollador.
- **T19 estructura y navegación con color por sección (CG-97):** ✅ hecho el 25/11/2026: marco de cancha con marca, pestañas con color de sección, franja, foco ámbar sobre la cancha, tira deslizable en celular y tableta, y distribución de las páginas. El ingreso (sin menú) se rediseña en T20.
- **T20 a T22 pantallas (CG-98 a CG-100):** aplicar la rampa de cifras. Deuda en T22: `.contador` usa `--cifra-3` y la rampa prevé `--cifra-1`.
- **T21 pantallas del Profesor (CG-99):** ✅ hecho el 25/11/2026: tarjetas con pie de acciones, fechas de tanteador, calendario con días de rutina marcados, editor en columnas, tarjetas de seguimiento y una acción principal por pantalla. `.codigo` pasó a `--cifra-2` y `.dia-fuera-del-plan` perdió el desenfoque. "Registrar ejercicio" sigue deshabilitado a propósito en el catálogo.
- **T23 estados (CG-101):** vacío, carga, error y éxito con las variantes de estado.
- **T24 accesibilidad y cierre (CG-102):** auditoría WCAG 2.2 AA, contraste real, foco, teclado, movimiento reducido y objetivos táctiles.
- Deudas generales: los iconos de Lucide todavía no están en pantallas; `--sombra-fija` todavía no se usa (T19, si el marco queda fijo).
