import buildQuery from './query';
import type { Entity } from './resolver';
import { GraphQLObjectType, GraphQLInt } from 'graphql';

// Minimal fake entity implementation
function makeEntity(initial: Array<Record<string, any>> = []): Entity & {
  _store: Array<Record<string, any>>;
} {
  const store = initial.map((r) => ({ ...r }));
  return {
    _store: store,
    rawAttributes: { id: {}, name: {} },
    findOne: async ({ where: { id } }: any) => store.find((r) => r.id === id) ?? null,
    findAndCountAll: async () => ({ rows: store }),
    create: async (item: any) => {
      store.push(item);
      return item;
    },
    update: async (item: any, { where: { id } }: any) => {
      const idx = store.findIndex((r) => r.id === id);
      if (idx >= 0) store[idx] = { ...store[idx], ...item };
      return [1];
    },
  } as unknown as Entity & { _store: Array<Record<string, any>> };
}

describe('buildQuery', () => {
  test('resolves by id returns array of one resolved item', async () => {
    const model = makeEntity([{ id: 1, name: 'A' }]);
    const gqlType = new GraphQLObjectType({
      name: 'UserType',
      fields: { id: { type: GraphQLInt } },
    });
    const fields = buildQuery('users', gqlType as unknown, model);
    const field = (fields as any).users;
    const result = field.resolve(null, { id: 1 });
    // result is an array of Promises when id is provided
    const rows = await Promise.all(result as Promise<any>[]);
    expect(rows.length).toBe(1);
    expect(rows[0]).toEqual({ id: 1, name: 'A' });
  });

  test('resolves list when no args', async () => {
    const model = makeEntity([{ id: 1, name: 'A' }, { id: 2, name: 'B' }]);
    const gqlType = new GraphQLObjectType({
      name: 'UserType',
      fields: { id: { type: GraphQLInt } },
    });
    const fields = buildQuery('users', gqlType as unknown, model);
    const field = (fields as any).users;
    const rows = await field.resolve(null, {});
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBe(2);
  });

  test('resolves list with pagination args', async () => {
    const model = makeEntity([{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' }]);
    const gqlType = new GraphQLObjectType({
      name: 'UserType',
      fields: { id: { type: GraphQLInt } },
    });
    const fields = buildQuery('users', gqlType as unknown, model);
    const field = (fields as any).users;
    const rows = await field.resolve(null, { page: 2, limit: 1 });
    expect(Array.isArray(rows)).toBe(true);
  });
});
