import { createAsyncThunk } from "@reduxjs/toolkit";
import { NewGame, Game } from "./Game";
import performFetch from "../../common/api/performFetch";
import { PaginatedResponse } from "../../types/apiTypes";

export const fetchGames = async (
  key: string,
  userId: string,
  page = 0
): Promise<PaginatedResponse<Game>> => {
  console.log(key, userId, page);
  const response = await performFetch(
    `/api/games?userId=${userId}&page=${page}`
  );
  return response.json();
};

export const postGame = createAsyncThunk<void, NewGame>(
  "games/post",
  async (payload) => {
    await performFetch("/api/record-game", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "content-type": "application/json",
      },
    });
  }
);
