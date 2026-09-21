// ============================================================
// Table "chatbot_discussions" : une discussion = une session de
// chat indépendante, liée à un contact (chatbot_users) et à un
// thème choisi. Deux discussions ne sont JAMAIS fusionnées, même
// si le contact (nom/email/téléphone) est identique.
// ============================================================

exports.up = function (knex) {
  return knex.schema.createTable("chatbot_discussions", (table) => {
    table.increments("id").primary();
    table
      .integer("chatbot_user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("chatbot_users")
      .onDelete("CASCADE");
    table
      .integer("theme_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("chatbot_themes")
      .onDelete("RESTRICT");
    table.timestamp("started_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("ended_at").nullable();
    table.string("status", 20).notNullable().defaultTo("open"); // open | closed
    table.timestamps(true, true);

    table.index(["theme_id"]);
    table.index(["chatbot_user_id"]);
    table.index(["started_at"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("chatbot_discussions");
};
