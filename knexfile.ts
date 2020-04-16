// @ts-ignore
require("dotenv").config();
require("ts-node/register");

module.exports = {
  client: "pg",
  connection: process.env.DATABASE_CONNECTION_URL,
  migrations: {
    extension: "ts",
  },
};
