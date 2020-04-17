import { NextApiRequest, NextApiResponse } from "next";
import knex from "../../server/knex";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const result = await knex("games").insert(req.body).returning("*");
    return res.json(result);
  } else {
    return res.status(400);
  }
};
