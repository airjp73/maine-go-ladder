import knex from "../../common/server/knex";
import { NewGame } from "../../resources/games/Game";
import createRequestHandler from "../../common/server/createRequestHandler";
import Knex from "knex";
import { LadderHistoryItem } from "../../resources/users/LadderHistoryItem";

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

      const streak: number = await trx("users")
        .where("id", "=", winner)
        .increment("streak", 1)
        .returning("streak");

      let winnerGain = 1;
      if (streak >= 3) {
        winnerGain = 2;
        await trx("users").where("id", "=", winner).decrement("streak", 3);
      }

      await updateRung(trx, winner, winnerGain);
      await updateRung(trx, loser, -1);

      await trx("users").where("id", "=", loser).update("streak", 0);
    });

    return res.send(200);
  },
});

async function updateRung(
  trx: Knex.Transaction,
  user: string,
  increment: number
) {
  const currentHistoryRecord: LadderHistoryItem = (
    await trx("ladder_history")
      .select("ladder_rung")
      .where("user", "=", user)
      .orderBy("created_at", "desc")
      .limit(1)
  )[0];

  await trx("ladder_history").insert({
    ladder_rung: currentHistoryRecord.ladder_rung + increment,
    user,
  });
}
