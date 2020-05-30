import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { NewGame, Game } from "./Game";
import { AppState } from "../../core/store";
import LoadingStates, {
  UserLoadingState,
} from "../../common/enum/LoadingStates";
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
    loading: {} as UserLoadingState,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGames.pending, (state, action) => {
      if (state.loading[action.meta.arg] !== LoadingStates.COMPLETE)
        state.loading[action.meta.arg] = LoadingStates.LOADING;
    });

    builder.addCase(fetchGames.rejected, (state, action) => {
      state.loading[action.meta.arg] = LoadingStates.COMPLETE;
    });

    builder.addCase(fetchGames.fulfilled, (state, action) => {
      gameAdapter.setAll(state, action.payload);
      state.loading[action.meta.arg] = LoadingStates.COMPLETE;
    });
  },
});

export default gameSlice;
