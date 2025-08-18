import dotenv from 'dotenv';

dotenv.config();

// Prisma replaces Sequelize. We expose a singleton PrismaClient instance.
import { PrismaClient } from '@prisma/client';

// Prefer DATABASE_URL for Prisma; fallback to legacy envs if needed.
const databaseUrl =
  process.env.DATABASE_URL ||
  (process.env.DB_DIALECT === 'postgres'
    ? `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
    : undefined);

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is not set and legacy DB_* variables are insufficient to build one.'
  );
}

// Note: Prisma reads DATABASE_URL from env automatically, but we compute it above
// to support legacy variables during migration.
process.env.DATABASE_URL = databaseUrl;

const prisma = new PrismaClient();

export default prisma;
