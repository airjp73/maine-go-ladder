/**
 * @jest-environment ./test/testEnv.js
 */
import knex from "../common/server/knex";
import {
  generateCollection,
  randomUser,
  randomLadderEntry,
  withArchived,
} from "./randomUtils";
import { getUsers } from "../pages/api/users";
import random from "lodash/random";
import { NewGame, Game } from "../resources/games/Game";
import { recordGame } from "../pages/api/record-game";
import { cleanupDB } from "./dbUtil";

describe("record-game", () => {
  beforeEach(async () => {
    await cleanupDB();
  });

  it("should record a game and update the users' ranks", async () => {
    const users = await generateCollection(
      () => randomUser(withArchived(false)),
      2
    );
    await Promise.all(
      users.map((user) => generateCollection(() => randomLadderEntry(user)))
    );

    const usersWithLadder = await getUsers();
    expect(usersWithLadder).toHaveLength(2);

    const winner = usersWithLadder[random(0, 1)];
    const loser =
      usersWithLadder[0] === winner ? usersWithLadder[1] : usersWithLadder[0];
    const newGame: NewGame = {
      black: winner.id,
      white: loser.id,
      winner: winner.id,
    };
    await recordGame(newGame);

    const games: Game[] = await knex("games").select("*");
    expect(games).toHaveLength(1);
    expect(games[0].black).toEqual(winner.id);
    expect(games[0].white).toEqual(loser.id);
    expect(games[0].winner).toEqual(winner.id);
  });
});
