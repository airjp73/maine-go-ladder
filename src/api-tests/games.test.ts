/**
 * @jest-environment ./test/testEnv.js
 */
import {
  generateCollection,
  randomUser,
  randomGame,
  randomItem,
} from "./randomUtils";
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
      const expectedGame = expected.find((game) => game.id === actualGame.id)!;
      expect(expectedGame).toBeDefined();
      expect(actualGame.black.id).toEqual(expectedGame.black.id);
      expect(actualGame.black.name).toEqual(expectedGame.black.name);
      expect(actualGame.white.id).toEqual(expectedGame.white.id);
      expect(actualGame.white.name).toEqual(expectedGame.white.name);
      expect(actualGame.winner).toEqual(expectedGame.winner);
    });
  });
});
