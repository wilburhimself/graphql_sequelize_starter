import { getModelFields, getFieldType, type ModelLike } from './typeFields';
import { GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLFloat } from 'graphql';

describe('helpers/typeFields', () => {
  test('getFieldType maps known Sequelize types', () => {
    const mk = (key: string) => ({ fieldName: 'x', type: { constructor: { key } } });
    expect(getFieldType(mk('STRING'))).toBe(GraphQLString);
    expect(getFieldType(mk('BOOLEAN'))).toBe(GraphQLBoolean);
    expect(getFieldType(mk('INTEGER'))).toBe(GraphQLInt);
    expect(getFieldType(mk('DOUBLE PRECISION'))).toBe(GraphQLFloat);
  });

  test('getFieldType falls back to string', () => {
    const fld = { fieldName: 'x', type: { constructor: { key: 'UNKNOWN' } } };
    expect(getFieldType(fld)).toBe(GraphQLString);
  });

  test('getModelFields builds GraphQL field map', () => {
    const model: ModelLike = {
      name: 'User',
      attributes: {
        id: { fieldName: 'id', type: { constructor: { key: 'INTEGER' } } },
        name: { fieldName: 'name', type: { constructor: { key: 'STRING' } } },
      },
    };
    const fields = getModelFields(model);
    const view = fields as Record<string, { type: unknown }>;
    expect(Object.keys(fields)).toEqual(['id', 'name']);
    expect(view['id'].type).toBe(GraphQLInt);
    expect(view['name'].type).toBe(GraphQLString);
  });
});
