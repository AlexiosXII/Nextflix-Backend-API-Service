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

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository designed in [Onion Architecture](<(https://medium.com/expedia-group-tech/onion-architecture-deed8a554423)>).

## Project Structure

This project follows the Onion Architecture pattern, organizing code into distinct layers with clear separation of concerns:

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
│   │   └── method-tracer/
│   │       ├── method-tracer.decorator.ts
│   │       └── method-tracer.decorator.spec.ts
│   ├── dto/
│   │   └── error-response.dto.ts
│   ├── errors/
│   │   └── application.error.ts
│   ├── filter/
│   │   └── application-error.filter.ts
│   ├── interceptors/
│   │   ├── context.interceptor.ts
│   │   ├── success-response.interceptor.ts
│   │   └── timeout.interceptor.ts
│   ├── logger/
│   │   ├── logger.module.ts
│   │   └── winston.module.ts
│   └── utils/
│       └── sensitive-data/
│           ├── sensitive-data.helper.ts
│           └── sensitive-data.helper.spec.ts
├── core/                            # Business logic layer
│   ├── application/                 # Application services (Use cases)
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   │   ├── login-response.dto.ts
│   │   │   │   └── login-username.dto.ts
│   │   │   └── service/
│   │   │       ├── auth.service.ts
│   │   │       └── __test__/
│   │   │           └── auth.service.spec.ts
│   │   └── user/
│   │       ├── dto/
│   │       │   └── create-user.dto.ts
│   │       └── service/
│   │           ├── user.service.ts
│   │           └── user.service.spec.ts
│   └── domain/                      # Domain layer (Entities, Value Objects, Domain Services)
│       ├── auth/
│       │   ├── entities/
│       │   │   └── auth.entity.ts
│       │   ├── errors/
│       │   │   └── auth.error.ts
│       │   └── repositories/
│       │       └── auth.repository.interface.ts
│       └── user/
│           ├── entities/
│           │   └── user.entity.ts
│           └── repositories/
│               └── user.repository.interface.ts
├── external/                        # External layer (Controllers, Infrastructure)
│   ├── api/                         # API controllers and modules
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   └── controllers/
│   │   │       ├── auth.controller.ts
│   │   │       └── auth.controller.spec.ts
│   │   └── user/
│   │       ├── user.module.ts
│   │       └── controllers/
│   │           ├── user.controller.ts
│   │           └── user.controller.spec.ts
│   └── infrastructure/              # Infrastructure implementations
│       └── database/
│           └── repositories/
│               ├── auth/
│               │   └── auth.repository.ts
│               └── user/
│                   ├── user.repository.ts
│                   └── user.repository.spec.ts
└── i18n/                           # Internationalization files
    ├── en/
    │   └── error.json
    └── th/
        └── error.json
```

### Architecture Layers

- **Domain Layer** (`src/core/domain/`): Contains business entities, value objects, and domain services. This is the innermost layer with no dependencies on external layers.

- **Application Layer** (`src/core/application/`): Contains application services (use cases) that orchestrate domain objects and implement business workflows.

- **External Layer** (`src/external/`): Contains controllers, infrastructure implementations, and external service integrations.

- **Common Layer** (`src/common/`): Contains shared utilities, configurations, and cross-cutting concerns used across all layers.

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
