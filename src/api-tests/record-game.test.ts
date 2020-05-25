import knex from "../common/server/knex";
import {
  generateCollection,
  randomUser,
  randomLadderEntry,
  withArchived,
} from "./randomUtils";
import { getUsers } from "../pages/api/users";
import random from "lodash/random";
import { NewGame } from "../resources/games/Game";

describe("record-game", () => {
  beforeEach(async () => {
    await knex("ladder_history").del();
    await knex("games").del();
    await knex("users").del();
  });

  it("should record a game and update the users' ranks", async () => {
    const usersWithLadder = await getUsers();
    const users = await generateCollection(
      () => randomUser(withArchived(false)),
      2
    );
    expect(users).toHaveLength(2);
    await Promise.all(
      users.map((user) => generateCollection(() => randomLadderEntry(user)))
    );
    expect(usersWithLadder).toHaveLength(2);
    const winner = usersWithLadder[random(0, 1)];
    const loser =
      usersWithLadder[0] === winner ? usersWithLadder[1] : usersWithLadder[0];
    const newGame: NewGame = {
      black: winner.id,
      white: loser.id,
      winner: winner.id,
    };
  });
});
