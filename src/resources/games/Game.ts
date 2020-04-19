import { User } from "../users/User";

export type GamePlayer = Pick<User, "id" | "name">;
export interface Game {
  id: string;
  black: GamePlayer;
  white: GamePlayer;
  winner: string;
  created_at: string;
  updated_at: string;
}

export interface NewGame {
  black: string;
  white: string;
  winner: string;
}
