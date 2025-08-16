declare module 'express-graphql' {
  import { RequestHandler } from 'express';
  import { GraphQLSchema } from 'graphql';

  export interface Options {
    schema: GraphQLSchema;
    rootValue?: unknown;
    graphiql?: boolean;
    context?: unknown;
    pretty?: boolean;
    formatError?: (error: any) => any;
    extensions?: (info: any) => any;
    validationRules?: any[];
    customFormatErrorFn?: (error: any) => any;
  }

  export default function graphqlHTTP(options: Options | ((req: any) => Options)): RequestHandler;
}
