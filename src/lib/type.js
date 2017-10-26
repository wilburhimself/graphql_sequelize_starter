import {
  GraphQLObjectType,
} from "graphql";

import { getModelFields } from './helpers/typeFields';

export const buildType = (model) => {
  return new GraphQLObjectType({
    name: `${model.name}Type`,
    fields: getModelFields(model)
  });
};

export default buildType;