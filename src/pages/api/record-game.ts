import knex from "../../common/server/knex";
import { NewGame } from "../../resources/games/Game";
import createRequestHandler from "../../common/server/createRequestHandler";

export default createRequestHandler({
  POST: async (req, res) => {
    const body = req.body as NewGame;
    const winner = body.winner;
    const loser = body.black === body.winner ? body.white : body.black;

    await knex.transaction(async (trx) => {
      await trx("games").insert({
        black: body.black,
        white: body.white,
        winner,
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
  },
});
