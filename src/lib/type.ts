import { GraphQLObjectType } from 'graphql';
import { getModelFields } from './helpers/typeFields';

export const buildType = (model: any) => {
  return new GraphQLObjectType({
    name: `${model.name}Type`,
    fields: getModelFields(model) as any,
  });
};

export default buildType;
