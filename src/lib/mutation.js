import Resolver from "../lib/resolver";
import {GraphQLID} from "graphql";

const buildMutation = (name, type, input, model) => {
  const resolver = new Resolver(model);
  return {
    [`create${name}`]: {
      type: type,
      args: {
        input: {type: input}
      },
      resolve: (value, {input}) => {
        return resolver.create(input);
      }
    },
    [`update${name}`]: {
      type: type,
      args: {
        id: {
          type: GraphQLID
        },
        input: {
          type: input
        }
      },
      resolve: (value, {id,  input}) => {
        return resolver.update(id, input)
      }
    },
    [`destroy${name}`]: {
      type: type,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve: (value, {id}) => {
        return resolver.destroy(id);
      }
    }
  }
};
export default buildMutation;