import { GraphQLObjectType } from 'graphql';
import { getModelFields, ModelLike } from './helpers/typeFields';

export const buildType = (model: ModelLike) => {
  return new GraphQLObjectType({
    name: `${model.name}Type`,
    fields: getModelFields(model),
  });
};

export default buildType;
