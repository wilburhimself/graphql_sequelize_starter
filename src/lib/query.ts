import { GraphQLList, GraphQLInt, GraphQLBoolean, GraphQLString } from 'graphql';
import Resolver, { Entity } from './resolver';
import dotenv from 'dotenv';

dotenv.config();

type GraphQLCompositeType = unknown; // from local graphql shim, keep minimal

type ResolveArgs = {
  id?: number;
  page?: number;
  limit?: number;
  offset?: number;
  all?: boolean;
  order?: string;
};

const buildQuery = (name: string, type: GraphQLCompositeType, model: Entity) => {
  const resolver = new Resolver(model);
  return {
    [name]: {
      type: new GraphQLList(type as unknown),
      args: {
        id: { type: GraphQLInt },
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        all: { type: GraphQLBoolean },
        order: { type: GraphQLString },
      },
      resolve: (_value: unknown, { id, page, limit, offset, all, order }: ResolveArgs) => {
        return (() => {
          if (id) {
            return [resolver.find(id)];
          } else {
            const settings =
              limit || page || offset || order
                ? {
                    currentPage: page ? page : 0,
                    limit: limit ? limit : Number(process.env.APP_PERPAGE),
                    offset: offset ? offset : 0,
                    order: order ? order : '',
                  }
                : { all };
            return resolver.all(settings);
          }
        })();
      },
    },
  } as Record<string, unknown>;
};

export default buildQuery;
