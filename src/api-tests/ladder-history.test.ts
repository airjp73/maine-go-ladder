/**
 * @jest-environment ./test/testEnv.js
 */
import {
  randomUser,
  randomLadderEntry,
  generateCollection,
  randomItem,
} from "./apiTestUtils";
import { cleanupDB } from "./dbUtil";
import { getLadderHistory } from "../pages/api/users/[userId]/ladder-history";

describe("ladder history endpoints", () => {
  beforeEach(async () => {
    await cleanupDB();
  });

  describe("get ladder history", () => {
    it("should return all ladder history entries for the specified user", async () => {
      const users = await generateCollection(() => randomUser());
      const ladderHistoryItems = (
        await Promise.all(
          users.map((user) => generateCollection(() => randomLadderEntry(user)))
        )
      ).flat();

      const targetUser = randomItem(users);
      const expected = ladderHistoryItems.filter(
        (item) => item.user === targetUser.id
      );

      const actual = await getLadderHistory(targetUser.id);

      expect(actual).toHaveLength(expected.length);
      actual.forEach((item) => {
        const match = expected.find(
          (possibleMatch) => possibleMatch.id === item.id
        );
        expect(match).toBeDefined();
      });
    });
  });
});
