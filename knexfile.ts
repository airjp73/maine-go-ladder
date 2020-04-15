// @ts-ignore
require("dotenv").config();
require("ts-node/register");

module.exports = {
  client: "pg",
  connection: process.env.DB_CONNECTION,
  migrations: {
    extension: "ts",
  },
};
