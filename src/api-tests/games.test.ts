/**
 * @jest-environment ./test/testEnv.js
 */
import {
  generateCollection,
  randomUser,
  randomGame,
  randomItem,
  forEachPage,
  wait,
} from "./apiTestUtils";
import { pick } from "lodash";
import { GAMES_PAGE_SIZE, getGamesForUser } from "../pages/api/games";

describe("games", () => {
  it("should return 1 page of games (10 games) for a user", async () => {
    const users = await generateCollection(() => randomUser(), 3);
    const games = await generateCollection(async (num) => {
      await wait(num * 50); // wait to ensure every game has a different time
      return await randomGame(users);
    }, 30);
    const targetUser = randomItem(users);
    const expected = games
      .filter(
        (game) =>
          game.black.id === targetUser.id || game.white.id === targetUser.id
      )
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    await forEachPage(
      expected,
      GAMES_PAGE_SIZE,
      async (page, numGamesOnPage, expectedGames) => {
        const actual = await getGamesForUser(targetUser.id, page);
        expect(actual.items).toHaveLength(numGamesOnPage);
        expect(actual.page).toEqual(page);
        expect(actual.hasMore).toEqual(numGamesOnPage === 10);
        expect(actual.items.map((item) => item.id)).toEqual(
          expectedGames.map((item) => item.id)
        );
        actual.items.forEach((actualGame, index) => {
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
    const users = await generateCollection(() => randomUser(), 3);
    await generateCollection(() => randomGame(users), 30);
    const targetUser = randomItem(users);
    const { items } = await getGamesForUser(targetUser.id, 5);
    expect(items).toHaveLength(0);
  });
});
