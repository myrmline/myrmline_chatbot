// ============================================================
// Instance Knex unique, utilisée par tous les contrôleurs.
// Toute l'application interroge la base via le Query Builder
// Knex, sans jamais écrire de SQL brut.
// ============================================================

const knex = require("knex");
const knexConfig = require("../knexfile");

const environment = process.env.NODE_ENV || "development";
const db = knex(knexConfig[environment]);

module.exports = db;
