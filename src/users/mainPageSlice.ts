import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { User } from "../resources/users/User";

export enum UserStates {
  DEFAULT = "DEFAULT",
  MATCHUP = "MATCHUP",
}

interface UserState {
  currentState: UserStates;
  selectedUser: User | null;
  matchup: User | null;
}

const userAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id,
  sortComparer: (a, b) => a.ladder_rung - b.ladder_rung,
});

const mainPageSlice = createSlice({
  name: "users",
  initialState: {
    selectedUser: null,
    currentState: UserStates.DEFAULT,
    matchup: null,
    users: userAdapter.getInitialState(),
  } as UserState,
  reducers: {
    selectUser: (state, action: PayloadAction<User>) => {
      switch (state.currentState) {
        case UserStates.DEFAULT:
          state.selectedUser = action.payload;
          break;
        case UserStates.MATCHUP:
          state.matchup = action.payload;
          break;
      }
    },
    deselectUser: (state) => {
      switch (state.currentState) {
        case UserStates.DEFAULT:
          state.selectedUser = null;
          break;
        case UserStates.MATCHUP:
          state.matchup = null;
          break;
      }
    },
    calculateMatchup: (state) => {
      if (state.selectedUser) state.currentState = UserStates.MATCHUP;
    },
    cancelMatchup: (state) => {
      state.matchup = null;
      state.currentState = UserStates.DEFAULT;
      state.selectedUser = null;
    },
  },
  extraReducers: {},
});

export default mainPageSlice;
