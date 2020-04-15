import configKnex from "knex";
import { NextApiRequest, NextApiResponse } from "next";

const knex = configKnex({
  client: "pg",
  connection: process.env.DB_CONNECTION,
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await knex.select("*").from("users");
  return res.json(result);
};
