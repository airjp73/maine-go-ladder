import type Knex from "knex";

/**
 * At this stage, there's no reason to keep any data around.
 * Just wipe it all.
 */
async function wipeUsersAndGames(knex: Knex) {
  await knex("games").where(1, 1).del();
  await knex("users").where(1, 1).del();
}

exports.up = async function up(knex: Knex): Promise<any> {
  await wipeUsersAndGames(knex);
  await knex.schema.table("users", (table) => {
    table.dropColumn("ladder_rung");
  });
  await knex.schema.createTable("ladder_history", (table) => {
    table
      .uuid("id")
      .primary()
      .notNullable()
      .defaultTo(knex.raw("uuid_generate_v4()"));
    table.integer("ladder_rung").notNullable();
    table.uuid("user").notNullable().references("id").inTable("users");
    table.timestamps(false, true);
  });
};

exports.down = async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable("ladder_history");
  await wipeUsersAndGames(knex);
  await knex.schema.table("users", (table) => {
    table.integer("ladder_rung").notNullable();
  });
};
