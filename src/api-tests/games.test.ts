/**
 * @jest-environment ./test/testEnv.js
 */
import {
  generateCollection,
  randomUser,
  randomGame,
  randomItem,
  forEachPage,
} from "./randomUtils";
import { pick } from "lodash";
import { GAMES_PAGE_SIZE, getGamesForUser } from "../pages/api/games";

describe("games", () => {
  it("should return 1 page of games (10 games) for a user", async () => {
    const users = await generateCollection(randomUser, 3);
    const games = await generateCollection(() => randomGame(users), 30);
    const targetUser = randomItem(users);
    const expected = games
      .filter(
        (game) =>
          game.black.id === targetUser.id || game.white.id === targetUser.id
      )
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

    await forEachPage(
      expected,
      GAMES_PAGE_SIZE,
      async (page, numGamesOnPage, expectedGames) => {
        const actual = await getGamesForUser(targetUser.id, page);
        expect(actual).toHaveLength(numGamesOnPage);
        actual.forEach((actualGame, index) => {
          expect(expectedGames[index]).toMatchObject({
            id: actualGame.id,
            black: expect.objectContaining(
              pick(actualGame.black, "id", "name")
            ),
            white: expect.objectContaining(
              pick(actualGame.white, "id", "name")
            ),
            winner: actualGame.winner,
          });
        });
      }
    );
  });

  it("should return empty if the page is too large", async () => {
    const users = await generateCollection(randomUser, 3);
    await generateCollection(() => randomGame(users), 30);
    const targetUser = randomItem(users);
    expect(await getGamesForUser(targetUser.id, 5)).toHaveLength(0);
  });
});
