import configKnex from "knex";
import { NextApiRequest, NextApiResponse } from "next";

const knex = configKnex({
  client: "pg",
  connection: "postgresql://localhost:5432/maine_go_ladder",
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await knex.select("*").from("users");
  return res.json(result);
};
