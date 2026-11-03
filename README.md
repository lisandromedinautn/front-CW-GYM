# front-CW-GYM

Front del Sistema de Entrenamiento de Gimnasio (Proyecto 3 IyCS): React + Vite con enfoque DDD por módulos.

* Planificación, glosario y modelo de dominio: [docs/PLANIFICACION.md](docs/PLANIFICACION.md)
* Mapa del repo: [ATLAS.md](ATLAS.md)
* Convenciones: [CLAUDE.md](CLAUDE.md)
* Testing: [docs/TESTING.md](docs/TESTING.md)
* Trazabilidad: [docs/TRAZABILIDAD.md](docs/TRAZABILIDAD.md)
* Auditoría de IA: [DECISIONES-IA.md](DECISIONES-IA.md)

API: [back-CW-GYM](https://github.com/lisandromedinautn/back-CW-GYM).

## Puesta en marcha

Requisitos: Node 24 (`.nvmrc`) y Yarn 1. Para los e2e, el back levantado.

```bash
yarn install --frozen-lockfile     # instala y activa los hooks de git (husky)
cp .env.example .env               # URL de la API
yarn dev                           # http://localhost:5173
yarn playwright install chromium   # una sola vez, para los e2e
```

## Comandos

| Comando | Qué hace |
| :-- | :-- |
| `yarn test` / `yarn test:cov` | Unitarios e integración (Vitest) / con umbrales de cobertura |
| `yarn test:e2e` | e2e de navegador con Playwright |
| `yarn lint` / `yarn formatear` | ESLint con las reglas de capas / Prettier |
| `yarn verificar:paquetes` | Regla de las 24 h sobre las dependencias |

Los commits pasan por dos hooks: el pre-commit (lint, formato, tests relacionados y paquetes) y el commit-msg (formato de la decisión 37). Ver [CLAUDE.md](CLAUDE.md).
