import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import prisma from '../lib/database';

// Minimal Pothos builder with Prisma plugin.
// Typing can be enhanced later by adding PrismaTypes from the plugin generator.
export const builder = new SchemaBuilder<{ PrismaTypes: {} }>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});
