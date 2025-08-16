import { GraphQLList, GraphQLInt, GraphQLBoolean, GraphQLString } from 'graphql';
import Resolver from './resolver';
import dotenv from 'dotenv';

dotenv.config();

const buildQuery = (name: string, type: any, model: any) => {
  const resolver = new Resolver(model);
  return {
    [name]: {
      type: new GraphQLList(type),
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
        {
          id,
          page,
          limit,
          offset,
          all,
          order,
        }: {
          id?: number;
          page?: number;
          limit?: number;
          offset?: number;
          all?: boolean;
          order?: string;
        },
      ) => {
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
            return resolver.all(settings as any);
          }
        })();
      },
    },
  } as Record<string, any>;
};

export default buildQuery;
