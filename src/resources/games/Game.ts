import { User } from "../users/User";

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
