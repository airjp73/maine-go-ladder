export interface User {
  id: string;
  name: string;
  ladder_rung: number;
  streak: number;
  games?: Game[];
}

export type NewUser = Pick<User, "name" | "ladder_rung">;

export interface Game {
  id: string;
  black: User;
  white: User;
  winner: string;
  created_at: string;
}

export interface NewGame {
  black: string;
  white: string;
  winner: string;
}
