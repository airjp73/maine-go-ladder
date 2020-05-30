import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { AppState } from "../../core/store";
import LoadingStates, {
  UserLoadingState,
} from "../../common/enum/LoadingStates";
import performFetch from "../../common/api/performFetch";
import { LadderHistoryItem } from "./LadderHistoryItem";

export const fetchLadderHistory = createAsyncThunk<LadderHistoryItem[], string>(
  "ladder-history/get-all",
  async (userId) => {
    const response = await performFetch(`/api/users/${userId}/ladder-history`);
    return response.json();
  }
);

const ladderAdapter = createEntityAdapter<LadderHistoryItem>({
  selectId: (item) => item.id,
  sortComparer: (a, b) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
});

export const ladderSelectors = ladderAdapter.getSelectors(
  (state: AppState) => state.ladderHistory
);

export const getLadderHistoryForUser = createSelector(
  [ladderSelectors.selectAll, (s: AppState, userId: string) => userId],
  (items, userId) => items.filter((item) => item.user === userId)
);

const ladderSlice = createSlice({
  name: "users",
  initialState: ladderAdapter.getInitialState({
    loading: {} as UserLoadingState,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLadderHistory.pending, (state, action) => {
      if (state.loading[action.meta.arg] !== LoadingStates.COMPLETE)
        state.loading[action.meta.arg] = LoadingStates.LOADING;
    });

    builder.addCase(fetchLadderHistory.rejected, (state, action) => {
      state.loading[action.meta.arg] = LoadingStates.COMPLETE;
    });

    builder.addCase(fetchLadderHistory.fulfilled, (state, action) => {
      ladderAdapter.setAll(state, action.payload);
      state.loading[action.meta.arg] = LoadingStates.COMPLETE;
    });
  },
});

export default ladderSlice;
