import {
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
} from "graphql";

const getModelFields = (model) => {
  let fs = {};

  Object.values(model.attributes).map((field) => {
    return Object.assign(fs, {
      [field.fieldName]: {
        type: getFieldType(field)
      }
    });
  });

  return fs;
};

const getFieldType = (field) => {
  switch(field.type.constructor.key) {
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

export { getModelFields, getFieldType };