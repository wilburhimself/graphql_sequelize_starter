import { getModelFields, getFieldType, type ModelLike } from './typeFields';
import { GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLFloat } from 'graphql';

describe('helpers/typeFields', () => {
  test('getFieldType maps known Sequelize types', () => {
    const mk = (key: string) => ({ fieldName: 'x', type: { constructor: { key } } } as any);
    expect(getFieldType(mk('STRING'))).toBe(GraphQLString);
    expect(getFieldType(mk('BOOLEAN'))).toBe(GraphQLBoolean);
    expect(getFieldType(mk('INTEGER'))).toBe(GraphQLInt);
    expect(getFieldType(mk('DOUBLE PRECISION'))).toBe(GraphQLFloat);
  });

  test('getFieldType falls back to string', () => {
    const fld = { fieldName: 'x', type: { constructor: { key: 'UNKNOWN' } } } as any;
    expect(getFieldType(fld)).toBe(GraphQLString);
  });

  test('getModelFields builds GraphQL field map', () => {
    const model: ModelLike = {
      name: 'User',
      attributes: {
        id: { fieldName: 'id', type: { constructor: { key: 'INTEGER' } } } as any,
        name: { fieldName: 'name', type: { constructor: { key: 'STRING' } } } as any,
      },
    } as any;
    const fields = getModelFields(model);
    expect(Object.keys(fields)).toEqual(['id', 'name']);
    expect((fields as any).id.type).toBe(GraphQLInt);
    expect((fields as any).name.type).toBe(GraphQLString);
  });
});
