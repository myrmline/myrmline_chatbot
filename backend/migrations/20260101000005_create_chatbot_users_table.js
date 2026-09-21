// ============================================================
// Table "chatbot_users" : coordonnées saisies avant chaque
// discussion (nom, email, téléphone). Un même contact peut être
// enregistré plusieurs fois : chaque session crée sa propre ligne,
// rattachée à sa propre discussion (voir chatbot_discussions).
// ============================================================

exports.up = function (knex) {
  return knex.schema.createTable("chatbot_users", (table) => {
    table.increments("id").primary();
    table.string("name", 150).notNullable();
    table.string("email", 190).notNullable();
    table.string("phone", 30).notNullable();
    table.timestamps(true, true);

    table.index(["email"]);
    table.index(["phone"]);
    table.index(["name"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("chatbot_users");
};
