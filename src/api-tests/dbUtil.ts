import knex from "../common/server/knex";

export async function cleanupDB(): Promise<void> {
  await knex("ladder_history").del();
  await knex("games").del();
  await knex("users").del();
  await knex("audit_events").del();
}
