---
version: 1
slug: "src-aplicacion-tsx"
primary_target: "src/Aplicacion.tsx"
related_targets: ["src/estilos.css"]
---

# Superficie: la app completa (shell y pantallas de los tres roles)

Modo: Operate. Épica US24 (CG-94), base en T17 (CG-95). Audiencia: alumno en el celular durante el entrenamiento; profesor y admin en escritorio. Restricciones: no cambian textos, roles, nombres accesibles ni comportamiento; WCAG 2.2 AA; CSS propio sin librerías de UI.

## Direction contract

THESIS: Lo prescripto y lo hecho se leen como un tanteador de club: cifras grandes, tabulares, lado a lado, legibles de lejos. Rechaza el panel administrativo gris con un acento azul.

OWN-WORLD: Marco verde de cancha (#0E2A20) en el encabezado y la navegación; cifras en ámbar de marcador (#F2B632) solo para lo vivo (contador, lo hecho, la acción principal); área de trabajo clara y fría (#EEF1EE) con superficies blancas; tinta casi negra verdosa. Caps condensadas para rótulos y cifras (Barlow Condensed), Barlow para el texto. Numeración de dos dígitos (raise: catálogo numerado). Rampa fija de cuatro tamaños de cifra para la jerarquía (raise: atlas). Color por sección del menú, solo en su pestaña activa y en la franja del encabezado (raise: manual con separadores). Jerarquía por escala, sin cajas de adorno ni sombras decorativas (raise: espécimen).

STORY: El alumno ve en un vistazo qué serie hace, lo prescripto y lo que registró, y registra con un toque. El profesor escanea listados y estados como un parte de resultados.

FIRST VIEWPORT: En el celular del alumno: marco verde con la marca y el menú, nombre de la rutina y el contador en cifras ámbar grandes; debajo, paso y serie numerados, el ejercicio con su GIF, el tanteador PRESCRIPTO | HECHO, los campos y el botón Registrar a todo el ancho. En escritorio, el mismo marco verde arriba y el contenido en una columna de ancho máximo.

FORM: Tanteador de club, cuarto de mi lista ordenada; seed:7962d8115901a73c.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
