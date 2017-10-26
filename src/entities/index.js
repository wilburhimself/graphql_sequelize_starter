import {GraphQLSchema, GraphQLObjectType} from "graphql";
import { autoload } from '../lib/loader';

const schema = autoload();

export default new GraphQLSchema({
  mutation: new GraphQLObjectType({
    fields: schema.mutations,
    name: 'Mutation'
  }),
  query: new GraphQLObjectType({
    fields: schema.queries,
    name: 'Query'
  })
});
