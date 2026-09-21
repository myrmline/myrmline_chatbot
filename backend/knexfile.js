// ============================================================
// Configuration Knex (connexion PostgreSQL, migrations, seeds)
// ============================================================

require("dotenv").config();

const baseConnection = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  user: process.env.DB_USER || "skincare",
  password: process.env.DB_PASSWORD || "skincare_pw",
  database: process.env.DB_NAME || "skincare_chat",
};

const shared = {
  client: "pg",
  connection: baseConnection,
  pool: { min: 2, max: 10 },
  migrations: {
    directory: "./migrations",
    tableName: "knex_migrations",
  },
  seeds: {
    directory: "./seeds",
  },
};

module.exports = {
  development: shared,
  test: shared,
  production: shared,
};
