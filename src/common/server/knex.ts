import configKnex from "knex";

const getTestUrl = () => {
  const workerId = process.env.JEST_WORKER_ID;
  const dbName = `maine_go_ladder_test${workerId}`;

  const defaultUrl = "postgresql://localhost:5432";
  const envUrl = process.env.DATABASE_CONNECTION_URL;
  const baseUrl = envUrl ?? defaultUrl;

  return `${baseUrl}/${dbName}`;
};

const getProdUrl = () => {
  const devUrl = "postgresql://localhost:5432/maine_go_ladder";
  const envUrl = process.env.DATABASE_CONNECTION_URL;
  return envUrl ?? devUrl;
};

const getUrl = () => {
  if (process.env.NODE_ENV === "test") return getTestUrl();
  return getProdUrl();
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
