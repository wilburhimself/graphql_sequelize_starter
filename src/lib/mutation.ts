import Resolver, { Entity } from './resolver';
import { GraphQLID } from 'graphql';

type GraphQLTypeLike = unknown; // minimal due to local graphql shim

const buildMutation = (
  name: string,
  type: GraphQLTypeLike,
  input: GraphQLTypeLike,
  model: Entity,
) => {
  const resolver = new Resolver(model);
  return {
    [`create${name}`]: {
      type: type as unknown,
      args: {
        input: { type: input as unknown },
      },
      resolve: (_value: unknown, { input }: { input: Record<string, unknown> }) => {
        return resolver.create(input);
      },
    },
    [`update${name}`]: {
      type: type as unknown,
      args: {
        id: { type: GraphQLID },
        input: { type: input as unknown },
      },
      resolve: (
        _value: unknown,
        { id, input }: { id: string | number; input: Record<string, unknown> },
      ) => {
        return resolver.update(id, input);
      },
    },
    [`destroy${name}`]: {
      type: type as unknown,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (_value: unknown, { id }: { id: string | number }) => {
        return resolver.destroy(id);
      },
    },
  } as Record<string, unknown>;
};

export default buildMutation;
