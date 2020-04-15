export interface UserWithGames {
  id: string;
  name: string;
  ladder_rung: number;
  streak: number;
  games_as_white: Game[];
  games_as_black: Game[];
}

export type User = Pick<UserWithGames, "id" | "name" | "ladder_rung">;

export type UserWithStreak = Pick<UserWithGames, "id" | "streak">;

export interface Game {
  id: string;
  black: User;
  white: User;
  winner: string;
  created_at: string;
}
