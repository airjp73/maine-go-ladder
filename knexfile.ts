// @ts-ignore
require("ts-node/register");

module.exports = {
  client: "pg",
  connection: "postgresql://localhost:5432/maine_go_ladder",
  migrations: {
    extension: "ts",
  },
};
