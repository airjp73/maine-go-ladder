import { NextApiRequest, NextApiResponse } from "next";
import knex from "../../server/knex";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await knex.select("*").from("users");
  return res.json(result);
};
