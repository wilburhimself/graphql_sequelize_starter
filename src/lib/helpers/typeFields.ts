import {
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFieldConfigMap,
} from 'graphql';

/**
 * LEGACY: Sequelize-oriented field mapper
 *
 * This helper was originally designed to translate Sequelize attribute metadata
 * (using `type.constructor.key`) into GraphQL field types. To ease migration
 * away from Sequelize, it now also accepts simpler, non-Sequelize keys such as
 * 'String' | 'Boolean' | 'Int' | 'Float' (case-insensitive).
 *
 * Prefer migrating to explicit GraphQL types or a Prisma-first schema builder
 * (e.g., Pothos/Nexus). Once callers stop using `buildType()/getModelFields()`,
 * this module can be removed.
 */

// Minimal shapes for legacy Sequelize attribute metadata

type Attribute = { fieldName: string; type: { constructor: { key?: string } } } & Record<
  string,
  unknown
>;

export type ModelLike = { name: string; attributes: Record<string, Attribute> } & Record<
  string,
  unknown
>;

export const getModelFields = (model: ModelLike): GraphQLFieldConfigMap => {
  const fs: GraphQLFieldConfigMap = {};

  Object.values(model.attributes).map((field) => {
    return Object.assign(fs, {
      [field.fieldName]: {
        type: getFieldType(field),
      },
    });
  });

  return fs;
};

export const getFieldType = (field: Attribute) => {
  // Support both Sequelize-style keys and simple string keys.
  // 1) Sequelize: field.type.constructor.key
  // 2) Simple: field.type is a string like 'String' | 'Boolean' | 'Int' | 'Float'
  type Ctor = { key?: string } | undefined;
  type MaybeSequelize = { constructor?: Ctor } | string | unknown;

  const t: MaybeSequelize = (field as { type: unknown }).type as MaybeSequelize;
  let raw: string | undefined;

  if (typeof t === 'string') {
    raw = t;
  } else if (t && typeof t === 'object') {
    const ctor = (t as { constructor?: { key?: string } }).constructor;
    raw = ctor && typeof ctor === 'object' ? (ctor as { key?: string }).key : undefined;
  }

  const keyUpper = String(raw ?? '').toUpperCase();
  const keyLower = String(raw ?? '').toLowerCase();

  switch (keyUpper) {
    // Strings
    case 'STRING':
    case 'TEXT':
      return GraphQLString;
    // Booleans
    case 'BOOLEAN':
    case 'BOOL':
      return GraphQLBoolean;
    // Integers
    case 'INTEGER':
    case 'INT':
      return GraphQLInt;
    // Floats / numbers
    case 'DOUBLE PRECISION':
    case 'FLOAT':
    case 'DOUBLE':
    case 'DECIMAL':
    case 'NUMBER':
      return GraphQLFloat;
  }

  // Fallback for common lowercase names when not provided by Sequelize
  switch (keyLower) {
    case 'string':
      return GraphQLString;
    case 'boolean':
      return GraphQLBoolean;
    case 'int':
    case 'integer':
      return GraphQLInt;
    case 'float':
    case 'double':
    case 'number':
      return GraphQLFloat;
    default:
      return GraphQLString;
  }
};

export default getModelFields;
