import Resolver from './resolver';
import { GraphQLID } from 'graphql';

const buildMutation = (name: string, type: any, input: any, model: any) => {
  const resolver = new Resolver(model);
  return {
    [`create${name}`]: {
      type: type,
      args: {
        input: { type: input },
      },
      resolve: (_value: unknown, { input }: { input: Record<string, unknown> }) => {
        return resolver.create(input);
      },
    },
    [`update${name}`]: {
      type: type,
      args: {
        id: { type: GraphQLID },
        input: { type: input },
      },
      resolve: (
        _value: unknown,
        { id, input }: { id: string | number; input: Record<string, unknown> },
      ) => {
        return resolver.update(id, input);
      },
    },
    [`destroy${name}`]: {
      type: type,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (_value: unknown, { id }: { id: string | number }) => {
        return resolver.destroy(id);
      },
    },
  } as Record<string, any>;
};

export default buildMutation;
