/**
 * @jest-environment ./test/testEnv.js
 */
import random from "lodash/random";
import knex from "../common/server/knex";
import { User, NewUser } from "../resources/users/User";
import { getUsers, createNewUser } from "../pages/api/users";
import { LadderHistoryItem } from "../resources/ladder-history/LadderHistoryItem";
import {
  randomString,
  randomUser,
  randomLadderEntry,
  generateCollection,
  withArchived,
  randomItem,
} from "./randomUtils";
import { cleanupDB } from "./dbUtil";
import { archiveUser } from "../pages/api/users/[userId]";
import { getLadderHistory } from "../pages/api/users/[userId]/ladder-history";

const sortByDate = (fieldName: string) => (a: any, b: any) => {
  const dateA = new Date(a[fieldName]);
  const dateB = new Date(b[fieldName]);
  return dateB.getTime() - dateA.getTime();
};

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
