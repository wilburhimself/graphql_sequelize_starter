import {GraphQLList, GraphQLInt, GraphQLBoolean, GraphQLString } from "graphql";
import Resolver from "./resolver";
import dotenv from 'dotenv'
dotenv.config();

const buildQuery = (name, type, model) => {
  let resolver = new Resolver(model);
  return {
    [name]: {
      type: new GraphQLList(type),
      args: {
        id: {type: GraphQLInt},
        page: {type: GraphQLInt},
        limit: {type: GraphQLInt},
        offset: {type: GraphQLInt},
        all: { type: GraphQLBoolean },
        order: { type: GraphQLString }
      },
      resolve: (value, { id, page, limit, offset, all, order }) => {
        return (() => {
          if (id) {
            return [resolver.find(id)];
          } else {
            let settings = (limit || page || offset || order) ? {
              currentPage: page ? page : 0,
              limit: limit ? limit : process.env.APP_PERPAGE,
              offset: offset ? offset : 0,
              order: order ? order : ""
            } : {
              all: all
            };
            return resolver.all(settings);
          }
        })();
      }
    }
  }
}

export default buildQuery;
