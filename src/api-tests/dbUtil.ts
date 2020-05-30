import knex from "../common/server/knex";

export async function cleanupDB() {
  await knex("ladder_history").del();
  await knex("games").del();
  await knex("users").del();
}