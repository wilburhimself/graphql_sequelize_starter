import buildInput from './input';
import type { ModelLike } from './helpers/typeFields';
import { GraphQLInputObjectType, GraphQLInt, GraphQLString } from 'graphql';

describe('buildInput', () => {
  test('creates GraphQLInputObjectType with fields from model', () => {
    const model: ModelLike = {
      name: 'User',
      attributes: {
        id: { fieldName: 'id', type: { constructor: { key: 'INTEGER' } } } as any,
        name: { fieldName: 'name', type: { constructor: { key: 'STRING' } } } as any,
      },
    } as any;

    const type = buildInput(model);
    expect(type).toBeInstanceOf(GraphQLInputObjectType);
    expect((type as any).name).toBe('UserInputType');

    const fields = (type as any).getFields() as any;
    expect(Object.keys(fields)).toEqual(['id', 'name']);
    expect(fields.id.type).toBe(GraphQLInt);
    expect(fields.name.type).toBe(GraphQLString);
  });
});
