# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

* **Alumno.** Usa la app sobre todo desde el **celular, en el gimnasio y durante el entrenamiento**, a veces con las manos ocupadas o entre series. Su tarea principal es ver la rutina del día, registrar cada serie realizada (en 10 segundos o menos, OKR O3) y, al finalizar, ver el resumen y cargar su percepción (RPE y sensación de fuerza). También consulta su plan de 28 días.
* **Profesor.** Usa la app sobre todo desde una **computadora de escritorio**. Arma rutinas (bloques, circuitos o mixtas) a partir del catálogo de ejercicios, crea planes de 28 días, vincula alumnos con su código, consulta los entrenamientos de sus alumnos y recibe notificaciones cuando un alumno queda por debajo de lo prescripto o reporta una percepción mala.
* **Admin.** Uso ocasional desde escritorio: da de alta profesores y consulta el catálogo de ejercicios.

(Confirmado por Ulises el 24/11/2026.)

## Product Purpose

Sistema de entrenamiento de gimnasio: el profesor prescribe y el alumno ejecuta y registra lo que realmente hizo, para comparar lo hecho con lo prescripto. Al finalizar, el sistema calcula el volumen, los grupos musculares trabajados y los récords personales, y avisa al profesor cuando el alumno rinde por debajo. El éxito es que el alumno registre sin fricción (O3) y que el profesor ajuste los planes según lo que pasó de verdad.

## Positioning

La comparación sistemática entre lo prescripto y lo realizado, serie por serie, sobre una copia independiente de la rutina, con avisos al profesor cuando el alumno queda por debajo o se siente mal.

## Operating Context

* El alumno entrena con el celular en la mano: pantallas de un paso por vez, contador siempre visible y GIF de cada ejercicio (GIFs © Gym visual, con atribución).
* El profesor trabaja con listados paginados y con filtros (rutinas, planes, entrenamientos de alumnos, notificaciones) y con editores de rutina y de plan.
* Todo el producto está en **español rioplatense** y usa el glosario del proyecto (`docs/PLANIFICACION.md`): "Entrenamiento" (no "sesión"), "ingresar al sistema" (no "login"), "Serie Realizada".

## Capabilities and Constraints

* SPA en React 19 + Vite, sin librería de componentes ni de estilos: CSS plano (`src/estilos.css`). La API está en `../back-CW-GYM`.
* La regla de negocio vive en el back. El front la refleja y muestra los errores por su `codigo`.
* Los tests (Vitest + Testing Library y e2e de Playwright) buscan por rol, nombre accesible y texto. Un cambio estético no puede cambiar textos, roles ni nombres accesibles sin aprobación explícita (épica US24, T10).
* Paquetes con Yarn 1 y regla de 24 h: no se instala ninguna versión publicada hace menos de 24 horas.
* La épica US24 (CG-94) es solo estética: no cambia funcionalidad, reglas, back ni flujos.

## Brand Commitments

Sin identidad previa: CW-GYM es el nombre del proyecto y no hay logo, colores ni tipografía obligatorios. La identidad visual se define en la épica US24. El título del documento es "Sistema de Entrenamiento de Gimnasio".

## Evidence on Hand

* No hay logo, fotografías, testimonios ni datos de clientes: no se inventan.
* Hay un dataset de ejercicios con GIFs (© Gym visual, atribución obligatoria), que se ven durante el entrenamiento.

## Product Principles

1. **El alumno registra sin fricción.** Una serie se registra en una pantalla y con una confirmación, en 10 segundos o menos.
2. **Lo prescripto y lo realizado siempre se leen lado a lado.**
3. **El profesor escanea y decide.** Los listados priorizan la lectura rápida de estados (gravedad, en curso, abandonado, finalizado).
4. **La regla manda.** La interfaz refleja las reglas de negocio y sus mensajes; nunca las reemplaza.

## Accessibility & Inclusion

WCAG 2.2 AA (confirmado por Ulises el 24/11/2026):

* contraste de 4,5:1 en el texto;
* foco visible;
* navegación completa por teclado;
* objetivos táctiles de 24 px o más, y más generosos en las pantallas del alumno durante el entrenamiento.
