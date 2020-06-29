import knex from "./src/common/server/knex";
import "@testing-library/jest-dom";

// eslint-disable-next-line no-undef
afterAll(() => {
  knex.destroy();
});
