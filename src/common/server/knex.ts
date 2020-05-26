import configKnex from "knex";

const getUrl = () => {
  const workerId = process.env.JEST_WORKER_ID;
  const testUrl = `postgresql://localhost:5432/maine_go_ladder_test${workerId}`;
  const devUrl = "postgresql://localhost:5432/maine_go_ladder";
  const prodUrl = process.env.DATABASE_CONNECTION_URL;

  if (process.env.NODE_ENV === "test") return testUrl;
  return prodUrl ?? devUrl;
};

function createKnex() {
  return configKnex({
    client: "pg",
    connection: getUrl(),
  });
}

let knex: ReturnType<typeof createKnex> | null = null;
if (!knex) {
  knex = createKnex();
}

export default knex!;
