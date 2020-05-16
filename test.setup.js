import knex from "./src/common/server/knex";

afterAll(() => {
  knex.destroy();
});
