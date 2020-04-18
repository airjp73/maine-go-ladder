import { NextApiRequest, NextApiResponse } from "next";
import knex from "../../server/knex";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const result = await knex("users")
      .insert({ ...req.body, streak: 0 })
      .returning("*");
    return res.json(result);
  } else {
    const result = await knex.select("*").from("users");
    return res.json(result);
  }
};
