import range from "lodash/range";
import random from "lodash/random";
import knex from "../common/server/knex";
import { User, UnsavedUser } from "../resources/users/User";
import { LadderHistoryItem } from "../resources/ladder-history/LadderHistoryItem";
import { Game, NewGame } from "../resources/games/Game";

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

export function randomItem<T>(items: T[]): T {
  expect(items.length).toBeGreaterThanOrEqual(1);
  const index = random(0, items.length - 1);
  return items[index];
}

export function randomItemExcept<T>(items: T[], except: T | T[]): T {
  const itemsToChoose = items.filter(
    Array.isArray(except)
      ? (item) => !except.includes(item)
      : (item) => item !== except
  );
  return randomItem(itemsToChoose);
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

export async function randomGame(users: User[]): Promise<Game> {
  const winner = randomItem(users);
  const loser = randomItemExcept(users, winner);
  const black = randomBoolean() ? winner : loser;
  const white = winner === black ? loser : winner;
  const newGame: NewGame = {
    black: black.id,
    white: white.id,
    winner: winner.id,
  };
  const gameRecord = (await knex("games").insert(newGame).returning("*"))[0];
  return { ...gameRecord, black, white };
}

export function generateCollection<T>(
  supplier: () => Promise<T>,
  num?: number
): Promise<T[]> {
  return Promise.all(range(0, num || random(3, 7)).map(() => supplier()));
}
