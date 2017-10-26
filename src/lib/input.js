import { getModelFields } from './helpers/typeFields';
import {
  GraphQLInputObjectType
} from "graphql";

export const buildInput = (model) => {
  return new GraphQLInputObjectType({
    name: `${model.name}InputType`,
    fields: getModelFields(model)
  });
}

export default buildInput;