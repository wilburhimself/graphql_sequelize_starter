import buildType from './type';
import type { ModelLike } from './helpers/typeFields';
import { GraphQLObjectType, GraphQLInt, GraphQLString } from 'graphql';

describe('buildType', () => {
  test('creates GraphQLObjectType with fields from model', () => {
    const model: ModelLike = {
      name: 'User',
      attributes: {
        id: { fieldName: 'id', type: { constructor: { key: 'INTEGER' } } },
        name: { fieldName: 'name', type: { constructor: { key: 'STRING' } } },
      },
    };

    const type = buildType(model);
    expect(type).toBeInstanceOf(GraphQLObjectType);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((type as any).name).toBe('UserType');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields = (type as any).getFields() as Record<string, { type: unknown }>;
    expect(Object.keys(fields)).toEqual(['id', 'name']);
    expect(fields.id.type).toBe(GraphQLInt);
    expect(fields.name.type).toBe(GraphQLString);
  });
});
