import type Knex from "knex";

exports.up = async function up(knex: Knex) {
  await knex.raw('create extension if not exists "uuid-ossp"');

  await knex.schema.createTable("users", (table) => {
    table
      .uuid("id")
      .primary()
      .notNullable()
      .defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("name").notNullable();
    table.integer("ladder_rung").notNullable();
    table.integer("streak").notNullable();
    table.timestamps(false, true);
  });

  await knex.schema.createTable("games", (table) => {
    table
      .uuid("id")
      .primary()
      .notNullable()
      .defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("white").notNullable().references("id").inTable("users");
    table.uuid("black").notNullable().references("id").inTable("users");
    table.uuid("winner").notNullable().references("id").inTable("users");
    table.string("sgf").nullable();
    table.timestamps(false, true);
  });
};

exports.down = async function down(knex: Knex) {
  await knex.schema.dropTable("games");
  await knex.schema.dropTable("users");
  await knex.raw('drop extension if exists "uuid-ossp"');
};
