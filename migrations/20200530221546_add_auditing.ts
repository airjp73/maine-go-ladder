import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<void> {
  await knex.schema.createTable("audit_events", (table) => {
    table
      .uuid("id")
      .primary()
      .notNullable()
      .defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("type").notNullable();
    table.boolean("reverted").defaultTo(false).notNullable();
    table.json("details").notNullable();
    table.timestamps(false, true);
  });
};

exports.down = async function (knex: Knex): Promise<void> {
  await knex.schema.dropTable("audit_events");
};
