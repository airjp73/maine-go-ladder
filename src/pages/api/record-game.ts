import knex from "../../common/server/knex";
import { NewGame } from "../../resources/games/Game";
import createRequestHandler from "../../common/server/createRequestHandler";
import Knex from "knex";
import { LadderHistoryItem } from "../../resources/ladder-history/LadderHistoryItem";
import createAuditRecord from "../../common/server/createAuditRecord";
import { AuditEventType } from "../../resources/audit-events/AuditEvent";

export async function recordGame(game: NewGame): Promise<void> {
  const winner = game.winner;
  const loser = game.black === game.winner ? game.white : game.black;

  await knex.transaction(async (trx) => {
    const gameId = await trx("games")
      .insert({
        black: game.black,
        white: game.white,
        winner,
      })
      .returning("id");

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

    await createAuditRecord(trx, AuditEventType.GAME_RECORDED, {
      gameId: gameId[0],
      black: game.black,
      white: game.white,
      winner: game.winner,
    });
  });
}

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

export default createRequestHandler({
  POST: async (req, res) => {
    await recordGame(req.body);
    return res.send(200);
  },
});
