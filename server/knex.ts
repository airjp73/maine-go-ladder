import configKnex from "knex";

const knex = configKnex({
  client: "pg",
  connection: process.env.DB_CONNECTION,
});

export default knex;
