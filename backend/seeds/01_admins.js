// ============================================================
// Seed : crée le compte administrateur initial (super_admin)
// Le mot de passe est défini via les variables d'environnement
// (voir .env / .env.example) et jamais stocké en clair.
// ============================================================

const bcrypt = require("bcryptjs");
require("dotenv").config();

exports.seed = async function (knex) {
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@skincare.local").toLowerCase();
  const name = process.env.SEED_ADMIN_NAME || "Super Admin";
  const password = process.env.SEED_ADMIN_PASSWORD || "Admin123!";

  const existing = await knex("admins").where({ email }).first();
  if (existing) {
    return; // Ne recrée pas le compte s'il existe déjà (seed idempotent)
  }

  const password_hash = await bcrypt.hash(password, 12);

  await knex("admins").insert({
    name,
    email,
    password_hash,
    role: "super_admin",
    is_active: true,
  });
};
