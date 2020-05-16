// @ts-ignore
require("dotenv").config();
require("ts-node/register");

const defaultUrl =
  process.env.NODE_ENV === "test"
    ? "postgresql://localhost:5432/maine_go_ladder_test"
    : "postgresql://localhost:5432/maine_go_ladder";

module.exports = {
  client: "pg",
  connection: process.env.DATABASE_CONNECTION_URL ?? defaultUrl,
  migrations: {
    extension: "ts",
  },
};
