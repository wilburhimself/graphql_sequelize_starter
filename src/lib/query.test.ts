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
