import range from "lodash/range";
import random from "lodash/random";
import knex from "../common/server/knex";
import { User } from "../resources/users/User";
import { getUsers } from "../pages/api/users";

function randomString() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function randomBoolean() {
  return Math.random() >= 0.5;
}

function generateCollection<T>(
  supplier: () => Promise<T>,
  num?: number
): Promise<T[]> {
  return Promise.all(range(0, num || random(2, 5)).map(supplier));
}

async function randomUser(): Promise<User> {
  const user: Partial<User> = {
    name: randomString(),
    archived: randomBoolean(),
    streak: 0,
  };
  return (await knex("users").insert(user).returning("*"))[0];
}

describe("get users", () => {
  afterEach(async () => {
    await knex("users").del();
  });

  it("should return all unarchived users", async () => {
    const users = await generateCollection(randomUser);
    const expected = users.filter((user) => !user.archived);
    const actual = await getUsers();

    // TODO: Test ladder rung, too

    expect(actual).toHaveLength(expected.length);
    actual.forEach((user) => {
      const match = expected.find(
        (possibleMatch) => possibleMatch.id === user.id
      );
      expect(match).toBeDefined();
    });
  });
});
