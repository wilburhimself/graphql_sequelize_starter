declare module 'express-graphql' {
  import { RequestHandler } from 'express';
  import { GraphQLSchema } from 'graphql';

  export interface Options {
    schema: GraphQLSchema;
    rootValue?: unknown;
    graphiql?: boolean;
    context?: unknown;
    pretty?: boolean;
    formatError?: (error: unknown) => unknown;
    extensions?: (info: unknown) => unknown;
    validationRules?: unknown[];
    customFormatErrorFn?: (error: unknown) => unknown;
  }

  export default function graphqlHTTP(
    options: Options | ((req: unknown) => Options),
  ): RequestHandler;
}
