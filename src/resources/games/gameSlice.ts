import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { NewGame, Game } from "./Game";
import { AppState } from "../../core/store";

export const fetchGames = createAsyncThunk<Game[], string>(
  "games/get-all",
  async (userId) => {
    const response = await fetch(`/api/games?userId=${userId}`);
    return response.json();
  }
);

export const postGame = createAsyncThunk<void, NewGame>(
  "games/post",
  async (payload) => {
    await fetch("/api/record-game", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "content-type": "application/json",
      },
    });
  }
);

const gameAdapter = createEntityAdapter<Game>({
  selectId: (user) => user.id,
  sortComparer: (a, b) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
});

export const gameSelectors = gameAdapter.getSelectors(
  (state: AppState) => state.games
);

const gameSlice = createSlice({
  name: "users",
  initialState: gameAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGames.fulfilled, (state, action) => {
      gameAdapter.setAll(state, action.payload);
    });
  },
});

export default gameSlice;
