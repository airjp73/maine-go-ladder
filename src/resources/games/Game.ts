import { User } from "../users/User";

export interface Game {
  id: string;
  black: string;
  white: string;
  winner: string;
  created_at: string;
  updated_at: string;
}

export interface NewGame {
  black: string;
  white: string;
  winner: string;
}
