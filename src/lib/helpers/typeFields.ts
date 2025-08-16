import { GraphQLInt, GraphQLFloat, GraphQLString, GraphQLBoolean } from 'graphql';

// Minimal shapes for legacy Sequelize attribute metadata

type Attribute = { fieldName: string; type: { constructor: { key?: string } } } & Record<
  string,
  any
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModelLike = { attributes: Record<string, Attribute> } & Record<string, any>;

export const getModelFields = (model: ModelLike) => {
  const fs: Record<string, { type: unknown }> = {};

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
