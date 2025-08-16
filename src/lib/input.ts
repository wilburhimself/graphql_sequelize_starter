import { getModelFields } from './helpers/typeFields';
import { GraphQLInputObjectType } from 'graphql';
import type { ModelLike } from './helpers/typeFields';

export const buildInput = (model: ModelLike) => {
  return new GraphQLInputObjectType({
    name: `${model.name}InputType`,
    fields: getModelFields(model),
  });
};

export default buildInput;
