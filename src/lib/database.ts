import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const db = new (Sequelize as unknown as new (
  database: unknown,
  username: unknown,
  password: unknown,
  options: {
    host?: unknown;
    dialect?: unknown;
    define?: { timestamps?: boolean };
  },
) => unknown)(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  define: { timestamps: false },
});

export default db;
