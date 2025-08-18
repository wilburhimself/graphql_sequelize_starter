# graphql-api-starter

[![Use this template](https://img.shields.io/badge/Use_this_template-2ea44f?logo=github&logoColor=white)](https://github.com/wilburhimself/graphql_api_starter/generate)

[![CI](https://github.com/wilburhimself/graphql_api_starter/actions/workflows/ci.yml/badge.svg)](https://github.com/wilburhimself/graphql_api_starter/actions/workflows/ci.yml)

Starter kit for building a GraphQL server using Prisma as the ORM, with generated queries and CUD mutations per entity. Core libraries are written in TypeScript and covered by tests; entities can remain in legacy JS during migration.

## Quickstart

- Use the GitHub template button above, or clone the template locally:

```
npx degit wilburhimself/graphql_api_starter my-app
cd my-app
npm install
npm run dev
```

### Config

Before using, create a `.env` file in the project root. Use the example below and substitute your values for the minimum setup needed to run the starter.

```
# Web server
APP_PORT=3000
APP_PERPAGE=10 # default page size in query

# Prisma connection string (example for Postgres)
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
```

### Usage

Define your data model in Prisma at `prisma/schema.prisma`, then run:

```
npm run generate
npm run migrate -- --name init
```

At runtime, import the Prisma client from `src/lib/database` and pass the appropriate model delegate (e.g., `prisma.post`) into the GraphQL resolver builders.

Example wiring of a list query with a Prisma delegate:

```
import prisma from '../lib/database';
import buildQuery from '../lib/query';

// assuming you have a GraphQL type for Post
const Query = {
  ...buildQuery('posts', /* GraphQLType */ PostType, prisma.post),
};

export default Query;
```

With this setup we can run with

```
npm start
```

And visit `http://localhost:3000/graph` (GraphiQL via GraphQL Yoga)

For development vs production:

```
# Development (TypeScript)
npm run dev

# Production
npm run build
npm start
```

## TypeScript Migration (Current Status)

This project is being incrementally migrated to TypeScript. Core library modules are typed and covered by unit tests, while legacy entity modules under `src/entities/` remain JavaScript to preserve the original autoload behavior.

- Typed core libs: `src/lib/resolver.ts`, `src/lib/query.ts`, `src/lib/mutation.ts`, `src/lib/type.ts`, `src/lib/input.ts`, `src/lib/helpers/typeFields.ts`.
- Generics: `Resolver<T>` provides typed CRUD operations; `buildQuery<T>` and `buildMutation<T>` accept a Prisma-style `PrismaDelegate<T>` and propagate types.
- Options types: `AllOptions` and `QueryOptions` describe pagination/order settings.
- Minimal type shims are applied where needed in the codebase.

## Requirements

- Node.js (LTS recommended)
- npm

## Setup

```
npm install
cp .env.example .env # if you keep one; otherwise create .env as below
```

Create `.env` in the project root (see Config above). Important:

- `APP_PERPAGE` controls pagination limit in queries.
- Database variables configure the Sequelize connection used by legacy models.

## Scripts

- `npm start` — start the server (visit http://localhost:3000/graph)
- `npm test` — run Jest unit tests with coverage
- `npm run lint` — run ESLint (flat config) over TS/JS
- `npm run lint -- --fix` — apply autofixable ESLint and Prettier fixes
- `npx prettier --write .` — format the repository

## Development

- Source code is in TypeScript under `src/`.
- GraphQL endpoint is provided by GraphQL Yoga at `/graph`.
- Pothos + Prisma schema lives under `src/schema/`:
  - `src/schema/builder.ts` — Pothos builder with Prisma plugin and client
  - `src/schema/index.ts` — defines the root Query/Mutation and exports `schema`
- Entities under `src/entities/<entity>/` are still JS and autoloaded by `src/lib/loader.js`:
  - `model.js` (model/delegate for data access)
  - `type.js` (GraphQLObjectType) — REQUIRED
  - `input.js` (GraphQLInputType) — optional
- Note: The previous fallback that auto-generated a type when `type.js` was missing has been removed. Entities without `type.js` will be skipped by the loader with a warning.
- Migration is gradual; both TS core and JS entities are supported.

### Example query (Pothos + Yoga)

Once the server is running, open GraphiQL at `http://localhost:3000/graph` and run:

```
query {
  metaCount
}
```

## Architecture Highlights

- `src/lib/resolver.ts`: `Resolver<T>` wraps CRUD with pagination helpers; uses `AllOptions`/`QueryOptions` and expects a Prisma-style delegate.
- `src/lib/query.ts`: `buildQuery<T>` wires GraphQL list queries, supports id lookup and pagination; uses discriminated args for stronger typing.
- `src/lib/mutation.ts`: `buildMutation<T>` wires create/update/destroy with typed inputs.
- `src/lib/helpers/typeFields.ts`: legacy helper that mapped Sequelize-like attribute metadata to GraphQL types. Consider replacing with explicit domain GraphQL types or a Prisma-first approach (e.g., Nexus + Prisma) as you evolve the schema.

## Testing

- Jest tests cover resolver, query, mutation, type, input, and helpers.
- Typed test helpers in `src/lib/testUtils/fakeEntity.ts` create in-memory `Entity<T>` instances for fast unit tests.

Run tests:

```
npm test
```

## Linting & Formatting

- ESLint v9+ flat config: `eslint.config.js` (includes Prettier via plugin and config)
- Ignores are configured in `eslint.config.js` (no `.eslintignore` needed)

```
npm run lint
npm run lint -- --fix
npx prettier --write .
```

## Roadmap (condensed)

### Phase 2. ORM Upgrade: Prisma
- ~Replace Sequelize with Prisma (`schema.prisma`, `prisma migrate`, `prisma generate`).~
- Tests on SQLite in-memory; integration tests around models.
- ✅ Deliverable: Database layer fully migrated, typed, and tested.

### Phase 3. GraphQL Layer: Schema + Server
- Pothos schema with Prisma plugin; Apollo Server + Playground; `@deprecated` directives.
- Snapshot tests (introspection) + query/mutation tests via Apollo test client.
- ✅ Deliverable: Strongly typed GraphQL server (Apollo + Pothos).

### Phase 4. Performance Safeguards
- DataLoader batching/caching; cursor pagination; query depth/complexity limits.
- Tests for loaders, pagination, and security limits.
- ✅ Deliverable: Efficient, N+1-safe, query-limited API.

### Phase 5. Security & Auth
- JWT/OAuth context; role-based access; input validation with Zod/Yup.
- Auth and validation tests.
- ✅ Deliverable: Secure, validated API with tested auth.

### Phase 6. Subscriptions & Real-Time
- WebSocket subscriptions (e.g., `onPostAdded`) with integration tests.
- ✅ Deliverable: Real-time GraphQL capability.

### Phase 7. Tooling & DX
- GraphQL Code Generator; GraphQL Inspector in CI; schema explorer (Voyager/GraphiQL) in dev.
- ✅ Deliverable: Strong DX with schema safety in CI.

### Phase 8. CI/CD Polish
- GitHub Actions: lint, typecheck, tests, coverage, schema diff; optional demo deploy.
- ✅ Deliverable: Portfolio-ready repo with CI/CD and live demo.

## Contributing

- Keep changes small and focused.
- Prefer intention-revealing code over comments

- Add or update unit tests alongside code changes.

## Continuous Integration

- Every commit must pass tests and linters.
- Run locally before pushing:

```
npm run lint && npm test
```

- Rebase feature branches before merging and keep `main` always deployable.
