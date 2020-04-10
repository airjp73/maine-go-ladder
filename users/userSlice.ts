import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../api/User";
import loadingSlice from "../loading/loadingSlice";

export enum UserStates {
  DEFAULT,
  MATCHUP,
}

interface UserState {
  currentState: UserStates;
  selectedUser: User | null;
  matchup: User | null;
}

const userSlice = createSlice({
  name: "users",
  initialState: {
    selectedUser: null,
    currentState: UserStates.DEFAULT,
    matchup: null,
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
    deselectUser: (state, action: PayloadAction<User>) => {
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
  extraReducers: {
    [loadingSlice.actions.onNavigate.type]: (state) => {
      state.selectedUser = null;
    },
  },
});

export default userSlice;
