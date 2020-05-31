/**
 * @jest-environment ./test/testEnv.js
 */
import {
  generateCollection,
  randomUser,
  randomGame,
  randomItem,
} from "./randomUtils";
import { pick } from "lodash";
import { getGamesForUser } from "../pages/api/games";

describe("games", () => {
  it("should return all games for a user", async () => {
    const users = await generateCollection(randomUser, 10);
    const games = await generateCollection(() => randomGame(users), 20);
    const targetUser = randomItem(users);
    const expected = games.filter(
      (game) =>
        game.black.id === targetUser.id || game.white.id === targetUser.id
    );
    const actual = await getGamesForUser(targetUser.id);
    expect(actual).toHaveLength(expected.length);
    actual.forEach((actualGame) => {
      expect(expected).toContainEqual(
        expect.objectContaining({
          id: actualGame.id,
          black: expect.objectContaining(pick(actualGame.black, "id", "name")),
          white: expect.objectContaining(pick(actualGame.white, "id", "name")),
          winner: actualGame.winner,
        })
      );
    });
  });
});
