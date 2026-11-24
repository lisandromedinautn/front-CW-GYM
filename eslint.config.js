import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import cwgymHooks from './eslint/reglas-de-hooks.js';

const MODULOS = ['identidad', 'catalogo', 'planificacion', 'entrenamiento'];
const CAPAS = 'dominio|aplicacion|infraestructura|presentacion';

// CLAUDE.md, regla de dependencia 2: un módulo no importa el interior de otro.
const sinInteriorDeOtrosModulos = (modulo) =>
  MODULOS.filter((otro) => otro !== modulo).map((otro) => ({
    regex: `(^|/)${otro}/(${CAPAS})(/|$)`,
    message: `El módulo ${modulo} no importa el interior de ${otro}: lo compartido va a src/compartido (CLAUDE.md, regla 2).`,
  }));

// docs/TESTING.md: está prohibido debilitar o saltear tests.
const PROHIBIDO_EN_TESTS = ['describe', 'it', 'test'].flatMap((objeto) =>
  ['only', 'skip', 'todo', 'skipIf', 'runIf', 'fixme'].map((propiedad) => ({
    object: objeto,
    property: propiedad,
    message: 'Prohibido saltear o aislar tests (docs/TESTING.md).',
  })),
);

// CLAUDE.md, regla 1: ningún componente hace fetch directo; la red pasa por infraestructura.
const SIN_FETCH = {
  name: 'fetch',
  message: 'Solo la capa infraestructura llama a la API (CLAUDE.md, regla 1).',
};

export default tseslint.config(
  {
    // .claude/: skills de terceros (impeccable) con sus propios scripts; no son código de la app.
    ignores: [
      'dist/',
      'coverage/',
      'node_modules/',
      'test-results/',
      'playwright-report/',
      '.claude/',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat['recommended-latest'],
  reactRefresh.configs.vite,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-restricted-properties': ['error', ...PROHIBIDO_EN_TESTS],
    },
  },
  // Regla 1: presentacion → aplicacion → dominio. Las páginas no ven la infraestructura.
  ...MODULOS.map((modulo) => ({
    files: [`src/modulos/${modulo}/presentacion/**/*.{ts,tsx}`],
    rules: {
      'no-restricted-globals': ['error', SIN_FETCH],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '(^|/)infraestructura(/|$)',
              message:
                'La presentación usa los hooks de aplicacion, no el cliente de la API (CLAUDE.md, regla 1).',
            },
            ...sinInteriorDeOtrosModulos(modulo),
          ],
        },
      ],
    },
  })),
  ...MODULOS.map((modulo) => ({
    files: [`src/modulos/${modulo}/aplicacion/**/*.{ts,tsx}`],
    rules: {
      'no-restricted-globals': ['error', SIN_FETCH],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '(^|/)presentacion(/|$)',
              message: 'La aplicación no depende de la presentación (CLAUDE.md, regla 1).',
            },
            ...sinInteriorDeOtrosModulos(modulo),
          ],
        },
      ],
    },
  })),
  // El dominio del front son tipos y validaciones puras: sin React ni red.
  ...MODULOS.map((modulo) => ({
    files: [`src/modulos/${modulo}/dominio/**/*.{ts,tsx}`],
    rules: {
      'no-restricted-globals': ['error', SIN_FETCH],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['react', 'react-dom', 'react-dom/*'],
              message: 'El dominio son tipos y validaciones puras: no importa React.',
            },
            {
              regex: '(^|/)(aplicacion|infraestructura|presentacion)(/|$)',
              message: 'El dominio no depende de otras capas (CLAUDE.md, regla 1).',
            },
            ...sinInteriorDeOtrosModulos(modulo),
          ],
        },
      ],
    },
  })),
  ...MODULOS.map((modulo) => ({
    files: [`src/modulos/${modulo}/infraestructura/**/*.{ts,tsx}`],
    rules: {
      'no-restricted-imports': ['error', { patterns: sinInteriorDeOtrosModulos(modulo) }],
    },
  })),
  // Los hooks del proyecto se llaman usar<Accion> (en español) y react-hooks solo reconoce use<Nombre>.
  // La regla local cwgym-hooks/reglas-de-hooks controla las dos formas en todo src/ (eslint/reglas-de-hooks.js).
  // En aplicacion/ se apaga la de React, que marcaría como error los use* llamados dentro de un usar*.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/**/*.test.{ts,tsx}', 'src/pruebas/**'],
    plugins: { 'cwgym-hooks': cwgymHooks },
    rules: { 'cwgym-hooks/reglas-de-hooks': 'error' },
  },
  {
    files: ['src/**/aplicacion/**/*.{ts,tsx}'],
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },
  prettier,
);
