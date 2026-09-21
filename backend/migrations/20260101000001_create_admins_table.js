// ============================================================
// Table "admins" : comptes administrateurs du backoffice
// ============================================================

exports.up = function (knex) {
  return knex.schema.createTable("admins", (table) => {
    table.increments("id").primary();
    table.string("name", 150).notNullable();
    table.string("email", 190).notNullable().unique();
    table.string("password_hash", 255).notNullable();
    table.enu("role", ["super_admin", "admin"]).notNullable().defaultTo("admin");
    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamp("last_login_at").nullable();
    table.timestamps(true, true); // created_at / updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("admins");
};
