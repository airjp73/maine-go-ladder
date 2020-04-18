import configKnex from "knex";

const knex = configKnex({
  client: "pg",
  connection: process.env.DATABASE_CONNECTION_URL,
});

export default knex;
