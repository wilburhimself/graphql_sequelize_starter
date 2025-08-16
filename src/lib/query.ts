import { GraphQLList, GraphQLInt, GraphQLBoolean, GraphQLString } from 'graphql';
import Resolver, { Entity, AllOptions } from './resolver';
import dotenv from 'dotenv';

dotenv.config();

type GraphQLCompositeType = unknown; // from local graphql shim, keep minimal

type ResolveByIdArgs = {
  id: number;
  page?: never;
  limit?: never;
  offset?: never;
  all?: never;
  order?: never;
};

type ResolveListArgs = {
  id?: undefined;
  page?: number;
  limit?: number;
  offset?: number;
  all?: boolean;
  order?: string;
};

type ResolveArgs = ResolveByIdArgs | ResolveListArgs;

const buildQuery = <T extends Record<string, unknown>>(
  name: string,
  type: GraphQLCompositeType,
  model: Entity<T>,
) => {
  const resolver = new Resolver<T>(model);
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
      resolve: (
        _value: unknown,
        { id, page, limit, offset, all, order }: ResolveArgs,
      ): Promise<T[]> | Array<Promise<T | null>> => {
        if (id !== undefined) {
          return [resolver.find(id)];
        }
        const settings: AllOptions =
          limit || page || offset || order
            ? {
                currentPage: page ? page : 0,
                limit: limit ? limit : Number(process.env.APP_PERPAGE),
                offset: offset ? offset : 0,
                order: order ? order : '',
              }
            : { all };
        return resolver.all(settings);
      },
    },
  } as Record<string, unknown>;
};

export default buildQuery;
