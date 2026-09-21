// ============================================================
// Table "chatbot_imports" : historique des imports de fichiers
// (TXT / PDF / DOCX) de questions-réponses par thème
// ============================================================

exports.up = function (knex) {
  return knex.schema.createTable("chatbot_imports", (table) => {
    table.increments("id").primary();
    table
      .integer("theme_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("chatbot_themes")
      .onDelete("CASCADE");
    table
      .integer("admin_id")
      .unsigned()
      .references("id")
      .inTable("admins")
      .onDelete("SET NULL");
    table.string("original_file_name", 255).notNullable();
    table.string("stored_file_name", 255).notNullable();
    table.string("file_path", 500).notNullable();
    table.enu("file_type", ["txt", "pdf", "docx"]).notNullable();
    table.integer("questions_imported").notNullable().defaultTo(0);
    table
      .enu("status", ["success", "partial", "failed"])
      .notNullable()
      .defaultTo("success");
    table.text("error_message").nullable();
    table.timestamps(true, true);

    table.index(["theme_id"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("chatbot_imports");
};
