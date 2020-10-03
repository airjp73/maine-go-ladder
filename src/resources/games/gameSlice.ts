import { NewGame, Game } from "./Game";
import performFetch from "../../common/api/performFetch";
import { PaginatedResponse } from "../../types/apiTypes";

export const GAMES_QUERY = "games-query";

export const fetchGames = async (
  key: string,
  userId: string,
  page = 0
): Promise<PaginatedResponse<Game>> => {
  const response = await performFetch(
    `/api/games?userId=${userId}&page=${page}`
  );
  return response.json();
};

export const postGame = async (payload: NewGame) => {
  await performFetch("/api/record-game", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json",
    },
  });
};
