import buildInput from './input';
import type { ModelLike } from './helpers/typeFields';
import { GraphQLInputObjectType, GraphQLInt, GraphQLString } from 'graphql';

describe('buildInput', () => {
  test('creates GraphQLInputObjectType with fields from model', () => {
    const model: ModelLike = {
      name: 'User',
      attributes: {
        id: { fieldName: 'id', type: { constructor: { key: 'INTEGER' } } },
        name: { fieldName: 'name', type: { constructor: { key: 'STRING' } } },
      },
    };

    const type = buildInput(model);
    expect(type).toBeInstanceOf(GraphQLInputObjectType);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((type as any).name).toBe('UserInputType');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields = (type as any).getFields() as Record<string, { type: unknown }>;
    expect(Object.keys(fields)).toEqual(['id', 'name']);
    expect(fields.id.type).toBe(GraphQLInt);
    expect(fields.name.type).toBe(GraphQLString);
  });
});
