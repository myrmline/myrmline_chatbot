// ============================================================
// Ajoute un token opaque (UUID) à chaque discussion, indispensable
// pour poster un message ou relire la conversation depuis l'API
// publique. Empêche qu'un identifiant numérique séquentiel permette
// de deviner/consulter la discussion d'un autre utilisateur.
// ============================================================

exports.up = async function (knex) {
  // gen_random_uuid() nécessite l'extension pgcrypto
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
  await knex.schema.alterTable("chatbot_discussions", (table) => {
    table.uuid("public_token").notNullable().defaultTo(knex.raw("gen_random_uuid()"));
  });
  await knex.schema.alterTable("chatbot_discussions", (table) => {
    table.unique(["public_token"]);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("chatbot_discussions", (table) => {
    table.dropUnique(["public_token"]);
    table.dropColumn("public_token");
  });
};
