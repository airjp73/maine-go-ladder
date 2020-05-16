import { Game } from "../games/Game";

export interface User {
  id: string;
  name: string;
  ladder_rung: number;
  streak: number;
  games?: Game[];
  archived: boolean;
}

export type NewUser = Pick<User, "name" | "ladder_rung">;
