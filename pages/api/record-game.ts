import { NextApiRequest, NextApiResponse } from "next";
import knex from "../../server/knex";
import { NewGame } from "../../apiTypes/User";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(400);

  const body = req.body as NewGame;
  const winner = body.winner;
  const loser = body.black === body.winner ? body.white : body.black;

  await knex.transaction(async (trx) => {
    await trx("games").insert({
      black_player: body.black,
      white_player: body.white,
      winning_player: winner,
    });

    await trx("users")
      .where("id", "=", loser)
      .decrement("ladder_rung", 1)
      .update({ streak: 0 })
      .returning("streak");

    const streak: number = await trx("users")
      .where("id", "=", winner)
      .increment({ ladder_rung: 1, streak: 1 } as any)
      .returning("streak");

    if (streak >= 3)
      await trx("users")
        .where("id", "=", winner)
        .increment("ladder_rung", 1)
        .decrement("streak", 3);
  });

  return res.send(200);
};
