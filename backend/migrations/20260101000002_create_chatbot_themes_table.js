// ============================================================
// Table "chatbot_themes" : thèmes du chatbot (chacun a son propre
// dossier d'upload nommé d'après le thème, et ses propres Q/R)
// ============================================================

exports.up = function (knex) {
  return knex.schema.createTable("chatbot_themes", (table) => {
    table.increments("id").primary();
    table.string("name", 150).notNullable().unique();
    // slug utilisé aussi comme nom de dossier d'upload (unique, sûr pour le système de fichiers)
    table.string("slug", 170).notNullable().unique();
    table.string("folder_name", 170).notNullable().unique();
    table.text("description").nullable();
    table.boolean("is_active").notNullable().defaultTo(true);
    table
      .integer("created_by")
      .unsigned()
      .references("id")
      .inTable("admins")
      .onDelete("SET NULL");
    table.timestamps(true, true);

    table.index(["is_active"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("chatbot_themes");
};
