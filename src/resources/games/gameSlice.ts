import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { NewGame, Game } from "./Game";
import { AppState } from "../../core/store";
import LoadingStates from "../../common/enum/LoadingStates";
import performFetch from "../../common/api/performFetch";

export const fetchGames = createAsyncThunk<Game[], string>(
  "games/get-all",
  async (userId) => {
    const response = await performFetch(`/api/games?userId=${userId}`);
    return response.json();
  }
);

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
  initialState: gameAdapter.getInitialState({
    loading: LoadingStates.IDLE,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGames.pending, (state) => {
      state.loading = LoadingStates.LOADING;
    });

    builder.addCase(fetchGames.rejected, (state) => {
      state.loading = LoadingStates.COMPLETE;
    });

    builder.addCase(fetchGames.fulfilled, (state, action) => {
      gameAdapter.setAll(state, action.payload);
      state.loading = LoadingStates.COMPLETE;
    });
  },
});

export default gameSlice;
