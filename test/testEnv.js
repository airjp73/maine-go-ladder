require("ts-node/register");
const path = require("path");
const NodeEnvironment = require("jest-environment-node");
const configKnex = require("knex");

const workerId = process.env.JEST_WORKER_ID;
const defaultUrl = `postgresql://localhost:5432`;
const connectionUrl = process.env.DATABASE_CONNECTION_URL || defaultUrl;
const dbName = `maine_go_ladder_test${workerId}`;

// These were taken from stack overflow
// I don't appear to need them right now, but I want to hold onto them
// const drop1 = `
//   REVOKE CONNECT ON DATABASE ${dbName} FROM public;
// `;

// const drop2 = `
//   SELECT pg_terminate_backend(pg_stat_activity.pid)
//   FROM pg_stat_activity
//   WHERE pg_stat_activity.datname = '${dbName}';
// `;

class CustomEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
  }

  async setup() {
    await super.setup();

    // Create test database
    this.rootDb = configKnex({
      client: "pg",
      connection: connectionUrl,
    });
    await this.rootDb.raw(`create database ${dbName}`);

    // Connect to tes tdatabase and migrate
    this.knex = configKnex({
      client: "pg",
      connection: `${connectionUrl}/${dbName}`,
      migrations: {
        directory: path.resolve(__dirname, "../migrations"),
      },
    });
    await this.knex.migrate.latest();
  }

  async teardown() {
    await super.teardown();
    await this.knex.destroy();
    await this.rootDb.raw(`drop database ${dbName}`);
    await this.rootDb.destroy();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = CustomEnvironment;
