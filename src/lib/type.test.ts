import buildType from './type';
import type { ModelLike } from './helpers/typeFields';
import { GraphQLObjectType, GraphQLInt, GraphQLString } from 'graphql';

describe('buildType', () => {
  test('creates GraphQLObjectType with fields from model', () => {
    const model: ModelLike = {
      name: 'User',
      attributes: {
        id: { fieldName: 'id', type: { constructor: { key: 'INTEGER' } } } as any,
        name: { fieldName: 'name', type: { constructor: { key: 'STRING' } } } as any,
      },
    } as any;

    const type = buildType(model);
    expect(type).toBeInstanceOf(GraphQLObjectType);
    expect((type as any).name).toBe('UserType');

    const fields = ((type as any).getFields() as any);
    expect(Object.keys(fields)).toEqual(['id', 'name']);
    expect(fields.id.type).toBe(GraphQLInt);
    expect(fields.name.type).toBe(GraphQLString);
  });
});
