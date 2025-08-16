declare module 'graphql' {
  export class GraphQLSchema {
    constructor(config: unknown);
  }
  export class GraphQLObjectType {
    constructor(config: unknown);
  }
  export type GraphQLFieldConfigMap = Record<string, unknown>;
}
