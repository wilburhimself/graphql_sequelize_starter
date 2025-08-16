import { GraphQLSchema, GraphQLObjectType, GraphQLFieldConfigMap } from 'graphql';
import { autoload } from '../lib/loader';

type SchemaBags = {
  queries: GraphQLFieldConfigMap;
  mutations: GraphQLFieldConfigMap;
};

const schemaBags = autoload() as SchemaBags;

const schema = new GraphQLSchema({
  mutation: new GraphQLObjectType({
    fields: schemaBags.mutations,
    name: 'Mutation',
  }),
  query: new GraphQLObjectType({
    fields: schemaBags.queries,
    name: 'Query',
  }),
});

export default schema;
