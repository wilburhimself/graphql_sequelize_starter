import { builder } from './builder';
import prisma from '../lib/database';
import { GraphQLSchema } from 'graphql';

// Minimal Query to verify Pothos + Prisma wiring.
builder.queryType({
  fields: (t: any) => ({
    metaCount: t.int({
      description: 'Count of Meta rows',
      resolve: async () => prisma.meta.count(),
    }),
  }),
});

export const schema: GraphQLSchema = builder.toSchema({});
export default schema;
