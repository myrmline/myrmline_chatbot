// ============================================================
// Configuration centralisée (lecture des variables d'environnement)
// ============================================================

require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 5000,

  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER || "skincare",
    password: process.env.DB_PASSWORD || "skincare_pw",
    database: process.env.DB_NAME || "skincare_chat",
  },

  jwt: {
    secret: process.env.JWT_SECRET || "dev_secret_change_me",
    expiresIn: process.env.JWT_EXPIRES_IN || "8h",
  },

  corsOrigins: (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),

  seedAdmin: {
    name: process.env.SEED_ADMIN_NAME || "Super Admin",
    email: process.env.SEED_ADMIN_EMAIL || "admin@skincare.local",
    password: process.env.SEED_ADMIN_PASSWORD || "Admin123!",
  },

  uploadsRoot: require("path").join(__dirname, "..", "..", "uploads"),
};

module.exports = config;
