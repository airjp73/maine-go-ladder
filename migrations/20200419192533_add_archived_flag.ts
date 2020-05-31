import type Knex from "knex";

exports.up = async function up(knex: Knex): Promise<void> {
  await knex.schema.table("users", (table) => {
    table.boolean("archived").notNullable().defaultTo(false);
  });
};

exports.down = async function down(knex: Knex): Promise<void> {
  await knex.schema.table("users", (table) => {
    table.dropColumn("archived");
  });
};
