import {
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFieldConfigMap,
} from 'graphql';

// Minimal shapes for legacy Sequelize attribute metadata

type Attribute = { fieldName: string; type: { constructor: { key?: string } } } & Record<
  string,
  unknown
>;

export type ModelLike = { name: string; attributes: Record<string, Attribute> } & Record<
  string,
  unknown
>;

export const getModelFields = (model: ModelLike): GraphQLFieldConfigMap => {
  const fs: GraphQLFieldConfigMap = {};

  Object.values(model.attributes).map((field) => {
    return Object.assign(fs, {
      [field.fieldName]: {
        type: getFieldType(field),
      },
    });
  });

  return fs;
};

export const getFieldType = (field: Attribute) => {
  switch (field.type.constructor.key) {
    case 'STRING':
      return GraphQLString;
    case 'BOOLEAN':
      return GraphQLBoolean;
    case 'INTEGER':
      return GraphQLInt;
    case 'DOUBLE PRECISION':
      return GraphQLFloat;
    default:
      return GraphQLString;
  }
};

export default getModelFields;
