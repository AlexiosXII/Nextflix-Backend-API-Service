<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository designed in Clean Architecture pattern.

## Project Structure

This project follows the Clean Architecture pattern, organizing code into distinct layers with clear separation of concerns:

![alt text](https://img2.pic.in.th/image5a10496bb2b289e7.png)

```
src/
├── app.module.ts                    # Root application module
├── main.ts                          # Application entry point
├── common/                          # Shared utilities and configurations
│   ├── config/
│   │   └── sensitive-properties.config.ts
│   ├── context/
│   │   └── app-request-context.ts
│   ├── decorators/
│   │   ├── method-cache/
│   │   └── method-tracer/
│   │       ├── method-tracer.decorator.ts
│   │       └── method-tracer.decorator.spec.ts
│   ├── dto/
│   │   ├── error-response.dto.ts
│   │   ├── pagination.dto.ts
│   │   └── success-response.dto.ts
│   ├── errors/
│   │   ├── application.error.ts
│   │   ├── unauthorized.error.ts
│   │   └── list/
│   ├── filter/
│   │   ├── application-error.filter.ts
│   │   └── unauthorized-error.filter.ts
│   ├── guard/
│   │   ├── auth.guard.ts
│   │   └── auth.guard.spec.ts
│   ├── interceptors/
│   │   ├── context.interceptor.ts
│   │   ├── success-response.interceptor.ts
│   │   └── timeout.interceptor.ts
│   ├── logger/
│   │   ├── logger.module.ts
│   │   └── winston.module.ts
│   ├── type/
│   │   └── pagination.type.ts
│   └── utils/
│       └── sensitive-data/
│           ├── sensitive-data.helper.ts
│           └── sensitive-data.helper.spec.ts
├── core/                            # Business logic layer
│   ├── domain/                      # Domain layer (Entities, Repository Interfaces, Domain Errors)
│   │   ├── auth/
│   │   │   └── auth.error.ts
│   │   ├── favorite/
│   │   │   ├── entities/
│   │   │   │   └── favorite.entity.ts
│   │   │   ├── error/
│   │   │   │   └── favorite.error.ts
│   │   │   └── repository/
│   │   │       └── favorite.repository.interface.ts
│   │   ├── movie/
│   │   │   ├── entities/
│   │   │   │   ├── genre.entity.ts
│   │   │   │   └── movie.entity.ts
│   │   │   ├── error/
│   │   │   │   └── movie.error.ts
│   │   │   └── repository/
│   │   │       ├── genre.repository.interface.ts
│   │   │       └── movie.repository.interface.ts
│   │   └── user/
│   │       ├── entities/
│   │       │   └── user.entity.ts
│   │       ├── error/
│   │       │   └── user.error.ts
│   │       └── repository/
│   │           └── user.repository.interface.ts
│   └── usecase/                     # Use cases (Application business rules)
│       ├── auth/
│       │   ├── login.usecase.ts
│       │   └── login.usecase.spec.ts
│       ├── favorite/
│       │   ├── add-favorite.usecase.ts
│       │   ├── add-favorite.usecase.spec.ts
│       │   ├── get-favorites.usecase.ts
│       │   ├── get-favorites.usecase.spec.ts
│       │   ├── remove-favorite.usecase.ts
│       │   └── remove-favorite.usecase.spec.ts
│       ├── movie/
│       │   ├── get-genres.usecase.ts
│       │   ├── get-genres.usecase.spec.ts
│       │   ├── get-movie.usecase.ts
│       │   ├── get-movie.usecase.spec.ts
│       │   ├── get-movies.usecase.ts
│       │   ├── get-movies.usecase.spec.ts
│       │   ├── get-trending-movies.usecase.ts
│       │   ├── get-trending-movies.usecase.spec.ts
│       │   ├── search-movies.usecase.ts
│       │   └── search-movies.usecase.spec.ts
│       └── user/
│           ├── create-user.usecase.ts
│           ├── create-user.usecase.spec.ts
│           ├── get-user.usecase.ts
│           └── get-user.usecase.spec.ts
├── external/                        # External layer (Adapters & Infrastructure)
│   ├── api/                         # API adapters (Controllers & Modules)
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   └── controllers/
│   │   │       ├── auth.controller.ts
│   │   │       └── auth.controller.spec.ts
│   │   ├── favorite/
│   │   │   ├── favorite.module.ts
│   │   │   └── controllers/
│   │   │       ├── favorite.controller.ts
│   │   │       └── favorite.controller.spec.ts
│   │   ├── health/
│   │   │   ├── health.module.ts
│   │   │   └── controllers/
│   │   │       └── health.controller.ts
│   │   ├── movie/
│   │   │   ├── controllers/
│   │   │   │   ├── movie.controller.ts
│   │   │   │   └── movie.controller.spec.ts
│   │   │   └── movie.module.ts
│   │   └── user/
│   │       ├── controllers/
│   │       │   ├── user.controller.ts
│   │       │   └── user.controller.spec.ts
│   │       └── user.module.ts
│   └── infrastructure/              # Infrastructure implementations
│       ├── database/
│       │   ├── prisma.service.ts
│       │   └── repositories/
│       │       ├── favorite/
│       │       │   ├── favorite.repository.ts
│       │       │   └── favorite.repository.spec.ts
│       │       └── user/
│       │           ├── user.repository.ts
│       │           └── user.repository.spec.ts
│       └── tmdb/                   # TMDB API integration
│           ├── repositories/
│           │   ├── genre/
│           │   │   ├── genre.repository.ts
│           │   │   └── genre.repository.spec.ts
│           │   └── movie/
│           │       ├── movie.repository.ts
│           │       └── movie.repository.spec.ts
│           ├── tmdb.config.ts
│           ├── tmdb.service.ts
│           └── type/
├── generated/                       # Auto-generated Prisma Client
│   └── prisma/
└── i18n/                           # Internationalization files
    ├── en/
    │   └── error.json
    └── th/
        └── error.json
```

### Architecture Layers

- **Domain Layer** (`src/core/domain/`): Contains business entities, repository interfaces, and domain errors. This is the innermost layer with no dependencies on external layers. It defines the core business models and contracts.

- **Use Case Layer** (`src/core/usecase/`): Contains application business rules that orchestrate the flow of data to and from entities. Use cases implement specific business operations and coordinate domain objects.

- **External Layer** (`src/external/`): Contains adapters and infrastructure implementations:
    - **API** (`src/external/api/`): Controllers and modules that handle HTTP requests and responses
    - **Infrastructure** (`src/external/infrastructure/`): Concrete implementations of repository interfaces (database with Prisma, TMDB API integration)

- **Common Layer** (`src/common/`): Contains shared utilities, configurations, DTOs, guards, filters, interceptors, and cross-cutting concerns used across all layers.

## Installation

```bash
$ bun install
```

## Running the app

```bash
# development
$ bun run start

# watch mode
$ bun run start:dev

# production mode
$ bun run start:prod
```

## Test

```bash
# unit tests
$ bun run test

# e2e tests
$ bun run test:e2e

# test coverage
$ bun run test:cov
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
