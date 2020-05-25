import random from "lodash/random";
import knex from "../common/server/knex";
import { User, NewUser } from "../resources/users/User";
import { getUsers, createNewUser } from "../pages/api/users";
import { LadderHistoryItem } from "../resources/users/LadderHistoryItem";
import {
  randomString,
  randomUser,
  randomLadderEntry,
  generateCollection,
} from "./randomUtils";

const sortByDate = (fieldName: string) => (a: any, b: any) => {
  const dateA = new Date(a[fieldName]);
  const dateB = new Date(b[fieldName]);
  return dateB.getTime() - dateA.getTime();
};

describe("user endpoints", () => {
  beforeEach(async () => {
    await knex("ladder_history").del();
    await knex("users").del();
  });

  describe("get users", () => {
    it("should return all unarchived users", async () => {
      const users = await generateCollection(() => randomUser());
      const expected = users.filter((user) => !user.archived);
      const actual = await getUsers();

      expect(actual).toHaveLength(expected.length);
      actual.forEach((user) => {
        const match = expected.find(
          (possibleMatch) => possibleMatch.id === user.id
        );
        expect(match).toBeDefined();
      });
    });

    it("should return all the latest ladder entries for each user", async () => {
      const users = await generateCollection(() => randomUser());
      const usersWithLadder = await Promise.all(
        users.map(async (user) => {
          const ladderEntries = await generateCollection(() =>
            randomLadderEntry(user)
          );
          const latestEntry = ladderEntries.sort(sortByDate("created_at"))[0];
          return { ...user, ladder_rung: latestEntry.ladder_rung };
        })
      );
      const expected = usersWithLadder.filter((user) => !user.archived);
      const actual = await getUsers();

      expect(actual).toHaveLength(expected.length);
      actual.forEach((user) => {
        const match = expected.find(
          (possibleMatch) => possibleMatch.id === user.id
        );
        expect(match).toBeDefined();
        expect(match!.ladder_rung).toEqual(user.ladder_rung);
      });
    });
  });

  describe("post user", () => {
    it("should save a new user and return that user's info", async () => {
      const newUser: NewUser = {
        name: randomString(),
        ladder_rung: random(-100, 100),
      };
      const result = await createNewUser(newUser);
      expect(result.name).toEqual(newUser.name);
      expect(result.ladder_rung).toEqual(newUser.ladder_rung);

      const savedUsers: User[] = await knex("users")
        .select("*")
        .where({ id: result.id });
      expect(savedUsers).toHaveLength(1);
      expect(savedUsers[0].name).toEqual(newUser.name);

      const savedRungs: LadderHistoryItem[] = await knex("ladder_history")
        .select("*")
        .where({ user: savedUsers[0].id });
      expect(savedRungs).toHaveLength(1);
      expect(savedRungs[0].ladder_rung).toEqual(newUser.ladder_rung);

      const resultFromGet = await getUsers();
      expect(resultFromGet).toHaveLength(1);
      expect(resultFromGet[0].name).toEqual(newUser.name);
      expect(resultFromGet[0].ladder_rung).toEqual(newUser.ladder_rung);
    });
  });
});
