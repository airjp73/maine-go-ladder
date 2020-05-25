import configKnex from "knex";

const workerId = process.env.JEST_WORKER_ID;
const defaultUrl =
  process.env.NODE_ENV === "test"
    ? `postgresql://localhost:5432/maine_go_ladder_test${workerId}`
    : "postgresql://localhost:5432/maine_go_ladder";

function createKnex() {
  return configKnex({
    client: "pg",
    connection: process.env.DATABASE_CONNECTION_URL ?? defaultUrl,
  });
}

let knex: ReturnType<typeof createKnex> | null = null;
if (!knex) {
  knex = createKnex();
}

export default knex!;
