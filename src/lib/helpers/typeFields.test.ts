/* eslint-disable @typescript-eslint/no-explicit-any */
import { getModelFields, getFieldType, type ModelLike } from './typeFields';
import { GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLFloat } from 'graphql';

describe('helpers/typeFields', () => {
  test('getFieldType maps known Sequelize types', () => {
    const mk = (key: string) => ({ fieldName: 'x', type: { constructor: { key } } });
    expect(getFieldType(mk('STRING'))).toBe(GraphQLString);
    expect(getFieldType(mk('BOOLEAN'))).toBe(GraphQLBoolean);
    expect(getFieldType(mk('INTEGER'))).toBe(GraphQLInt);
    expect(getFieldType(mk('DOUBLE PRECISION'))).toBe(GraphQLFloat);
    // additional aliases supported
    expect(getFieldType(mk('TEXT'))).toBe(GraphQLString);
    expect(getFieldType(mk('BOOL'))).toBe(GraphQLBoolean);
    expect(getFieldType(mk('DOUBLE'))).toBe(GraphQLFloat);
    expect(getFieldType(mk('DECIMAL'))).toBe(GraphQLFloat);
  });

  test('getFieldType falls back to string', () => {
    const fld = { fieldName: 'x', type: { constructor: { key: 'UNKNOWN' } } };
    expect(getFieldType(fld)).toBe(GraphQLString);
    // missing/unknown key as object
    const none = { fieldName: 'x', type: {} } as any;
    expect(getFieldType(none)).toBe(GraphQLString);
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

  test('getFieldType supports simple non-Sequelize keys (capitalized)', () => {
    const simple = (key: string) => ({ fieldName: 'x', type: key }) as any;
    expect(getFieldType(simple('String'))).toBe(GraphQLString);
    expect(getFieldType(simple('Boolean'))).toBe(GraphQLBoolean);
    expect(getFieldType(simple('Int'))).toBe(GraphQLInt);
    expect(getFieldType(simple('Float'))).toBe(GraphQLFloat);
  });

  test('getFieldType supports simple non-Sequelize keys (lowercase)', () => {
    const simple = (key: string) => ({ fieldName: 'x', type: key }) as any;
    expect(getFieldType(simple('string'))).toBe(GraphQLString);
    expect(getFieldType(simple('boolean'))).toBe(GraphQLBoolean);
    expect(getFieldType(simple('int'))).toBe(GraphQLInt);
    expect(getFieldType(simple('float'))).toBe(GraphQLFloat);
    expect(getFieldType(simple('number'))).toBe(GraphQLFloat);
    expect(getFieldType(simple('integer'))).toBe(GraphQLInt);
    expect(getFieldType(simple('double'))).toBe(GraphQLFloat);
    expect(getFieldType(simple('unknown'))).toBe(GraphQLString);
  });

  test('getFieldType supports NUMBER via Sequelize-style key', () => {
    const mk = (key: string) => ({ fieldName: 'x', type: { constructor: { key } } });
    expect(getFieldType(mk('NUMBER'))).toBe(GraphQLFloat);
  });
});
