import range from "lodash/range";
import random from "lodash/random";
import knex from "../common/server/knex";
import { User, UnsavedUser } from "../resources/users/User";
import { LadderHistoryItem } from "../resources/users/LadderHistoryItem";

export function randomString() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export function randomBoolean() {
  return Math.random() >= 0.5;
}

export function randomDate() {
  return new Date(random(new Date(2012, 1, 1).getTime(), Date.now()));
}

type UserCustomizer = (user: UnsavedUser) => UnsavedUser;
export async function randomUser(
  ...customizers: UserCustomizer[]
): Promise<User> {
  const user: UnsavedUser = {
    name: randomString(),
    archived: randomBoolean(),
    streak: 0,
  };

  const finalUser = customizers.reduce(
    (customizedUser, customizer) => customizer(customizedUser),
    user
  );

  return (await knex("users").insert(finalUser).returning("*"))[0];
}

export const withArchived = (archived: boolean): UserCustomizer => (user) => ({
  ...user,
  archived,
});

export async function randomLadderEntry(
  user: User
): Promise<LadderHistoryItem> {
  const ladderEntry: any = {
    ladder_rung: random(-50, 50),
    user: user.id,
    created_at: randomDate(),
  };
  return (await knex("ladder_history").insert(ladderEntry).returning("*"))[0];
}

export function generateCollection<T>(
  supplier: () => Promise<T>,
  num?: number
): Promise<T[]> {
  return Promise.all(range(0, num || random(2, 5)).map(supplier));
}
