import { getModelFields } from './helpers/typeFields';
import { GraphQLInputObjectType } from 'graphql';

export const buildInput = (model: any) => {
  return new GraphQLInputObjectType({
    name: `${model.name}InputType`,
    fields: getModelFields(model) as any,
  });
};

export default buildInput;
