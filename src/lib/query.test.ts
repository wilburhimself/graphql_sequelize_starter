import buildQuery from './query';
import { GraphQLObjectType, GraphQLInt } from 'graphql';
import { makeEntity } from './testUtils/fakeEntity';

describe('buildQuery', () => {
  test('resolves by id returns array of one resolved item', async () => {
    const model = makeEntity([{ id: 1, name: 'A' }]);
    const gqlType = new GraphQLObjectType({
      name: 'UserType',
      fields: { id: { type: GraphQLInt } },
    });
    const fields = buildQuery('users', gqlType as unknown, model);
    const view = fields as Record<string, { resolve: (parent: unknown, args: unknown) => unknown }>;
    const field = view.users;
    const result = field.resolve(null, { id: 1 }) as Promise<unknown>[];
    // result is an array of Promises when id is provided
    const rows = (await Promise.all(result)) as Array<Record<string, unknown>>;
    expect(rows.length).toBe(1);
    expect(rows[0]).toEqual({ id: 1, name: 'A' });
  });

  test('resolves list when no args', async () => {
    const model = makeEntity([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ]);
    const gqlType = new GraphQLObjectType({
      name: 'UserType',
      fields: { id: { type: GraphQLInt } },
    });
    const fields = buildQuery('users', gqlType as unknown, model);
    const view = fields as Record<string, { resolve: (parent: unknown, args: unknown) => unknown }>;
    const field = view.users;
    const rows = (await field.resolve(null, {})) as unknown[];
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBe(2);
  });

  test('resolves list with pagination args', async () => {
    const model = makeEntity([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ]);
    const gqlType = new GraphQLObjectType({
      name: 'UserType',
      fields: { id: { type: GraphQLInt } },
    });
    const fields = buildQuery('users', gqlType as unknown, model);
    const view = fields as Record<string, { resolve: (parent: unknown, args: unknown) => unknown }>;
    const field = view.users;
    const rows = (await field.resolve(null, { page: 2, limit: 1 })) as unknown[];
    expect(Array.isArray(rows)).toBe(true);
  });

  test('resolves list with order only (exercises order fallback branch)', async () => {
    const model = makeEntity([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ]);
    const gqlType = new GraphQLObjectType({
      name: 'UserType',
      fields: { id: { type: GraphQLInt } },
    });
    const fields = buildQuery('users', gqlType as unknown, model);
    const view = fields as Record<string, { resolve: (parent: unknown, args: unknown) => unknown }>;
    const field = view.users;
    const rows = (await field.resolve(null, { order: 'id DESC' })) as unknown[];
    expect(Array.isArray(rows)).toBe(true);
  });

  test('resolves list with offset only (exercises offset fallback branch)', async () => {
    const model = makeEntity([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ]);
    const gqlType = new GraphQLObjectType({
      name: 'UserType',
      fields: { id: { type: GraphQLInt } },
    });
    const fields = buildQuery('users', gqlType as unknown, model);
    const view = fields as Record<string, { resolve: (parent: unknown, args: unknown) => unknown }>;
    const field = view.users;
    const rows = (await field.resolve(null, { offset: 1 })) as unknown[];
    expect(Array.isArray(rows)).toBe(true);
  });

  test('resolves list with all=true (exercises else branch)', async () => {
    const model = makeEntity([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ]);
    const gqlType = new GraphQLObjectType({
      name: 'UserType',
      fields: { id: { type: GraphQLInt } },
    });
    const fields = buildQuery('users', gqlType as unknown, model);
    const view = fields as Record<string, { resolve: (parent: unknown, args: unknown) => unknown }>;
    const field = view.users;
    const rows = (await field.resolve(null, { all: true })) as unknown[];
    expect(Array.isArray(rows)).toBe(true);
  });
});
