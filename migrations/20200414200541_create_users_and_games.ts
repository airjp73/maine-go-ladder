import type Knex from "knex";

exports.up = async function up(knex: Knex) {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().notNullable();
    table.string("name").notNullable();
    table.integer("ladder_rung").notNullable();
    table.integer("streak").notNullable();
    table.timestamps();
  });

  await knex.schema.createTable("games", (table) => {
    table.uuid("id").primary().notNullable();
    table.uuid("white_player").notNullable().references("id").inTable("users");
    table.uuid("black_player").notNullable().references("id").inTable("users");
    table
      .uuid("winning_player")
      .notNullable()
      .references("id")
      .inTable("users");
    table.string("sgf").notNullable();
    table.timestamps();
  });
};

exports.down = async function down(knex: Knex) {
  await knex.schema.dropTable("games");
  await knex.schema.dropTable("users");
};
