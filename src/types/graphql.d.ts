declare module 'graphql' {
  export class GraphQLSchema {
    constructor(config: unknown);
  }
  export class GraphQLObjectType {
    constructor(config: unknown);
  }
  export class GraphQLInputObjectType {
    constructor(config: unknown);
  }
  export class GraphQLList {
    constructor(ofType: unknown);
  }
  export const GraphQLInt: unknown;
  export const GraphQLFloat: unknown;
  export const GraphQLBoolean: unknown;
  export const GraphQLString: unknown;
  export const GraphQLID: unknown;
  export type GraphQLFieldConfigMap = Record<string, unknown>;
}
