import configKnex from "knex";

function createKnex() {
  return configKnex({
    client: "pg",
    connection: process.env.DATABASE_CONNECTION_URL,
  });
}

let knex: ReturnType<typeof createKnex> | null = null;
if (!knex) {
  knex = createKnex();
}

export default knex!;
