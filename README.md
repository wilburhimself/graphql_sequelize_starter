# graphql-api-starter

Starter kit for building a GraphQL server on Sequelize, with generated queries and CUD mutations per entity. Core libraries are written in TypeScript and covered by tests; entities can remain in legacy JS during migration.

### Config

Before using, create a `.env` file in the project root. Use the example below and substitute your values for the minimum setup needed to run the starter.

```
DB_USER=database user
DB_PASSWORD=database password
DB_DATABASE=database name
DB_HOST=database host
DB_PORT=database port
DB_DIALECT=database dialect (mysql, postgres, etc ...)

APP_PORT=3000
APP_PERPAGE=10 # default page size in query
```

### Usage

For each entity in your application you must create a directory in `src/entities`. In this case we are going to use a `Post` entity, so we create a `posts` directory. This directory contains 3 files:

**`model.js`:** Is a `sequelize` model. It is used to define the entity data model and the model's operations.

```
import Sequelize from "sequelize";
import db from "../../lib/database";

const Post = db.define("Post",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'title'
    },

    introduction: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'introduction'
    },

    body: {
      type: Sequelize.TEXT,
      field: 'body'
    },
  }, {
    tableName: 'posts',
    timestamps: false
  }
);

export default Post;
```

**`input.js`:** The definition of the `GraphQLInputType` for the entity.

```
import buildInput from '../../lib/input';
import Model from './model';

export default buildInput(Model);
```

**`type.js`:** The definition of the `GraphQLObjectType` for the entity.

```
import Model from './model';
import buildType from '../../lib/type';

const PostType = buildType(Model);
export default PostType;
```

With this setup we can run with

```
npm start
```

And visit `http://localhost:3000`

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
- Generics: `Resolver<T>` provides typed CRUD operations; `buildQuery<T>` and `buildMutation<T>` accept `Entity<T>` and propagate types.
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

- `npm start` — start the server (visit http://localhost:3000)
- `npm test` — run Jest unit tests with coverage
- `npm run lint` — run ESLint (flat config) over TS/JS
- `npm run lint -- --fix` — apply autofixable ESLint and Prettier fixes
- `npx prettier --write .` — format the repository

## Development

- Source code is in TypeScript under `src/`.
- Entities under `src/entities/<entity>/` are still JS and autoloaded by `src/lib/loader.js`:
  - `model.js` (Sequelize-like model)
  - `input.js` (GraphQLInputType) — optional
  - `type.js` (GraphQLObjectType) — optional; will be generated if missing
- Migration is gradual; both TS core and JS entities are supported.

## Architecture Highlights

- `src/lib/resolver.ts`: `Resolver<T>` wraps CRUD with pagination helpers; uses `AllOptions`/`QueryOptions`.
- `src/lib/query.ts`: `buildQuery<T>` wires GraphQL list queries, supports id lookup and pagination; uses discriminated args for stronger typing.
- `src/lib/mutation.ts`: `buildMutation<T>` wires create/update/destroy with typed inputs.
- `src/lib/helpers/typeFields.ts`: maps Sequelize-like attribute metadata to GraphQL field types.

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

## Roadmap

### Phase 2. ORM Upgrade: Prisma

1. **Introduce Prisma**
    - Replace Sequelize with Prisma.
    - Define schema in `prisma/schema.prisma`.
    - Run migrations (`prisma migrate`).
2. **Generate types**
    - Run `prisma generate` to autogen TS client + types.
3. **Testing**
    - Use a test DB (SQLite in-memory).
    - Integration tests around Prisma models.

✅ Deliverable: Database layer fully migrated, typed, and tested.

---

### Phase 3. GraphQL Layer: Schema + Server

1. **Replace hand-rolled schema with Pothos**
    - Use **Pothos** to define schema with full type safety.
    - Hook into Prisma plugin for auto-typed resolvers.
2. **Apollo Server setup**
    - Replace current server with Apollo Server.
    - Add GraphQL Playground for dev.
    - Add `@deprecated` directives for evolvability.
3. **Testing**
    - Snapshot tests for schema (GraphQL introspection → snapshot).
    - Query & mutation tests using Apollo’s `createTestClient`.

✅ Deliverable: Strongly typed GraphQL server powered by Apollo + Pothos.

---

### Phase 4. Performance Safeguards

1. **DataLoader**
    - Add batching & caching for common relations.
2. **Pagination**
    - Implement cursor-based pagination (`first`, `after`).
3. **Query limits**
    - Use Apollo’s validation rules for max depth & complexity.
4. **Testing**
    - Unit tests for loaders (batching works, N+1 avoided).
    - Integration tests for pagination correctness.
    - Security tests: overly deep query should fail.

✅ Deliverable: Efficient, N+1-safe, query-limited API.

---

### Phase 5. Security & Auth

1. **JWT/OAuth middleware**
    - Add auth context in Apollo.
    - Example: role-based access in resolvers.
2. **Validation**
    - Input validation with Zod/Yup at mutation layer.
3. **Testing**
    - Auth tests (unauthorized requests rejected).
    - Mutation validation tests (bad inputs rejected).

✅ Deliverable: Secure, validated GraphQL API with tested auth.

---

### Phase 6. Subscriptions & Real-Time

1. **Enable WebSocket subscriptions** in Apollo.
    - Example: `onPostAdded` subscription.
2. **Testing**
    - Subscription integration tests (publish/subscribe events).

✅ Deliverable: Real-time GraphQL capability demonstrated.

---

### Phase 7. Tooling & DX

1. **GraphQL Code Generator**
    - Generate TypeScript types for queries/resolvers.
2. **Schema checks in CI**
    - Add **GraphQL Inspector** to validate schema diffs.
    - Prevent breaking changes in pull requests.
3. **Schema visualization**
    - Bundle Voyager / GraphiQL Explorer in dev mode.

✅ Deliverable: Fully tooled DX stack with CI schema safety.

---

### Phase 8. CI/CD Polish

1. **CI with GitHub Actions**
    - Run lint, type check, tests, coverage.
    - Run `graphql-inspector diff` against main branch schema.
2. **Optional: Deploy demo**
    - Deploy to Railway/Render/Heroku as a live demo.

✅ Deliverable: Portfolio-ready repo with CI/CD and live demo link.

## Contributing

- Keep changes small and focused.
- Prefer intention-revealing code over comments; follow Rails/DHH-style pragmatism.
- Favor POROs/service objects for domain logic; avoid overusing concerns/monkey-patching.
- Add or update unit tests alongside code changes.

## Continuous Integration

- Every commit must pass tests and linters.
- Run locally before pushing:

```
npm run lint && npm test
```

- Rebase feature branches before merging and keep `main` always deployable.
