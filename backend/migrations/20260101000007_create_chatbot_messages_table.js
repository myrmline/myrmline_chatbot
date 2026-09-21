// ============================================================
// Table "chatbot_messages" : chaque message échangé au sein
// d'une discussion (utilisateur ou bot)
// ============================================================

exports.up = function (knex) {
  return knex.schema.createTable("chatbot_messages", (table) => {
    table.increments("id").primary();
    table
      .integer("discussion_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("chatbot_discussions")
      .onDelete("CASCADE");
    table.enu("sender", ["user", "bot"]).notNullable();
    table.text("content").notNullable();
    // Référence à la question de la base de connaissances trouvée par le bot (facultatif)
    table
      .integer("matched_question_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("chatbot_questions")
      .onDelete("SET NULL");
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.index(["discussion_id"]);
    table.index(["discussion_id", "created_at"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("chatbot_messages");
};
