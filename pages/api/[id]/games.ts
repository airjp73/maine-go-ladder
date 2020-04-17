import { NextApiRequest, NextApiResponse } from "next";
import knex from "../../../server/knex";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await knex
    .select("*")
    .from("users")
    .leftJoin("games", function () {
      this.on("games.black_player", "=", "users.id").orOn(
        "games.white_player",
        "=",
        "users.id"
      );
    })
    .where("id", 1);
  return res.json(result);
};
