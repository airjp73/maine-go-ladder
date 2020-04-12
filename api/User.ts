export interface User {
  id: string;
  name: string;
  ladder_rung: number;
}

export interface Game {
  id: string;
  black: User;
  white: User;
  winner: string;
  created_at: string;
}

export interface UserWithGames {
  id: string;
  name: string;
  ladder_rung: number;
  streak: number;
  games_as_white: Game[];
  games_as_black: Game[];
}
