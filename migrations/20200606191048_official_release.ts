import * as Knex from "knex";

/**
 * For the official release,
 * it's time to clean up any junk data lingering in the system.
 */

exports.up = async function up(knex: Knex): Promise<void> {
  await knex("ladder_history").del();
  await knex("games").del();
  await knex("users").del();
  await knex("audit_events").del();
};

exports.down = async function down(): Promise<void> {
  // No-op -- there are no real changes
};
