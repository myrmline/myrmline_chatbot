// ============================================================
// Table "chatbot_questions" : questions/réponses rattachées à un thème
// ============================================================

exports.up = function (knex) {
  return knex.schema.createTable("chatbot_questions", (table) => {
    table.increments("id").primary();
    table
      .integer("theme_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("chatbot_themes")
      .onDelete("CASCADE");
    table.text("question").notNullable();
    table.text("answer").notNullable();
    table.enu("source", ["manual", "import"]).notNullable().defaultTo("manual");
    table
      .integer("import_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("chatbot_imports")
      .onDelete("SET NULL");
    table.boolean("is_active").notNullable().defaultTo(true);
    table
      .integer("created_by")
      .unsigned()
      .references("id")
      .inTable("admins")
      .onDelete("SET NULL");
    table.timestamps(true, true);

    table.index(["theme_id"]);
    table.index(["theme_id", "is_active"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("chatbot_questions");
};
